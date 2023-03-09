import SteamAuth from "node-steam-openid";

export const steamAuth = new SteamAuth({
  realm: `${process.env.DOMAIN}`,
  returnUrl: `${process.env.DOMAIN}/api/trpc/session.authenticate`,
  apiKey: `${process.env.NEXT_PUBLIC_API_KEY}`, // Steam API key
});
