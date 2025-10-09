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
    const module = await prisma.module.create({
      data: {
        courseId: params.id,
        title: data.title,
        description: data.description,
        order: data.order,
      },
      include: {
        lessons: true,
      },
    })

    return NextResponse.json(module)
  } catch (error) {
    console.error("Failed to create module:", error)
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 })
  }
}
