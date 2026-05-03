import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "@/lib/db";

export const publicRouter = router({
  activeUsers: publicProcedure.query(async () => {
    return await prisma.user.count();
  }),
});
