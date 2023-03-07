import type { NextApiRequest, NextApiResponse } from "next";
import { ofetch } from "ofetch";
import { IGameSchema } from "../../../interfaces/IGameSchema";
import { IOwnedGame } from "../../../interfaces/IOwnedGame";
import { IPlayerInfo } from "../../../interfaces/IPlayerInfo";
import { IPlayerStats } from "../../../interfaces/IPlayerStats";
import {
  STEAM_URL_GetPlayerAchievements,
  STEAM_URL_GetPlayerSummaries,
  STEAM_URL_GetRecentlyPlayedGames,
  STEAM_URL_GetSchemaForGame,
  STEAM_URL_GetUserStatsForGame,
} from "../../../url";

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const data = await ofetch(STEAM_URL_GetPlayerSummaries, {
    params: {
      key: process.env.NEXT_PUBLIC_API_KEY,
      steamids: id,
    },
  });

  const recentGames = await ofetch(STEAM_URL_GetRecentlyPlayedGames, {
    params: {
      key: process.env.NEXT_PUBLIC_API_KEY,
      steamid: id,
      count: 10,
    },
  });

  const games: IOwnedGame[] = recentGames.response.games;

  for (const game of games) {
    let gameData: { playerstats?: IPlayerStats } = {};
    let schemaForGame: { game?: IGameSchema } = {};
    let achivements: { playerstats?: { achievements: any[] } } = {};
    try {
      gameData = await ofetch(STEAM_URL_GetUserStatsForGame, {
        params: {
          key: process.env.NEXT_PUBLIC_API_KEY,
          steamid: id,
          appid: game.appid,
        },
      });
      schemaForGame = await ofetch(STEAM_URL_GetSchemaForGame, {
        params: {
          key: process.env.NEXT_PUBLIC_API_KEY,
          steamid: id,
          appid: game.appid,
        },
      });
      achivements = await ofetch(STEAM_URL_GetPlayerAchievements, {
        params: {
          key: process.env.NEXT_PUBLIC_API_KEY,
          steamid: id,
          appid: game.appid,
        },
      });
    } catch (e) {
      console.log(e);
    }

    // get achivemens srom steam api with time and date of achivement was unlocked

    game.playesStats = gameData.playerstats as IPlayerStats;
    game.schema = schemaForGame.game as IGameSchema;
    game.achivements = achivements.playerstats?.achievements;
    game.card_image = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/library_600x900.jpg`;
    game.hero_image = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/library_hero.jpg`;
    game.header_image = `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`;
  }

  const playerInfo: IPlayerInfo = data.response.players[0];
  // return {
  //   playerInfo,
  //   games,
  // };
  res.status(200).json({
    playerInfo,
    games,
  });
}
