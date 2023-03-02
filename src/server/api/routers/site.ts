import { createTRPCRouter, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db";
import { EditSiteSchema, SiteSchema } from "../../../schema/site.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import * as trpc from "@trpc/server";

const defaultSiteSelect = Prisma.validator<Prisma.SiteSelect>()({
  id: true,
  site: true,
  alias: true,
  note: true,
  categoryId: true,
  loops: true,
});

export const siteRouter = createTRPCRouter({
  list: publicProcedure.query(() => {
    return prisma.site.findMany({
      include: {
        loops: {
          include: {
            tags: true,
          }
        }
      }
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
      const sitex = await prisma.site.findUnique({
        where: { id },
        select: defaultSiteSelect,
      });
      if (!sitex) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No site with id '${id}'`,
        });
      }
      return sitex;
    }),
  add: publicProcedure.input(SiteSchema).mutation(async ({ input }) => {
    try {
      const sitex = await prisma.site.create({
        data: {
          ...input,
        },
        select: defaultSiteSelect,
      });
      return sitex;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          throw new trpc.TRPCError({
            code: "CONFLICT",
            message: "Site already exists",
          });
        }
      }

      throw new trpc.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  }),
  edit: publicProcedure.input(EditSiteSchema).mutation(async ({ input }) => {
    return await prisma.site.update({
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
      return await prisma.site.delete({
        where: { id: input.id },
      });
    }),
});
