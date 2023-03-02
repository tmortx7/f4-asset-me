import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { EditModelSchema, ModelSchema } from "../../../schema/model.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";

const defaultModelSelect = Prisma.validator<Prisma.ModelSelect>()({
  id: true,
  model: true,
  serialno: true,
  note: true,
  manufacturerId: true,
});

export const modelRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.model.findMany({
      select: defaultModelSelect,
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
      const modelx = await prisma.model.findUnique({
        where: { id },
        select: defaultModelSelect,
      });
      if (!modelx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No model with id '${id}'`,
        });
      }
      return modelx;
    }),
  add: publicProcedure.input(ModelSchema).mutation(async ({ input }) => {
    try {
      const modelx = await prisma.model.create({
        data: {
          ...input,
        },
        select: defaultModelSelect,
      });
      return modelx;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "Model already exists",
          });
        }
      }

      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  edit: publicProcedure.input(EditModelSchema).mutation(async ({ input }) => {
    return await prisma.model.update({
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
      return await prisma.model.delete({
        where: { id: input.id },
      });
    }),
});
