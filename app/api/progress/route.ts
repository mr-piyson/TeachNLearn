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
    const { lessonId, completed } = await request.json()

    const progress = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    // Update enrollment progress
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (lesson) {
      const courseId = lesson.module.courseId
      const allLessons = lesson.module.course.modules.flatMap((m) => m.lessons)

      const completedLessons = await prisma.progress.count({
        where: {
          userId: session.user.id,
          lessonId: { in: allLessons.map((l) => l.id) },
          completed: true,
        },
      })

      const progressPercentage = Math.round((completedLessons / allLessons.length) * 100)

      await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: session.user.id,
            courseId,
          },
        },
        data: {
          progress: progressPercentage,
          completedAt: progressPercentage === 100 ? new Date() : null,
        },
      })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Failed to update progress:", error)
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
