import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { MeasuredVariableSchema, EditMeasuredVariableSchema } from "../../../schema/measuredvariable.schema";

const defaultMeasuredVariableSelect = Prisma.validator<Prisma.MeasuredVariableSelect>()({
  id: true,
  variablex: true,
  alias: true,
});

export const measuredVariableRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.measuredVariable.findMany({
      select: defaultMeasuredVariableSelect,
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
      const mvx = await prisma.measuredVariable.findUnique({
        where: { id },
        select: defaultMeasuredVariableSelect,
      });
      if (!mvx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No measuredVariable with id '${id}'`,
        });
      }
      return mvx;
    }),
  add: publicProcedure.input(MeasuredVariableSchema).mutation(async ({ input }) => {
    try {
      const mvx = await prisma.measuredVariable.create({
        data: {
          ...input,
        },
        select: defaultMeasuredVariableSelect,
      });
      return mvx;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "MeasuredVariable already exists",
          });
        }
      }

      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  edit: publicProcedure.input(EditMeasuredVariableSchema).mutation(async ({ input }) => {
    return await prisma.measuredVariable.update({
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
      return await prisma.measuredVariable.delete({
        where: { id: input.id },
      });
    }),
});
