import { trpc } from "@/utils/trpc";
import { Avatar, Badge, Card, Text } from "@nextui-org/react";
import {
  useAddress,
  useContract,
  useOwnedNFTs,
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
    const res = await ofetch(`/api/steam/${steamId}/check-achevement`, {
      method: "POST",
      body: {
        authorAddress, // Address of the current user
        appid,
        name,
      },
    });

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

  // const account = useAddress();

  // const { contract } = useContract(
  //   process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS,
  //   "nft-collection"
  // );
  const {
    data: owned,
    isFetching,
    refetch,
    error,
  } = useOwnedNFTs(nftCollection, address);

  // Load all the minted NFTs in the collection
  // const { data: nfts, isLoading: loadingNfts } = useNFTs(nftCollection);

  const mint = async ({ name }: { name: string }) => {
    if (!address) return;
    const sign = await mintWithSignature({
      authorAddress: address,
      steamId: "76561197997523600",
      appid: appId,
      name,
    });
    const nft = await nftCollection?.signature.mint(sign);
    refetch();
  };
  const { data } = trpc.steam.GetSchemaForGame.useQuery({
    appId,
  });

  const userStats = trpc.steam.GetPlayerAchievements.useQuery({
    appId,
  });

  const achivementsData = new Map(
    data?.availableGameStats?.achievements?.map((item) => [item.name, item])
  );

  const lastAchivements = userStats.data?.achievements
    ?.filter((item) => item.unlocktime > 0)
    .sort((a, b) => b.unlocktime - a.unlocktime);

  const lastAchivementsSet = new Set(
    lastAchivements?.map((item) => item.apiname)
  );

  const otherAchivements = userStats.data?.achievements
    ?.filter((item) => !lastAchivementsSet.has(item.apiname))
    .sort((a, b) => b.unlocktime - a.unlocktime);

  const ownedAchivements = new Set(
    owned?.map((item) => item.metadata.objectId)
  );

  return (
    <div className="grid gap-4">
      {lastAchivements?.map((item) => {
        const ach = achivementsData.get(item.apiname);
        if (!ach) return null;
        return (
          <Card
            isHoverable={ownedAchivements.has(item.apiname)}
            variant="flat"
            key={ach.name}
            css={{
              backgroundColor: ownedAchivements.has(item.apiname)
                ? "$successLight"
                : "",
            }}
          >
            <Card.Body>
              <div className="flex gap-4">
                <Avatar squared src={ach.icon} size="lg" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Text b>{ach.displayName}</Text>
                    <Text
                      css={{
                        color: "$primary",
                        backgroundColor: "$primaryLight",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontWeight: "$semibold",
                        fontSize: "$sm",
                      }}
                    >
                      Unlocked:{" "}
                      {new Intl.DateTimeFormat("us-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(item.unlocktime * 1000))}
                    </Text>
                  </div>

                  <Text
                    css={{
                      color: "$accents7",
                      fontWeight: "$semibold",
                      fontSize: "$sm",
                    }}
                  >
                    {ach.description}
                  </Text>
                </div>
              </div>
              {!ownedAchivements.has(item.apiname) && (
                <Web3Button
                  contractAddress={
                    process.env.NEXT_PUBLIC_NFT_COLLECTION_ADDRESS!
                  }
                  isDisabled={isFetching}
                  action={() =>
                    mint({
                      name: ach.name,
                    })
                  }
                >
                  Mint NFT
                </Web3Button>
              )}
            </Card.Body>
          </Card>
        );
      })}
      {otherAchivements?.map((item) => {
        const ach = achivementsData.get(item.apiname);
        if (!ach) return null;
        return (
          <Card variant="flat" key={ach.name}>
            <Card.Body>
              <div className="flex gap-4">
                <Avatar squared src={ach.icongray} size="lg" />
                <div>
                  <Text b>{ach.displayName}</Text>
                  <Text
                    css={{
                      color: "$accents7",
                      fontWeight: "$semibold",
                      fontSize: "$sm",
                    }}
                  >
                    {ach.description}
                  </Text>
                </div>
              </div>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};
