import { useEffect, useMemo } from 'react';
import { useNetwork } from 'wagmi';

import useIsMounted from '@/hooks/useIsMounted';

import useUniswapTokensStore, {
  LoadingState,
} from '@/store/useUniswapTokensStore';

export function useUniswapTokenList() {
  const fetchTokens = useUniswapTokensStore.useFetch();
  const state = useUniswapTokensStore.useState();
  const isMounted = useIsMounted();
  useEffect(() => {
    if (!isMounted || state != LoadingState.INIT) return;
    fetchTokens();
  }, [state, isMounted, fetchTokens]);

  const { chain } = useNetwork();
  const filter = useUniswapTokensStore.useFilterByChainId();

  return useMemo(
    () => (state === LoadingState.LOADED ? filter(chain?.id ?? 1) : []),
    [chain, filter, state]
  );
}
