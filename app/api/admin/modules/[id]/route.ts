import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { headers } from "next/headers"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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
    await prisma.module.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete module:", error)
    return NextResponse.json({ error: "Failed to delete module" }, { status: 500 })
  }
}
