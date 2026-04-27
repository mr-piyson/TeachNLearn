"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  duration: number;
  modules: unknown[];
  _count: {
    enrollments: number;
  };
}

interface CourseGridProps {
  courses: Course[];
  userId: string;
}

export default function CourseGrid({ courses, userId }: CourseGridProps) {
  const router = useRouter();
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const utils = trpc.useUtils();
  const enroll = trpc.enrollments.create.useMutation();

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);

    try {
      await enroll.mutateAsync({ courseId });
      toast.success("Successfully enrolled in course!");
      utils.courses.getEnrolled.invalidate();
      router.refresh();
    } catch (error: any) {
      console.error("Failed to enroll:", error);
      if (error.message?.includes("Already enrolled")) {
        toast.warning("You are already enrolled in this course");
      } else {
        toast.error(error.message || "Failed to enroll");
      }
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="capitalize">
                  {course.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course._count.enrollments} enrolled</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Link href={`/courses/${course.slug}`} className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  View Details
                </Button>
              </Link>
              <Button onClick={() => handleEnroll(course.id)} disabled={enrolling === course.id} className="flex-1">
                {enrolling === course.id ? "Enrolling..." : "Enroll"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
