import { trpc } from "@/utils/trpc";

const Profile = () => {
  const hello = trpc.steam.GetRecentlyPlayedGames.useQuery({
    steamId: "76561197997523600",
  });

  console.log(hello.data);

  return <div>124</div>;
};

export default Profile;
