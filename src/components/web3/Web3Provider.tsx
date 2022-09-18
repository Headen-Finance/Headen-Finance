import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import React from 'react';
import { chain, createClient, WagmiConfig } from 'wagmi';

const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum];

const client = createClient(
  getDefaultClient({
    appName: 'Headen Finance',
    autoConnect: true,
    infuraId: process.env.PUBLIC_INFURA_ID,
    chains,
  })
);

type Web3ProviderProps = {
  children?: React.ReactNode;
};

const Web3Provider = ({ children }: Web3ProviderProps) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider mode='dark'>{children}</ConnectKitProvider>
    </WagmiConfig>
  );
};

export default Web3Provider;
