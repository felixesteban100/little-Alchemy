import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.example.findMany({
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }),

  createExample: publicProcedure.mutation(async ({ ctx }) => {
    const createExample = await ctx.prisma.example.create({
      data: {
        createdAt: '2007-09-05T00:00:00Z',
        updatedAt: '1992-11-17T00:00:00Z',
      }
    });

    console.log("createExample", createExample)
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
