import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { elementRouter } from "~/server/api/routers/element";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  element: elementRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
