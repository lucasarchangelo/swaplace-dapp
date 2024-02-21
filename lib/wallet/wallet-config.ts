import { polygonMumbai, sepolia } from "wagmi/chains";
import { http, createConfig } from "wagmi";
import {
  trustWallet,
  ledgerWallet,
  coinbaseWallet,
  walletConnectWallet,
  injectedWallet,
  rainbowWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { QueryClient } from '@tanstack/react-query';

// const connectorArgs = {
//   appName: "Swaplace dApp",
//   chains: [sepolia, polygonMumbai],
//   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "",
// };

const connectors = connectorsForWallets(
  [{
    groupName: "Which wallet will you use?",
    wallets: [
      injectedWallet,
      coinbaseWallet,
      ledgerWallet,
      trustWallet,
      rainbowWallet,
      walletConnectWallet,
    ],
  }],
  {
    appName: 'My RainbowKit App',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "",
  },
);

const wagmiConfig = createConfig({
  connectors,
  chains: [polygonMumbai, sepolia],
  transports: {
    [polygonMumbai.id]: http(),
    [sepolia.id]: http(),
  },
});

const getSiweMessageOptions = () => ({
  statement: "Swaplace dApp",
});

const queryClient = new QueryClient();

export interface AccountProps {
  account: {
    address: string;
    balanceDecimals?: number;
    balanceFormatted?: string;
    balanceSymbol?: string;
    displayBalance?: string;
    displayName: string;
    ensAvatar?: string;
    ensName?: string;
    hasPendingTransactions: boolean;
  };
}

export { wagmiConfig, getSiweMessageOptions, queryClient };
