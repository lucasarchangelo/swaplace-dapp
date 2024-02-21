import "@rainbow-me/rainbowkit/styles.css";
import "tailwindcss/tailwind.css";
import "../styles/global.css";

import {
  getSiweMessageOptions,
  wagmiConfig,
  queryClient,
} from "../lib/wallet/wallet-config";
import { SwapContextProvider } from "@/components/01-atoms";

import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { WagmiProvider } from 'wagmi'
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import { RainbowKitSiweNextAuthProvider } from "@rainbow-me/rainbowkit-siwe-next-auth";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <WagmiProvider config={wagmiConfig}>
        <SwapContextProvider>
          <SessionProvider session={session}>
            <RainbowKitSiweNextAuthProvider
              getSiweMessageOptions={getSiweMessageOptions}
            >
              <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                  <RainbowKitProvider
                    theme={{
                      lightMode: lightTheme({
                        accentColor: "black",
                        borderRadius: "small",
                        overlayBlur: "small",
                      }),
                      darkMode: darkTheme({
                        accentColor: "#888888",
                        borderRadius: "small",
                        overlayBlur: "small",
                      }),
                    }}
                  >
                    <Toaster />
                    <Component {...pageProps} />
                  </RainbowKitProvider>
                </QueryClientProvider>
              </WagmiProvider>
            </RainbowKitSiweNextAuthProvider>
          </SessionProvider>
        </SwapContextProvider>
      </WagmiProvider>
    </>
  );
}

export default MyApp;
