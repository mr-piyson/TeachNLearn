import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { testId, answers } = await request.json()

    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: true,
      },
    })

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    // Calculate score
    let correctCount = 0
    const feedback = test.questions.map((question) => {
      const userAnswer = answers[question.id]
      const correct = userAnswer === question.correctAnswer

      if (correct) {
        correctCount++
      }

      return {
        questionId: question.id,
        question: question.question,
        userAnswer: userAnswer || "Not answered",
        correctAnswer: question.correctAnswer,
        correct,
        explanation: question.explanation,
      }
    })

    const score = Math.round((correctCount / test.questions.length) * 100)
    const passed = score >= test.passingScore

    // Save result
    await prisma.$transaction(async (tx) => {
      await tx.testResult.create({
        data: {
          userId: session.user.id,
          testId: test.id,
          score,
          passed,
          answers: JSON.stringify(answers),
        },
      })

      if (passed) {
        // Mark enrollment as complete
        await tx.enrollment.update({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: test.courseId,
            },
          },
          data: {
            progress: 100,
            completedAt: new Date(),
          },
        })

        // Generate certificate if it doesn't exist
        const existingCert = await tx.certificate.findUnique({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: test.courseId,
            },
          },
        })

        if (!existingCert) {
          const certificateNumber = `VGD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
          await tx.certificate.create({
            data: {
              userId: session.user.id,
              courseId: test.courseId,
              certificateNumber,
            },
          })
        }
      }
    })

    return NextResponse.json({
      score,
      passed,
      feedback,
    })
  } catch (error) {
    console.error("Failed to submit test:", error)
    return NextResponse.json({ error: "Failed to submit test" }, { status: 500 })
  }
}
