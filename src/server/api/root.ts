import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { userRouter } from "./routers/user";
import { authRouter } from "./routers/auth";
import { assetRouter } from "./routers/asset";
import { categoryRouter } from "./routers/category";
import { instrumentFunctionRouter } from "./routers/instrumentfunction";
import { instrumentTypeRouter } from "./routers/instrumenttype";
import { logRouter } from "./routers/log";
import { loopRouter } from "./routers/loop";
import { loopTagRouter } from "./routers/looptag";
import { manufacturerRouter } from "./routers/manufacturer";
import { measuredVariableRouter } from "./routers/measuredvariable";
import { modelRouter } from "./routers/model";
import { siteRouter } from "./routers/site";
import { productRouter } from "./routers/product";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  site: siteRouter,
  category: categoryRouter,
  log: logRouter,
  measuredvariable: measuredVariableRouter,
  instrumentfunction: instrumentFunctionRouter,
  instrumenttype: instrumentTypeRouter,
  manufacturer: manufacturerRouter,
  model:modelRouter,
  asset: assetRouter,
  loop: loopRouter,
  looptag: loopTagRouter,
  user: userRouter,
  auth: authRouter,
  product: productRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;
