import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const { question, type, options, correctAnswer, explanation, order } = await request.json()
    const testId = params.id

    const newQuestion = await prisma.question.create({
      data: {
        testId,
        question,
        type,
        options,
        correctAnswer,
        explanation,
        order,
      },
    })

    return NextResponse.json(newQuestion)
  } catch (error) {
    console.error("Failed to add question:", error)
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 })
  }
}
