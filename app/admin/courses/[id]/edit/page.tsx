import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import CourseForm from "@/components/admin/course-form"
import ModuleManager from "@/components/admin/module-manager"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/dashboard")
  }else {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (user?.role !== "admin") {
      redirect("/dashboard")
    }
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Edit Course: {course.title}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content">Modules & Lessons</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <CourseForm course={course} />
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ModuleManager courseId={course.id} modules={course.modules} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
