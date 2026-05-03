import { z } from "zod";
import { router, adminProcedure, teacherOrAdminProcedure } from "../trpc";
import { prisma } from "@/lib/db";
import { TRPCError } from "@trpc/server";

export const adminRouter = router({
  getStats: teacherOrAdminProcedure.query(async () => {
    const [coursesCount, usersCount, enrollmentsCount, certificatesCount] = await Promise.all([
      prisma.course.count(),
      prisma.user.count(),
      prisma.enrollment.count(),
      prisma.certificate.count(),
    ]);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const [recentEnrollments, recentCourses] = await Promise.all([
      prisma.enrollment.findMany({
        where: {
          enrolledAt: {
            gte: startDate,
          },
        },
        select: {
          enrolledAt: true,
        },
      }),
      prisma.course.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    const activity = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      const dayKey = date.toISOString().slice(0, 10);

      return {
        label: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        dayKey,
        enrollments: 0,
        newCourses: 0,
      };
    });

    const activityMap = new Map(activity.map((entry) => [entry.dayKey, entry]));

    for (const enrollment of recentEnrollments) {
      const key = enrollment.enrolledAt.toISOString().slice(0, 10);
      const row = activityMap.get(key);
      if (row) {
        row.enrollments += 1;
      }
    }

    for (const course of recentCourses) {
      const key = course.createdAt.toISOString().slice(0, 10);
      const row = activityMap.get(key);
      if (row) {
        row.newCourses += 1;
      }
    }

    return {
      coursesCount,
      usersCount,
      enrollmentsCount,
      certificatesCount,
      activity: activity.map(({ label, enrollments, newCourses }) => ({
        label,
        enrollments,
        newCourses,
      })),
    };
  }),

  getAllCourses: teacherOrAdminProcedure
    .input(z.object({ teacherId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { userRole, session } = ctx;

      const where = {
        ...(userRole === "teacher" && { teacherId: session.user.id }),
        ...(input.teacherId && { teacherId: input.teacherId }),
      };

      return await prisma.course.findMany({
        where,
        include: {
          modules: true,
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  getCourseById: teacherOrAdminProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const { userRole, session } = ctx;

    // 1. Build dynamic authorization filter
    const whereClause = {
      id: input.id,
      ...(userRole !== "admin" && { teacherId: session.user.id }),
    };

    // 2. Execute a single query with shared include logic
    return await prisma.course.findUnique({
      where: whereClause,
      include: {
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
            },
          },
        },
        test: {
          include: {
            questions: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  }),

  createCourse: teacherOrAdminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        description: z.string(),
        difficulty: z.string(),
        duration: z.number().nonnegative(),
        isPublished: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Ensure the course is linked to the user creating it
      return await prisma.course.create({
        data: {
          ...input,
          teacherId: ctx.session.user.id,
        },
      });
    }),

  updateCourse: teacherOrAdminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        difficulty: z.string().optional(),
        duration: z.number().optional(),
        isPublished: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const isAdmin = ctx.userRole === "admin";

      // If admin, they can update any course.
      // If teacher, the update only succeeds if the teacherId matches.
      return await prisma.course.update({
        where: {
          id,
          ...(isAdmin ? {} : { teacherId: ctx.session.user.id }),
        },
        data,
      });
    }),

  deleteCourse: teacherOrAdminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const isAdmin = ctx.userRole === "admin";

    if (isAdmin) {
      await prisma.course.delete({
        where: { id: input.id },
      });
    } else {
      const result = await prisma.course.deleteMany({
        where: {
          id: input.id,
          teacherId: ctx.session.user.id,
        },
      });
      if (result.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found or not authorized" });
      }
    }

    return { success: true };
  }),

  // Add more admin procedures as needed for modules, lessons, etc.
  createModule: teacherOrAdminProcedure
    .input(
      z.object({
        courseId: z.string(),
        title: z.string(),
        description: z.string(),
        order: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const isAdmin = ctx.userRole === "admin";

      const course = await prisma.course.findUnique({
        where: {
          id: input.courseId,
          ...(isAdmin ? {} : { teacherId: ctx.session.user.id }),
        },
      });
      if (!course) throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });

      return await prisma.module.create({
        data: input,
      });
    }),

  createLesson: teacherOrAdminProcedure
    .input(
      z.object({
        moduleId: z.string(),
        title: z.string(),
        content: z.string(),
        duration: z.number(),
        order: z.number(),
        videoUrl: z.string().optional(),
        codeExample: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.lesson.create({
        data: input,
      });
    }),

  deleteModule: teacherOrAdminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    await prisma.module.delete({
      where: { id: input.id },
    });
    return { success: true };
  }),

  updateModule: teacherOrAdminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        order: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.module.update({
        where: { id },
        data,
      });
    }),

  deleteLesson: teacherOrAdminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    await prisma.lesson.delete({
      where: { id: input.id },
    });
    return { success: true };
  }),

  updateLesson: teacherOrAdminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        duration: z.number().optional(),
        order: z.number().optional(),
        videoUrl: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.lesson.update({
        where: { id },
        data,
      });
    }),

  createTest: teacherOrAdminProcedure
    .input(
      z.object({
        courseId: z.string(),
        title: z.string(),
        description: z.string(),
        passingScore: z.number(),
        timeLimit: z.number().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.test.create({
        data: input,
        include: { questions: true },
      });
    }),

  updateTestSettings: teacherOrAdminProcedure
    .input(
      z.object({
        courseId: z.string(),
        passingScore: z.number().optional(),
        timeLimit: z.number().nullable().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { courseId, ...data } = input;
      return await prisma.test.updateMany({
        where: { courseId },
        data,
      });
    }),

  addQuestion: teacherOrAdminProcedure
    .input(
      z.object({
        testId: z.string(),
        question: z.string(),
        type: z.string(),
        options: z.string(),
        correctAnswer: z.string(),
        explanation: z.string().optional(),
        points: z.number().optional(),
        order: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.question.create({
        data: {
          ...input,
          points: input.points ?? 1,
        },
      });
    }),

  deleteQuestion: teacherOrAdminProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    await prisma.question.delete({
      where: { id: input.id },
    });
    return { success: true };
  }),

  updateTest: teacherOrAdminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        passingScore: z.number().optional(),
        timeLimit: z.number().nullable().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.test.update({
        where: { id },
        data,
      });
    }),

  updateQuestion: teacherOrAdminProcedure
    .input(
      z.object({
        id: z.string(),
        question: z.string().optional(),
        type: z.string().optional(),
        options: z.string().optional(),
        correctAnswer: z.string().optional(),
        explanation: z.string().optional(),
        points: z.number().optional(),
        order: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await prisma.question.update({
        where: { id },
        data,
      });
    }),
});
