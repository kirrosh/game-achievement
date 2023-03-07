import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { NextApiRequest, NextApiResponse } from "next";
import { ofetch } from "ofetch";
import { IAchevement } from "../../../../interfaces/IGameSchema";
import {
  STEAM_URL_GetPlayerAchievements,
  STEAM_URL_GetSchemaForGame,
} from "../../../../url";

export default async function check(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { name, appid, authorAddress } = req.body;

  const playerAchivements = await ofetch(STEAM_URL_GetPlayerAchievements, {
    params: {
      key: process.env.NEXT_PUBLIC_API_KEY,
      steamid: id,
      appid: appid,
    },
  }).then((data) => data.playerstats.achievements);

  const playerAch = playerAchivements.find((a: any) => a.apiname === name);

  if (!playerAch) {
    return res.status(404).json({ message: "Achievement not found" });
  }
  if (playerAch.achieved === 0) {
    return res.status(400).json({ message: "Achievement not achieved" });
  }

  const achievements: IAchevement[] = await ofetch(STEAM_URL_GetSchemaForGame, {
    params: {
      key: process.env.NEXT_PUBLIC_API_KEY,
      steamid: id,
      appid,
    },
  }).then((data) => data.game.availableGameStats.achievements);

  const ach = achievements.find((a) => a.name === name);
  if (!ach) {
    return res.status(404).json({ message: "Achievement not found" });
  }

  const sdk = ThirdwebSDK.fromPrivateKey(
    // Your wallet private key (read it in from .env.local file)
    process.env.PRIVATE_KEY as string,
    "mumbai"
  );

  // Load the NFT Collection via it's contract address using the SDK
  const nftCollection = await sdk.getContract(
    // Replace this with your NFT Collection contract address
    process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!,
    "nft-collection"
  );

  const signedPayload = await nftCollection.signature.generate({
    to: authorAddress,
    metadata: {
      name: ach.displayName,
      description: ach.description,
      image: ach.icon,
      attributes: [
        {
          display_type: "date",
          trait_type: "Unlock time",
          value: playerAch.unlocktime,
        },
      ],
    },
  });

  // Return back the signedPayload to the client.
  res.status(200).json({
    signedPayload: JSON.parse(JSON.stringify(signedPayload)),
  });

  // return res.status(200).json({ ach, playerAch });
}

// cfreate function for fetch info by achivement id from steam api
