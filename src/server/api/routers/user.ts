import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/server/db";
import { hash, verify } from "argon2";

const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  email: true,
  password: true,
});

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(({ ctx: { session, prisma } }) => {
    const user = prisma.user.findFirst({
      where: { email: session.user.email },
    });
    return user;
  }),
  findUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const { email, password } = input;

        const result = await ctx.prisma.user.findFirst({
          where: { email },
        });

        if (!result) return null;
        const Value = result.password ?? " ";
        const isValidPassword = await verify(Value, password);

        if (!isValidPassword) return null;

        return { id: result.id, email, username: result.name };
      } catch {
        return null;
      }
    }),
  list: publicProcedure.query(() => {
    return prisma.user.findMany({
      select: defaultUserSelect,
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
      const userx = await prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      });
      if (!userx) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No user with id '${id}'`,
        });
      }
      return userx;
    }),
  add: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;
      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }
      const hashedPassword = await hash(password);
      const result = await prisma.user.create({
        data: {
          ...input,
          password: hashedPassword,
        },
        select: defaultUserSelect,
      });
      return result;
    }),
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.user.update({
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
      return await prisma.user.delete({
        where: { id: input.id },
      });
    }),
});
