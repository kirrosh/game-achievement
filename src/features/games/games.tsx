import { trpc } from "@/utils/trpc";
import { Collapse } from "@nextui-org/react";
import { Achevements } from "./acivements";

export const Games = () => {
  const { data } = trpc.steam.GetRecentlyPlayedGames.useQuery({
    steamId: "76561197997523600",
  });
  console.log(data);
  if (!data) return <div>Loading...</div>;
  return (
    <div className="grid gap-2 m-auto">
      {data?.games?.map((game) => (
        <Collapse.Group shadow key={game.appid}>
          <Collapse title={game.name}>
            <Achevements appId={game.appid} />
          </Collapse>
        </Collapse.Group>
      ))}
    </div>
  );
};
