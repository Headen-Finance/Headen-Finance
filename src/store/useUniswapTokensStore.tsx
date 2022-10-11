import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import produce from 'immer';
import create from 'zustand';

export enum LoadingState {
  INIT,
  LOADING,
  LOADED,
}

export type TokenResponse = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  logoURI?: string;
  extensions: {
    bridgeInfo: Record<string, TokenAddressData>;
  };
};

type TokenAddressData = {
  tokenAddress: string;
};
type UniswapTokensStoreType = {
  tokens: TokenResponse[];
  state: LoadingState;
  fetch: () => void;
  filterByChainId: (chainId: number) => TokenResponse[];
};

const useUniswapTokensStoreBase = create<UniswapTokensStoreType>(
  (set, get) => ({
    tokens: [],
    state: LoadingState.INIT,
    fetch: async () => {
      set(
        produce<UniswapTokensStoreType>((state) => {
          state.state = LoadingState.LOADING;
        })
      );

      const data = await (
        await fetch('https://gateway.ipfs.io/ipns/tokens.uniswap.org')
      ).json();
      // const data = tokenList;
      const list = data.tokens as unknown as TokenResponse[];
      set({
        state: LoadingState.LOADED,
        tokens: list,
      });
    },
    filterByChainId: (chainId: number) => {
      return get().tokens.filter((value) => value.chainId == chainId);
    },
  })
);

const useUniswapTokensStore = createSelectorHooks(useUniswapTokensStoreBase);

export default useUniswapTokensStore;
