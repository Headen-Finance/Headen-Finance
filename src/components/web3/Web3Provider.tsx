import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import React from "react";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import "@rainbow-me/rainbowkit/styles.css";

// const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];

const { chains, provider } = configureChains(
  [chain.polygonMumbai, chain.arbitrumGoerli, chain.polygon],
  [
    //mumbai
    alchemyProvider({ apiKey: "9DizSY0FRxqv935mOTRSx5COsF7i1Yx6" }),

    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "HeadenFinance",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

// const client = createClient(
//   getDefaultClient({
//     appName: 'Headen Finance',
//     autoConnect: true,
//     infuraId: process.env.PUBLIC_INFURA_ID,
//     chains,
//   })
// );

type Web3ProviderProps = {
  children?: React.ReactNode;
};

const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} initialChain={chain.polygonMumbai}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
