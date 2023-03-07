import { z } from "zod";
import { procedure, router } from "../trpc";
import { steamRouter } from "./steam";

export const appRouter = router({
  steam: steamRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
