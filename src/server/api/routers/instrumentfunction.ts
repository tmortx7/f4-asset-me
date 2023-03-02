import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { InstrumentFunctionSchema, EditInstrumentFunctionSchema } from "../../../schema/instrumentfunction.schema";

const defaultInstrumentFunctionSelect = Prisma.validator<Prisma.InstrumentFunctionSelect>()({
  id: true,
  functionx: true,
  alias: true,
});

export const instrumentFunctionRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.instrumentFunction.findMany({
      select: defaultInstrumentFunctionSelect,
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
      const instx = await prisma.instrumentFunction.findUnique({
        where: { id },
        select: defaultInstrumentFunctionSelect,
      });
      if (!instx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No instrumentFunction with id '${id}'`,
        });
      }
      return instx;
    }),
  add: publicProcedure.input(InstrumentFunctionSchema).mutation(async ({ input }) => {
    try {
      const instx = await prisma.instrumentFunction.create({
        data: {
          ...input,
        },
        select: defaultInstrumentFunctionSelect,
      });
      return instx;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "InstrumentFunction already exists",
          });
        }
      }

      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  edit: publicProcedure.input(EditInstrumentFunctionSchema).mutation(async ({ input }) => {
    return await prisma.instrumentFunction.update({
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
      return await prisma.instrumentFunction.delete({
        where: { id: input.id },
      });
    }),
});
