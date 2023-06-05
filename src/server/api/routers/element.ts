// import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    // protectedProcedure,
} from "~/server/api/trpc";

export const elementRouter = createTRPCRouter({
    getAllElements: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.element.findMany();
        }),
});
