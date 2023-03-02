import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import {
  LoopTagSchema,
  EditLoopTagSchema,
} from "../../../schema/looptag.schema";

const defaultLoopTagSelect = Prisma.validator<Prisma.LoopTagSelect>()({
  id: true,
  tag: true,
  order: true,
  loopId: true,
  typeId: true,
  note: true,
});

export const loopTagRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.loopTag.findMany({
      select: defaultLoopTagSelect,
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
      const loopx = await prisma.loopTag.findUnique({
        where: { id },
        select: defaultLoopTagSelect,
      });
      if (!loopx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No loopTag with id '${id}'`,
        });
      }
      return loopx;
    }),
  add: publicProcedure.input(LoopTagSchema).mutation(async ({ input }) => {
    const loopValue = await prisma.loop.findUnique({
      where: { id: input.loopId },
    });

    const siteValue = await prisma.site.findUnique({
      where: { id: loopValue?.siteId },
    });


    const typeValue = await prisma.instrumentType.findUnique({
      where: { id: input.typeId },
    });

    const str = (`${siteValue?.alias}-${typeValue?.type}-${loopValue?.numberic}`).replace(/\s/g, '')
    try {
      const loopx = await prisma.loopTag.create({
        data: {
          ...input,
          tag: str
        },
        select: defaultLoopTagSelect,
      });
      return loopx;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "LoopTag already exists",
          });
        }
      }

      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  edit: publicProcedure.input(EditLoopTagSchema).mutation(async ({ input }) => {

     const loopValue = await prisma.loop.findUnique({
      where: { id: input.loopId },
    });

    const siteValue = await prisma.site.findUnique({
      where: { id: loopValue?.siteId },
    });

    const typeValue = await prisma.instrumentType.findUnique({
      where: { id: input.typeId },
    });

    const str = (`${siteValue?.alias}-${typeValue?.type}-${loopValue?.numberic}`).replace(/\s/g, '')
    return await prisma.loopTag.update({
      where: {
        id: input.id,
      },
      data: {
        ...input,
        tag: str
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
      return await prisma.loopTag.delete({
        where: { id: input.id },
      });
    }),
});
