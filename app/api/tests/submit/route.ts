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
    await prisma.testResult.create({
      data: {
        userId: session.user.id,
        testId: test.id,
        score,
        passed,
        answers: JSON.stringify(answers),
      },
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
