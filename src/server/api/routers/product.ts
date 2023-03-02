import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { EditProductSchema, ProductSchema } from "../../../schema/product.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";

const defaultProductSelect = Prisma.validator<Prisma.ProductSelect>()({
  id: true,
  name: true,
  price: true,
  description: true,
});

export const productRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.product.findMany({
      select: defaultProductSelect,
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
      const productx = await prisma.product.findUnique({
        where: { id },
        select: defaultProductSelect,
      });
      if (!productx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No product with id '${id}'`,
        });
      }
      return productx;
    }),
  add: publicProcedure.input(ProductSchema).mutation(async ({ input }) => {
    try {
      const productx = await prisma.product.create({
        data: {
          ...input,
        },
        select: defaultProductSelect,
      });
      return productx;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "Product already exists",
          });
        }
      }

      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  edit: publicProcedure.input(EditProductSchema).mutation(async ({ input }) => {
    return await prisma.product.update({
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
      return await prisma.product.delete({
        where: { id: input.id },
      });
    }),
});
