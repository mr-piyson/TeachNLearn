import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"

export async function POST(request: NextRequest) {
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
    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        difficulty: data.difficulty,
        duration: data.duration,
        isPublished: data.isPublished,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Failed to create course:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
