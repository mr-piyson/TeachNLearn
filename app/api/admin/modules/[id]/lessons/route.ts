import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }else {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select:{
        role: true
      }
    })

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const data = await request.json()
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: params.id,
        title: data.title,
        content: data.content,
        codeExample: data.codeExample || null,
        duration: data.duration,
        order: data.order,
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("Failed to create lesson:", error)
    return NextResponse.json({ error: "Failed to create lesson" }, { status: 500 })
  }
}
