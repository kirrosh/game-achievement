import type { AppProps } from "next/app";
import {
  ConnectWallet,
  ThirdwebProvider,
  Web3Button,
} from "@thirdweb-dev/react";
import Head from "next/head";
import "./styles/globals.css";
import { Navbar, NextUIProvider, Text } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import dynamic from "next/dynamic";
import Header from "@/features/header";

// const Header = dynamic(() => import("@/features/header"), {
//   ssr: false,
// });

// Create a client
const queryClient = new QueryClient();

// This is the chainId your dApp will work on.
// const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={"mumbai"}>
      <NextUIProvider>
        <QueryClientProvider client={queryClient}>
          <Head>
            <title>thirdweb Signature Based Minting</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta
              name="description"
              content="thirdweb Example Repository to Showcase signature based minting on an NFT Collection contract"
            />
            <meta name="keywords" content="thirdweb signature based minting" />
          </Head>
          <Header />
          <main className="p-4">
            <Component {...pageProps} />
          </main>
        </QueryClientProvider>
      </NextUIProvider>
    </ThirdwebProvider>
  );
}

export default trpc.withTRPC(MyApp);
