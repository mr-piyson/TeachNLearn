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
    const { title, description, passingScore, timeLimit } = await request.json()
    const courseId = params.id

    const test = await prisma.test.create({
      data: {
        courseId,
        title,
        description,
        passingScore,
        timeLimit,
      },
      include: {
        questions: true,
      },
    })

    return NextResponse.json(test)
  } catch (error) {
    console.error("Failed to create test:", error)
    return NextResponse.json({ error: "Failed to create test" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const data = await request.json()
    const courseId = params.id

    const test = await prisma.test.findFirst({
      where: { courseId },
    })

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    const updatedTest = await prisma.test.update({
      where: { id: test.id },
      data,
    })

    return NextResponse.json(updatedTest)
  } catch (error) {
    console.error("Failed to update test:", error)
    return NextResponse.json({ error: "Failed to update test" }, { status: 500 })
  }
}
