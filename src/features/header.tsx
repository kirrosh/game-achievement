import { trpc } from "@/utils/trpc";
import { Avatar, Button, Dropdown, Navbar, Text } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const ConnectWallet = dynamic(
  () => import("@thirdweb-dev/react").then((mod) => mod.ConnectWallet),
  {
    ssr: false,
  }
);

const Header = () => {
  const router = useRouter();
  const { data, refetch } = trpc.session.user.useQuery();
  const login = trpc.session.login.useMutation({
    onSuccess: (res) => {
      router.push(res.redirectUrl);
    },
  });
  const logout = trpc.session.logout.useMutation({
    onSuccess: async () => {
      await refetch();
      router.push("/");
    },
  });
  return (
    <Navbar isBordered={true} variant="sticky">
      <Navbar.Brand
        css={{
          textGradient: "45deg, $yellow600 -20%, $red600 100%",
          fontWeight: "bold",
          fontSize: "$xl",
        }}
      >
        AchieveNFT
      </Navbar.Brand>
      <Navbar.Content
        activeColor="primary"
        hideIn="xs"
        variant="highlight"
        className="flex gap-4"
      >
        <ConnectWallet />
        {!data?.isLoggedIn && (
          <Button onClick={() => login.mutate()}>Login</Button>
        )}
        {data?.isLoggedIn && (
          <Dropdown placement="bottom-right">
            <Dropdown.Trigger>
              <Avatar
                bordered
                as="button"
                color="primary"
                size="md"
                src={data?.avatarUrl}
              />
            </Dropdown.Trigger>
            <Dropdown.Menu
              aria-label="User menu actions"
              color="warning"
              onAction={(actionKey) => {
                switch (actionKey) {
                  case "profile":
                    break;
                  case "logout":
                    logout.mutate();
                    break;
                }
              }}
            >
              <Dropdown.Item key="profile" css={{ height: "$18" }}>
                <Text b color="inherit" css={{ d: "flex" }}>
                  Signed in as
                </Text>
                <Text b color="inherit" css={{ d: "flex" }}>
                  {data?.username}
                </Text>
              </Dropdown.Item>
              <Dropdown.Item key="logout" withDivider color="error">
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Navbar.Content>
    </Navbar>
  );
};

export default Header;
