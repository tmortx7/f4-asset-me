import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";
import { ManufacturerSchema, EditManufacturerSchema } from "../../../schema/manufacturer.schema";

const defaultManufacturerSelect = Prisma.validator<Prisma.ManufacturerSelect>()({
  id: true,
  name: true,
  note: true,
  models: true,
});

export const manufacturerRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.manufacturer.findMany({
      select: defaultManufacturerSelect,
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
      const manx = await prisma.manufacturer.findUnique({
        where: { id },
        select: defaultManufacturerSelect,
      });
      if (!manx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No manufacturer with id '${id}'`,
        });
      }
      return manx;
    }),
  add: publicProcedure.input(ManufacturerSchema).mutation(async ({ input }) => {
    try {
      const manx = await prisma.manufacturer.create({
        data: {
          ...input,
        },
        select: defaultManufacturerSelect,
      });
      return manx;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "Manufacturer already exists",
          });
        }
      }

      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  edit: publicProcedure.input(EditManufacturerSchema).mutation(async ({ input }) => {
    return await prisma.manufacturer.update({
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
      return await prisma.manufacturer.delete({
        where: { id: input.id },
      });
    }),
});
