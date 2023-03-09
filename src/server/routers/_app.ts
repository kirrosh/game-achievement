import { z } from "zod";
import { procedure, router } from "../trpc";
import { sessionRouter } from "./session";
import { steamRouter } from "./steam";

export const appRouter = router({
  steam: steamRouter,
  session: sessionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
