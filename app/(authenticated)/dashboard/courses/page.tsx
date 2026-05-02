"use client";

import { Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import CourseList from "@/components/admin/course-list";

export default function CoursesPage() {
  const { data: user, isLoading: userLoading } = trpc.users.me.useQuery();
  const { data: courses, isLoading } = trpc.admin.getAllCourses.useQuery({ teacherId: user?.id });

  if (isLoading || userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <CourseList courses={courses || []} />;
}
