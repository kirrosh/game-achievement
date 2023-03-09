import { procedure, router } from "../trpc";
import { steamAuth } from "@/lib/steamAuth";

export const sessionRouter = router({
  user: procedure.query(async ({ ctx }) => {
    if (ctx.session.user) {
      return {
        ...ctx.session.user,
        isLoggedIn: true,
      };
    } else {
      return {
        isLoggedIn: false,
        username: "",
        userId: "",
        avatarUrl: "",
      };
    }
  }),
  login: procedure.mutation(async ({ ctx }) => {
    try {
      const redirectUrl = await steamAuth.getRedirectUrl();
      return {
        message: "Redirecting to Steam",
        redirectUrl,
        success: true,
      };
    } catch (error: any) {
      return {
        message: new Error(error).message,
        redirectUrl: "",
        success: false,
      };
    }
  }),
  logout: procedure.mutation(async ({ ctx }) => {
    ctx.session.destroy();
    return { isLoggedIn: false, username: "", userId: "", avatarUrl: "" };
  }),
});
