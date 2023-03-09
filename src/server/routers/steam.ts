import { IGameSchema } from "@/interfaces/IGameSchema";
import { IPlayerStats } from "@/interfaces/IPlayerStats";
import { IRecentlyPlayedGame } from "@/interfaces/IRecentlyPlayesGame";
import {
  STEAM_URL_GetPlayerAchievements,
  STEAM_URL_GetRecentlyPlayedGames,
  STEAM_URL_GetSchemaForGame,
  STEAM_URL_GetUserStatsForGame,
} from "@/server/url";
import { ofetch } from "ofetch";
import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const steamRouter = router({
  GetRecentlyPlayedGames: protectedProcedure.query(async ({ ctx, input }) => {
    const data: {
      games: IRecentlyPlayedGame[];
      total_count: number;
    } = await ofetch(STEAM_URL_GetRecentlyPlayedGames, {
      params: {
        key: process.env.NEXT_PUBLIC_API_KEY,
        steamid: ctx.session.user?.userId,
        count: 10,
      },
    }).then((res) => res.response);
    return data;
  }),
  // no unlockTime
  GetUserStatsForGame: protectedProcedure
    .input(
      z.object({
        appId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const data: IPlayerStats = await ofetch(STEAM_URL_GetUserStatsForGame, {
        params: {
          key: process.env.NEXT_PUBLIC_API_KEY,
          steamid: ctx.session.user?.userId,
          appid: input.appId,
        },
      }).then((res) => res.playerstats);
      return data;
    }),
  GetPlayerAchievements: protectedProcedure
    .input(
      z.object({
        appId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const data: {
        steamId: string;
        gameName: string;
        success: boolean;
        achievements: {
          apiname: string;
          achieved: 0 | 1;
          unlocktime: number;
        }[];
      } = await ofetch(STEAM_URL_GetPlayerAchievements, {
        params: {
          key: process.env.NEXT_PUBLIC_API_KEY,
          steamid: ctx.session.user?.userId,
          appid: input.appId,
        },
      }).then((res) => res.playerstats);
      return data;
    }),

  GetSchemaForGame: protectedProcedure
    .input(
      z.object({
        appId: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const data: IGameSchema = await ofetch(STEAM_URL_GetSchemaForGame, {
        params: {
          key: process.env.NEXT_PUBLIC_API_KEY,
          steamid: ctx.session.user?.userId,
          appid: input.appId,
        },
      }).then((res) => res.game);
      return data;
    }),
});

// export type definition of API
export type SteamRouter = typeof steamRouter;
