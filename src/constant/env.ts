export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';
import { chain } from 'wagmi';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const CONTRACT_ADDRESS = {
  [-1]: undefined,
  [chain.goerli.id]: '0x31b0A3e4bF7f55069Faa13b2d8EEAAF96F3ee5b7',
  [chain.mainnet.id]: '0x0',
  [chain.polygon.id]: '0x0',
  [chain.polygonMumbai.id]: '0x0',
  [chain.arbitrum.id]: '0x0',
  [chain.arbitrumGoerli.id]: '0x0',
};
