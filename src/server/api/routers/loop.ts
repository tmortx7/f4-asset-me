import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { LoopSchema, EditLoopSchema } from "../../../schema/loop.schema";

const defaultLoopSelect = Prisma.validator<Prisma.LoopSelect>()({
  id: true,
  numberic: true,
  siteId: true,
  mvId: true,
  loop: true,
  service: true,
  tags: true,
});

export const loopRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.loop.findMany({
      select: defaultLoopSelect,
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
      const loopx = await prisma.loop.findUnique({
        where: { id },
        select: defaultLoopSelect,
      });
      if (!loopx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No loop with id '${id}'`,
        });
      }
      return loopx;
    }),
  add: publicProcedure.input(LoopSchema).mutation(async ({ input }) => {
    const siteValue = await prisma.site.findUnique({
        where: { id:input.siteId },
      });

    const mvValue = await prisma.measuredVariable.findUnique({
      where: { id:input.mvId },
    });

    const str=(`${siteValue?.alias }-${mvValue?.alias}-${input.numberic}`).replace(/\s/g, '')

    const loopx = await prisma.loop.create({

      data: {
        ...input,
        loop: str
      },
      select: defaultLoopSelect,
    });
    return loopx;
  }),
  edit: publicProcedure.input(EditLoopSchema).mutation(async ({ input }) => {
    const siteValue = await prisma.site.findUnique({
        where: { id:input.siteId },
      });

    const mvValue = await prisma.measuredVariable.findUnique({
      where: { id:input.mvId },
    });

    const str=(`${siteValue?.alias }-${mvValue?.alias}-${input.numberic}`).replace(/\s/g, '')

    return await prisma.loop.update({
      where: {
        id: input.id,
      },
      data: {
        ...input,
        loop: str
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
      return await prisma.loop.delete({
        where: { id: input.id },
      });
    }),
});
