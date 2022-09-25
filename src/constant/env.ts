import { AddressZero } from '@ethersproject/constants';

export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';
import { chain } from 'wagmi';

import { abi } from '../../artifacts/contracts/headenFinanceChild.sol/HeadenFinanceChild.json';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const CONTRACT_ADDRESS = {
  [-1]: AddressZero,
  [chain.mainnet.id]: '0x0',
  [chain.polygon.id]: '0x0',
  [chain.arbitrum.id]: '0x0',
  //testnets
  [chain.arbitrumGoerli.id]: '0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6',
  [chain.polygonMumbai.id]: '0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6',
  [chain.goerli.id]: '0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6',
};

export const headenFinanceAbi = abi;
