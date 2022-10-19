export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';
import { Address, chain } from 'wagmi';

import ChildContract from '../../artifacts/contracts/headenFinanceChild.sol/HeadenFinanceChild.json';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const CONTRACT_ADDRESS: { [p: number]: Address } = {
  [-1]: '0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6', //no connected wallet
  [chain.mainnet.id]: '0x0',
  [chain.polygon.id]: '0x76A1ee1738818566D6663db22b0061ae0A57C9fd',
  [chain.arbitrum.id]: '0x0',
  //testnets
  [chain.arbitrumGoerli.id]: '0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6',
  [chain.polygonMumbai.id]: '0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6',
  [chain.goerli.id]: '0xc6151C174EA7F9a3013BBAF5bb3185BFc49324B6',
};

export const headenFinanceAbi = ChildContract.abi;
