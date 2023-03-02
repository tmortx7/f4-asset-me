import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { InstrumentTypeSchema, EditInstrumentTypeSchema } from "../../../schema/instrumenttype.schema";

const defaultInstrumentTypeSelect = Prisma.validator<Prisma.InstrumentTypeSelect>()({
  id: true,
  type: true,
  description: true,
  mvId: true,
  instfunctionId: true,
});

export const instrumentTypeRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.instrumentType.findMany({
      select: defaultInstrumentTypeSelect,
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
      const instx = await prisma.instrumentType.findUnique({
        where: { id },
        select: defaultInstrumentTypeSelect,
      });
      if (!instx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No instrumentFunction with id '${id}'`,
        });
      }
      return instx;
    }),
  add: publicProcedure.input(InstrumentTypeSchema).mutation(async ({ input }) => {
    const mvValue = await prisma.measuredVariable.findUnique({
        where: { id:input.mvId },
      });

    const instValue = await prisma.instrumentFunction.findUnique({
        where: { id:input.instfunctionId },
      });

      const str= (`${mvValue?.alias!}${instValue?.alias!}`).replace(/\s/g, '')

    try {

      const instx = await prisma.instrumentType.create({
        data: {
          ...input,
          type: str
        },
        select: defaultInstrumentTypeSelect,
      });
      return instx;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "InstrumentType already exists",
          });
        }
      }

      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  edit: publicProcedure.input(EditInstrumentTypeSchema).mutation(async ({ input }) => {

    return await prisma.instrumentType.update({
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
      return await prisma.instrumentType.delete({
        where: { id: input.id },
      });
    }),
});
