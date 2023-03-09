import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import Head from "next/head";
import "./styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { createTheme } from "@nextui-org/react";

import Header from "@/features/header";
const queryClient = new QueryClient();

const darkTheme = createTheme({
  type: "dark",
});

// This is the chainId your dApp will work on.

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider activeChain={process.env.NEXT_PUBLIC_ETH_NETWORK as any}>
      <NextUIProvider theme={darkTheme}>
        <QueryClientProvider client={queryClient}>
          <Head>
            <title>AchieveNFT</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta
              name="description"
              content="AchieveNFT is a platform that allows users to create NFTs from their Steam achievements. Login with Steam and Metamask, and turn your gaming milestones into NFTs."
            />
            <meta
              name="keywords"
              content="AchieveNFT, Steam Achievements, NFT, Metamask, gaming milestones,"
            />
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
