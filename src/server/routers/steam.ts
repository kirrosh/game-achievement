import { STEAM_URL_GetRecentlyPlayedGames } from "@/server/url";
import { ofetch } from "ofetch";
import { z } from "zod";
import { procedure, router } from "../trpc";

export const steamRouter = router({
  GetRecentlyPlayedGames: procedure
    .input(
      z.object({
        steamId: z.string(),
      })
    )
    .query(async ({ input }) => {
      console.log(input);
      const data = await ofetch(STEAM_URL_GetRecentlyPlayedGames, {
        params: {
          key: process.env.NEXT_PUBLIC_API_KEY,
          steamid: input.steamId,
          count: 10,
        },
      });
      return data;
    }),
});

// export type definition of API
export type SteamRouter = typeof steamRouter;
