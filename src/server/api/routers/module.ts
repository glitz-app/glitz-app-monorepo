import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const moduleRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        typeId: z.string(),
        imageProjectId: z.string(),
        previousModuleId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the user has access to the imageProject
      const imageProject = await ctx.db.imageProject.findUnique({
        where: { id: input.imageProjectId, userId: ctx.userId },
      });
      if (!imageProject) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied to this image project",
        });
      }
      return ctx.db.module.create({
        data: {
          typeId: input.typeId,
          imageProjectId: input.imageProjectId,
          previousModuleId: input.previousModuleId,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const moduleData = await ctx.db.module.findUnique({
        where: { id: input.id },
        include: {
          type: true,
          results: true,
          imageProject: true,
          previousModule: true,
          nextModule: true,
        },
      });

      if (!moduleData || moduleData.imageProject?.userId !== ctx.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Module not found or access denied",
        });
      }

      return moduleData;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        typeId: z.string().optional(),
        imageProjectId: z.string().optional(),
        previousModuleId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.module.update({
        where: { id: input.id },
        data: {
          typeId: input.typeId,
          imageProjectId: input.imageProjectId,
          previousModuleId: input.previousModuleId,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.module.delete({
        where: { id: input.id },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        imageProjectId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // If imageProjectId is provided, check user's access
      if (input.imageProjectId) {
        const imageProject = await ctx.db.imageProject.findUnique({
          where: { id: input.imageProjectId, userId: ctx.userId },
        });
        if (!imageProject) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Access denied to this image project",
          });
        }
      }

      return ctx.db.module.findMany({
        where: {
          imageProjectId: input.imageProjectId,
          imageProject: { userId: ctx.userId },
        },
        include: {
          type: true,
          results: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),
});
