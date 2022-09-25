import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { MarketsResponse } from '@/generated/HeadenFinanceChild';

export interface MarketsResponseDisplay {
  tokenAddress: string;
  amountStaked: string;
  amountBorrowed: string;
  borrowRate: string;
  supplyRate: string;
  collateral: string;
}

export function useAllMarketData() {
  // const hf = useHeadenFinance()
  const [markets, setMarkets] = useState<Array<MarketsResponseDisplay>>([]);
  const refresh = useCallback(() => {
    const data: MarketsResponseDisplay[] = [];
    //todo generate demo data

    Array.from(Array(5))
      .map((_) => {
        return {
          amountBorrowed: BigNumber.from(
            Math.floor(Math.random() * 1000000)
          ).mul(100000000000),
          available: true,
          amountStaked: BigNumber.from(Math.floor(Math.random() * 1000000)).mul(
            100000000000
          ),
          borrowRate: BigNumber.from(Math.floor(Math.random() * 10000)),
          supplyRate: BigNumber.from(Math.floor(Math.random() * 10000)),
          tokenAddress: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB', //LINK on goerli
        } as MarketsResponse;
      })
      .forEach((value) => {
        data.push({
          tokenAddress: value.tokenAddress,
          amountStaked: value.amountStaked.div(10 ** 6).toString(),
          amountBorrowed: value.amountBorrowed.div(10 ** 6).toString(),
          borrowRate: (value.borrowRate.toNumber() / 100).toString(),
          supplyRate: (value.supplyRate.toNumber() / 100).toString(),
          collateral: ' - ',
        } as MarketsResponseDisplay);
      });
    setMarkets(data);
  }, []);

  useEffect(() => refresh(), [refresh]);

  return { markets, refresh };
}
