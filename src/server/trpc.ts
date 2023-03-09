import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session.user?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx,
  });
});
// you can reuse this for any procedure
export const protectedProcedure = t.procedure.use(isAuthed);

// Base router and procedure helpers
export const router = t.router;
export const procedure = t.procedure;
