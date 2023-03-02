import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { EditAssetSchema, AssetSchema } from "../../../schema/asset.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";

const defaultAssetSelect = Prisma.validator<Prisma.AssetSelect>()({
  id: true,
  description: true,
  note: true,
  siteId: true,
  categoryId: true,
	modelId : true,
});

export const assetRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.asset.findMany({
      select: defaultAssetSelect,
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
      const assetx = await prisma.asset.findUnique({
        where: { id },
        select: defaultAssetSelect,
      });
      if (!assetx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No asset with id '${id}'`,
        });
      }
      return assetx;
    }),
  add: publicProcedure.input(AssetSchema).mutation(async ({ input }) => {
    try {
      const assetx = await prisma.asset.create({
        data: {
          ...input,
        },
        select: defaultAssetSelect,
      });
      return assetx;
    } catch (e) {
    console.log("error")
    }
  }),
  edit: publicProcedure.input(EditAssetSchema).mutation(async ({ input }) => {
    return await prisma.asset.update({
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
      return await prisma.asset.delete({
        where: { id: input.id },
      });
    }),
});
