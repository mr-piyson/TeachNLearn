import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Eye } from "lucide-react"

export default async function AdminCoursesPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/dashboard")
  }else {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (user?.role !== "admin") {
      redirect("/dashboard")
    }
  }

  const courses = await prisma.course.findMany({
    include: {
      modules: true,
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Manage Courses</h1>
          <div className="flex gap-2">
            <Link href="/admin/courses/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Course
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/courses/${course.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/courses/${course.slug}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge variant={course.isPublished ? "default" : "secondary"}>
                    {course.isPublished ? "Published" : "Draft"}
                  </Badge>
                  <span className="capitalize">{course.difficulty}</span>
                  <span>{course.duration} minutes</span>
                  <span>{course.modules.length} modules</span>
                  <span>{course._count.enrollments} enrollments</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
