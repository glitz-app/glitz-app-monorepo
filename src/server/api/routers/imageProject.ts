import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const imageProjectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      // Create the project and thread in a transaction
      return ctx.db.$transaction(async (tx) => {
        // First create the project
        const project = await tx.imageProject.create({
          data: {
            name: input.name,
            status: "CREATED",
            userId: ctx.userId,
          },
        });

        // Then create a thread associated with the project
        const thread = await tx.thread.create({
          data: {
            imageProjectId: project.id,
          },
        });

        return {
          ...project,
          thread,
        };
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const imageProject = await ctx.db.imageProject.findUnique({
        where: { id: input.id, userId: ctx.userId },
        include: {
          modules: {
            include: {
              type: true,
              results: true,
            },
          },
          moduleResults: true,
        },
      });

      if (!imageProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Image project not found",
        });
      }

      return imageProject;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        status: z
          .enum(["CREATED", "IN_PROGRESS", "COMPLETED", "DELETED"])
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const imageProject = await ctx.db.imageProject.findUnique({
        where: { id: input.id, userId: ctx.userId },
      });

      if (!imageProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Image project not found",
        });
      }

      return ctx.db.imageProject.update({
        where: { id: input.id },
        data: {
          name: input.name,
          status: input.status,
        },
      });
    }),

  // Create a module and add it to the project
  addNewModule: protectedProcedure
    .input(
      z.object({
        imageProjectId: z.string(),
        moduleTypeId: z.string(),
        threadId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.imageProject.findUnique({
        where: { id: input.imageProjectId, userId: ctx.userId },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Image project not found",
        });
      }

      const newModule = await ctx.db.module.create({
        data: {
          typeId: input.moduleTypeId,
          imageProjectId: input.imageProjectId,
          threadId: input.threadId,
        },
      });

      return newModule;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const imageProject = await ctx.db.imageProject.findUnique({
        where: { id: input.id, userId: ctx.userId },
      });

      if (!imageProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Image project not found",
        });
      }

      return ctx.db.imageProject.delete({
        where: { id: input.id },
      });
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.imageProject.findMany({
      where: { userId: ctx.userId },
      orderBy: { createdAt: "desc" },
    });
  }),
});
