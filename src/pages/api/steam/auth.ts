import { sessionOptions } from "@/lib/session";
import { steamAuth } from "@/lib/steamAuth";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
// export API handler
const nextApiHandler = createNextApiHandler({
  router: appRouter,
  createContext,
});
async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Modify `req` and `res` objects here
  // In this case, we are enabling CORS

  if (req.method === "GET") {
    try {
      const steamUser = await steamAuth.authenticate(req);

      req.session.user = {
        userId: steamUser.steamid,
        username: steamUser.username,
        avatarUrl: steamUser.avatar.large,
      };

      await req.session.save();

      // TODO - You should insert the current user into your DB here if they don't exist already.
      // You could use 'steamUser.steamid', which refers to the steamid64 of a user, which is unique.

      return res.redirect("/steam");
    } catch (error: any) {
      return res.json({
        message: new Error(error).message,
        success: false,
      });
    }
  }
  // If you need to make authenticated CORS calls then
  // remove what is above and uncomment the below code
  // Allow-Origin has to be set to the requesting domain that you want to send the credentials back to
  // res.setHeader('Access-Control-Allow-Origin', 'http://example:6006');
  // res.setHeader('Access-Control-Request-Method', '*');
  // res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
  // res.setHeader('Access-Control-Allow-Headers', 'content-type');
  // res.setHeader('Referrer-Policy', 'no-referrer');
  // res.setHeader('Access-Control-Allow-Credentials', 'true');
  // pass the (modified) req/res to the handler
  return nextApiHandler(req, res);
}

export default withIronSessionApiRoute(handler, sessionOptions);
