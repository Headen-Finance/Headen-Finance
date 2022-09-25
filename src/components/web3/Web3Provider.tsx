import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ConnectKitProvider } from 'connectkit';
import React from 'react';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import '@rainbow-me/rainbowkit/styles.css';

// const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];

const { chains, provider } = configureChains(
  [chain.polygonMumbai, chain.arbitrumGoerli, chain.polygon],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),

  [
    publicProvider(),
    jsonRpcProvider({
      priority: 0,
      rpc: () => ({
        http:process.env.NEXT_PUBLIC_QUICKNODE_RPC as string,
      }),
    }),
    //alchemyProvider({ priority: 1 }),
  ],
);

const { connectors } = getDefaultWallets({
  appName: 'HeadenFinance',
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
      <RainbowKitProvider chains={chains}>
        <ConnectKitProvider mode='dark'>{children}</ConnectKitProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
