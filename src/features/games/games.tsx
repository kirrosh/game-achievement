import { trpc } from "@/utils/trpc";
import { Card, Collapse, Image } from "@nextui-org/react";
import { Achevements } from "./acivements";

export const Games = () => {
  const { data } = trpc.steam.GetRecentlyPlayedGames.useQuery();
  if (!data) return <div>Loading...</div>;
  return (
    <div className="grid gap-8 m-auto">
      {data?.games?.map((game) => (
        <Card key={game.appid}>
          <Card.Image
            src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`}
            alt={game.name}
            objectFit="cover"
            width="100%"
          />
          <Card.Body>
            <Collapse title={game.name} divider={false}>
              <Achevements appId={game.appid} />
            </Collapse>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};
