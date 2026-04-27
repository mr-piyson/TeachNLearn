import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import CertificateView from "@/components/certificate/certificate-view"
import { trpc } from "@/lib/trpc/server"

export default async function CertificatePage({ params }: { params: { slug: string } }) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/auth/signin")
  }

  const course = await prisma.course.findUnique({
    where: { slug: (await params).slug },
  })

  if (!course) {
    notFound()
  }

  try {
    const certificate = await trpc.certificates.getOrCreate({ courseId: course.id });
    return <CertificateView certificate={certificate} course={course} user={session.user as any} />
  } catch (error: any) {
    if (error.message === "Test not found for this course") {
      redirect(`/courses/${(await params).slug}`)
    }
    if (error.message === "You must pass the test to earn a certificate") {
      redirect(`/courses/${(await params).slug}/test`)
    }
    throw error;
  }
}
