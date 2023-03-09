import { Navbar } from "@nextui-org/react";
// import { ConnectWallet } from "@thirdweb-dev/react";
import dynamic from "next/dynamic";
const ConnectWallet = dynamic(
  () => import("@thirdweb-dev/react").then((mod) => mod.ConnectWallet),
  {
    ssr: false,
  }
);

const Header = () => {
  return (
    <Navbar isBordered={true} variant="sticky">
      <Navbar.Brand>Game Acivements</Navbar.Brand>
      <Navbar.Content activeColor="primary" hideIn="xs" variant="highlight">
        {/* <Navbar.Link href="#">Features</Navbar.Link>
          <Navbar.Link isActive href="#">
            Customers
          </Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Company</Navbar.Link> */}
      </Navbar.Content>
      <Navbar.Content>
        <ConnectWallet colorMode="light" />
      </Navbar.Content>
    </Navbar>
  );
};

export default Header;
