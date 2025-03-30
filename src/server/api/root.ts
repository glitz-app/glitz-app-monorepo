import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { imageProjectRouter } from "./routers/imageProject";
import { moduleRouter } from "./routers/module";
import { moduleResultRouter } from "./routers/moduleResult";
import { moduleTypeRouter } from "./routers/moduleType";
import { imageRouter } from "./routers/image";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  imageProject: imageProjectRouter,
  module: moduleRouter,
  moduleResult: moduleResultRouter,
  moduleType: moduleTypeRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
