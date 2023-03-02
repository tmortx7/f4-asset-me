import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { CategorySchema, EditCategorySchema } from "../../../schema/category.schema";

const defaultCategorySelect = Prisma.validator<Prisma.CategorySelect>()({
  id: true,
  category: true,
  description: true,
});

export const categoryRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.category.findMany({
      select: defaultCategorySelect,
    });
  }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id } = input;
      const sitex = await prisma.category.findUnique({
        where: { id },
        select: defaultCategorySelect,
      });
      if (!sitex) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No category with id '${id}'`,
        });
      }
      return sitex;
    }),
  add: publicProcedure.input(CategorySchema).mutation(async ({ input }) => {
    try {
      const sitex = await prisma.category.create({
        data: {
          ...input,
        },
        select: defaultCategorySelect,
      });
      return sitex;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "Category already exists",
          });
        }
      }

      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  edit: publicProcedure.input(EditCategorySchema).mutation(async ({ input }) => {
    return await prisma.category.update({
      where: {
        id: input.id,
      },
      data: {
        ...input,
      },
    });
  }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.category.delete({
        where: { id: input.id },
      });
    }),
});
