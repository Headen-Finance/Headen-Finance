import { AddressZero } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import { useCallback, useEffect, useReducer } from "react";
import { Address } from "wagmi";

import { Action } from "@/lib/Action";
import { useHeadenFinance } from "@/hooks/useHeadenFinanceContract";
import useIsMounted from "@/hooks/useIsMounted";

export interface MarketsResponseDisplay {
  tokenAddress: Address;
  amountStaked: BigNumber;
  amountBorrowed: BigNumber;
  liquidity: BigNumber;
  borrowRate: string;
  supplyRate: string;
  collateral: BigNumber;
}

export function useAllMarketData() {
  const hf = useHeadenFinance();

  const [state, dispose] = useReducer(reducer, { loading: false, markets: [] });

  const mounted = useIsMounted();
  // const {data: marketPools} = useContractRead({
  //   address: address,
  //   abi: headenFinanceAbi,
  //   functionName: 'get'
  // })
  // console.log("market pools:", marketPools)
  const refresh = useCallback(async () => {
    const data: MarketsResponseDisplay[] = [];
    dispose({ type: ActionType.LOADING, payload: {} });
    //todo market_pools
    for (let index = 1; index < 5; index++) {
      try {
        const market = await hf?.markets(index);
        if (market.tokenAddress !== AddressZero) {
          data.push({
            tokenAddress: market.tokenAddress,
            amountStaked: market.amountStaked,
            amountBorrowed: market.amountBorrowed,
            borrowRate: (market.borrowRate.toNumber() / 100).toString(),
            supplyRate: (market.supplyRate.toNumber() / 100).toString(),
            liquidity: market.amountStaked.sub(market.amountBorrowed),
            collateral: BigNumber.from(0),
          } as MarketsResponseDisplay);
        }
      } catch (err) {
        //market doesnt exist
      }
    }
    dispose({ type: ActionType.LOADED, payload: { markets: data } });
  }, [hf]);

  useEffect(() => {
    if (!mounted) return;
    refresh().then((_) => {
      /*eslint....*/
    });
  }, [refresh, mounted]);

  return { ...state, refresh };
}

type AllMarketDataState = {
  loading: boolean;
  markets: Array<MarketsResponseDisplay>;
  error?: string;
};

enum ActionType {
  LOADING,
  LOADED,
  ERROR,
}

export type AllMarketDataActions =
  | Action<ActionType.LOADING, Record<string, never>>
  | Action<ActionType.LOADED, { markets: Array<MarketsResponseDisplay> }>
  | Action<ActionType.ERROR, { error: string }>;

function reducer(
  state: AllMarketDataState,
  action: AllMarketDataActions
): AllMarketDataState {
  switch (action.type) {
    case ActionType.LOADING:
      return { loading: true, markets: [] };
    case ActionType.LOADED:
      return { loading: false, markets: action.payload.markets };
    case ActionType.ERROR:
      return { loading: false, markets: [], error: action.payload.error };
  }
}
