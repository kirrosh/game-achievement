import { trpc } from "@/utils/trpc";
import { Achevements } from "./acivements";

export const Games = () => {
  const { data } = trpc.steam.GetRecentlyPlayedGames.useQuery();
  if (!data) return <div>Loading...</div>;
  return (
    <div className="grid gap-8 m-auto">
      {data?.games?.map((game) => (
        <Achevements appId={game.appid} name={game.name} key={game.appid} />
      ))}
    </div>
  );
};
