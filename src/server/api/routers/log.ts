import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { LogSchema, EditLogSchema } from "../../../schema/log.schema";

const defaultLogSelect = Prisma.validator<Prisma.LogSelect>()({
  id: true,
  log: true,
  siteId: true,
  createdAt: true,
});

export const logRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.log.findMany({
      select: defaultLogSelect,
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
      const logx = await prisma.log.findUnique({
        where: { id },
        select: defaultLogSelect,
      });
      if (!logx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No log with id '${id}'`,
        });
      }
      return logx;
    }),
  add: publicProcedure.input(LogSchema).mutation(async ({ input }) => {
    const logx = await prisma.log.create({
      data: {
        ...input,
      },
      select: defaultLogSelect,
    });
    return logx;
  }),
  edit: publicProcedure.input(EditLogSchema).mutation(async ({ input }) => {
    return await prisma.log.update({
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
      return await prisma.log.delete({
        where: { id: input.id },
      });
    }),
});
