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
    const { courseId } = await request.json()

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 400 })
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
      },
    })

    return NextResponse.json(enrollment)
  } catch (error) {
    console.error("Failed to create enrollment:", error)
    return NextResponse.json({ error: "Failed to enroll" }, { status: 500 })
  }
}
