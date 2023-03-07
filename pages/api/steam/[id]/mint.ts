import { NextApiRequest, NextApiResponse } from "next";
import { ofetch } from "ofetch";
import check, { checkAchivement } from "./check-achevement";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const body = {
    name: "TF_HEAVY_DEFEND_MEDIC",
    appid: 440,
  };
  try {
    const data = await checkAchivement(
      {
        id: id as string,
        name: body.name,
        appid: body.appid,
      },
      res
    );

    if (!process.env.PRIVATE_KEY) {
      throw new Error("You're missing PRIVATE_KEY in your .env.local file.");
    }

    // Initialize the Thirdweb SDK on the serverside
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
        name: nftName as string,
        description: "An awesome animal NFT",
        properties: {
          // Add any properties you want to store on the NFT
        },
      },
    });

    // Return back the signedPayload to the client.
    res.status(200).json({
      signedPayload: JSON.parse(JSON.stringify(signedPayload)),
    });
    // const data = await ofetch(`/api/steam/${id}/check-achevement`, {
    //   method: "POST",
    //   body: {
    //     name: "TF_HEAVY_DEFEND_MEDIC",
    //     appid: 440,
    //   },
    // });
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}
