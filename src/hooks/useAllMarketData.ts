import { AddressZero } from "@ethersproject/constants";
import { useCallback, useEffect, useReducer } from "react";
import { Address } from "wagmi";

import { Action } from "@/lib/Action";
import { useHeadenFinance } from "@/hooks/useHeadenFinanceContract";
import useIsMounted from "@/hooks/useIsMounted";

export interface MarketsResponseDisplay {
  tokenAddress: Address;
  amountStaked: string | number;
  amountBorrowed: string | number;
  liquidity: string | number;
  borrowRate: string;
  supplyRate: string;
  collateral: string;
}

const USDC: Address = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const USDT: Address = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

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
          if (market.tokenAddress === USDC || market.tokenAddress === USDT) {
            data.push({
              tokenAddress: market.tokenAddress,
              amountStaked: +(market.amountStaked.toNumber() / 10 ** 6).toFixed(
                5
              ),
              amountBorrowed: +(
                market.amountBorrowed.toNumber() /
                10 ** 6
              ).toFixed(5),
              borrowRate: (market.borrowRate.toNumber() / 100).toString(),
              supplyRate: (market.supplyRate.toNumber() / 100).toString(),
              liquidity: +(
                market.amountStaked.sub(market.amountBorrowed).toNumber() /
                10 ** 6
              ).toFixed(5),
              collateral: " - ",
            } as MarketsResponseDisplay);
          } else {
            // avoid overflow error
            data.push({
              tokenAddress: market.tokenAddress,
              amountStaked: +(Number(market.amountStaked) / 10 ** 18).toFixed(
                5
              ),
              amountBorrowed: +(
                Number(market.amountBorrowed) /
                10 ** 18
              ).toFixed(5),
              borrowRate: (market.borrowRate.toNumber() / 100).toString(),
              supplyRate: (market.supplyRate.toNumber() / 100).toString(),
              liquidity: +(
                Number(market.amountStaked.sub(market.amountBorrowed)) /
                10 ** 18
              ).toFixed(5),
              collateral: " - ",
            } as MarketsResponseDisplay);
          }
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
