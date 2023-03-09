import { procedure, router } from "../trpc";
import { steamAuth } from "@/lib/steamAuth";
import { NextResponse } from "next/server";

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
  authenticate: procedure.query(async ({ ctx }) => {
    try {
      const steamUser = await steamAuth.authenticate(ctx.req);
      ctx.session.user = {
        userId: steamUser.steamid,
        username: steamUser.username,
        avatarUrl: steamUser.avatar.large,
      };

      await ctx.session.save();

      //   return {
      //     message: "Successfully authenticated with Steam",
      //     success: true,
      //   }
      return NextResponse.redirect(new URL("/steam", ctx.req.url));

      // TODO - You should insert the current user into your DB here if they don't exist already.
      // You could use 'steamUser.steamid', which refers to the steamid64 of a user, which is unique.
      //   ctx.res.redirect("/steam");
    } catch (error: any) {
      return {
        message: new Error(error).message,
        success: false,
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
