import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const moduleResultRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        //@TODO imageUrl: z.string().optional(),
        prompt: z.record(z.string(), z.string()),
        moduleId: z.string(),
        imageProjectId: z.string(),
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

      // provisionally set imageurl
      const imageUrl = "https://placehold.co/600x400";

      return ctx.db.moduleResult.create({
        data: {
          imageUrl: imageUrl,
          prompt: input.prompt,
          moduleId: input.moduleId,
          imageProjectId: input.imageProjectId,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const moduleResult = await ctx.db.moduleResult.findUnique({
        where: { id: input.id },
        include: {
          module: true,
          imageProject: true,
        },
      });

      if (!moduleResult || moduleResult.imageProject.userId !== ctx.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Module result not found or access denied",
        });
      }

      return moduleResult;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        imageUrl: z.string().optional(),
        prompt: z.record(z.string(), z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const moduleResult = await ctx.db.moduleResult.findUnique({
        where: { id: input.id },
        include: { imageProject: true },
      });

      if (!moduleResult || moduleResult.imageProject.userId !== ctx.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Module result not found or access denied",
        });
      }

      return ctx.db.moduleResult.update({
        where: { id: input.id },
        data: {
          imageUrl: input.imageUrl,
          prompt: input.prompt,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const moduleResult = await ctx.db.moduleResult.findUnique({
        where: { id: input.id },
        include: { imageProject: true },
      });

      if (!moduleResult || moduleResult.imageProject.userId !== ctx.userId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Module result not found or access denied",
        });
      }

      return ctx.db.moduleResult.delete({
        where: { id: input.id },
      });
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        moduleId: z.string().optional(),
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

      return ctx.db.moduleResult.findMany({
        where: {
          moduleId: input.moduleId,
          imageProjectId: input.imageProjectId,
          imageProject: { userId: ctx.userId },
        },
        include: {
          module: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),
});
