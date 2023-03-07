import { trpc } from "@/utils/trpc";
import { Avatar, Card, Text } from "@nextui-org/react";
import {
  useAddress,
  useContract,
  useNFTs,
  Web3Button,
} from "@thirdweb-dev/react";
import { ofetch } from "ofetch";

type Props = {
  appId: number;
};

const mintWithSignature = async ({
  authorAddress,
  steamId,
  appid,
  name,
}: {
  authorAddress: string;
  steamId: string;
  appid: number;
  name: string;
}) => {
  try {
    // Make a request to /api/server
    // const signedPayloadReq = await fetch(`/api/server`, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     authorAddress: address, // Address of the current user
    //     nftName: nftName || "",
    //   }),
    // });

    const res = await ofetch(`/api/steam/${steamId}/check-achevement`, {
      method: "POST",
      body: {
        authorAddress, // Address of the current user
        appid,
        name,
      },
    });

    // Grab the JSON from the response
    // const json = signedPayloadReq;

    // if (!signedPayloadReq.ok) {
    //   alert(json.error);
    // }

    // If the request succeeded, we'll get the signed payload from the response.
    // The API should come back with a JSON object containing a field called signedPayload.
    // This line of code will parse the response and store it in a variable called signedPayload.
    const signedPayload = res.signedPayload;
    return signedPayload;
    // Now we can call signature.mint and pass in the signed payload that we received from the server.
    // This means we provided a signature for the user to mint an NFT with.
    //   const nft = await nftCollection?.signature.mint(signedPayload);

    //   alert("Minted succesfully!");

    //   return nft;
  } catch (e) {
    console.error("An error occurred trying to mint the NFT:", e);
  }
};
export const Achevements = ({ appId }: Props) => {
  const address = useAddress();

  // Fetch the NFT collection from thirdweb via it's contract address.
  const { contract: nftCollection } = useContract(
    // Replace this with your NFT Collection contract address
    process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS,
    "nft-collection"
  );

  // Load all the minted NFTs in the collection
  const { data: nfts, isLoading: loadingNfts } = useNFTs(nftCollection);

  const mint = async ({ name }: { name: string }) => {
    if (!address) return;
    const sign = await mintWithSignature({
      authorAddress: address,
      steamId: "76561197997523600",
      appid: appId,
      name,
    });
    const nft = await nftCollection?.signature.mint(sign);
    console.log(nft);
  };
  const { data } = trpc.steam.GetSchemaForGame.useQuery({
    appId,
    steamId: "76561197997523600",
  });
  return (
    <div className="grid gap-4">
      {data?.availableGameStats?.achievements?.map((item) => (
        <Card variant="flat" key={item.name}>
          <Card.Body>
            <div className="flex gap-4">
              <Avatar squared src={item.icon} size="lg" />
              <div>
                <Text b>{item.displayName}</Text>
                <Text
                  css={{
                    color: "$accents7",
                    fontWeight: "$semibold",
                    fontSize: "$sm",
                  }}
                >
                  {item.description}
                </Text>
              </div>
            </div>
            <Web3Button
              contractAddress={process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!}
              action={() =>
                mint({
                  name: item.name,
                })
              }
            >
              Mint NFT
            </Web3Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};
