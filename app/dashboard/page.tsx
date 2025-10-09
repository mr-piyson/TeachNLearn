import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import CourseGrid from "@/components/dashboard/course-grid"
import EnrolledCourses from "@/components/dashboard/enrolled-courses"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/auth/signin")
  }

  const [allCourses, enrolledCourses] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      include: {
        modules: true,
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.enrollment.findMany({
      where: { userId: session.user.id },
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
    }),
  ])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={session.user} />

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="my-courses" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            <TabsTrigger value="browse">Browse Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="my-courses" className="mt-6">
            <EnrolledCourses enrollments={enrolledCourses} userId={session.user.id} />
          </TabsContent>

          <TabsContent value="browse" className="mt-6">
            <CourseGrid courses={allCourses} userId={session.user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
