import { AddressZero } from '@ethersproject/constants';
import { useCallback, useEffect, useState } from 'react';

import { useHeadenFinance } from '@/hooks/useHeadenFinanceContract';
import useIsMounted from '@/hooks/useIsMounted';

export interface MarketsResponseDisplay {
  tokenAddress: string;
  amountStaked: string;
  amountBorrowed: string;
  liquidity: string;
  borrowRate: string;
  supplyRate: string;
  collateral: string;
}

export function useAllMarketData() {
  const hf = useHeadenFinance();
  const [markets, setMarkets] = useState<Array<MarketsResponseDisplay>>([]);
  const mounted = useIsMounted();
  // const {data: marketPools} = useContractRead({
  //   addressOrName: address,
  //   contractInterface: headenFinanceAbi,
  //   functionName: 'get'
  // })
  // console.log("market pools:", marketPools)
  const refresh = useCallback(async () => {
    const data: MarketsResponseDisplay[] = [];
    //todo generate demo data
    for (let index = 0; index < 3; index++) {
      try {
        const market = await hf.markets(index);
        if (market.tokenAddress !== AddressZero) {
          data.push({
            tokenAddress: market.tokenAddress,
            amountStaked: market.amountStaked.div(10 ** 8).toString(),
            amountBorrowed: market.amountBorrowed.div(10 ** 8).toString(),
            borrowRate: (market.borrowRate.toNumber() / 100).toString(),
            supplyRate: (market.supplyRate.toNumber() / 100).toString(),
            liquidity: market.amountStaked
              .sub(market.amountBorrowed)
              .div(10 ** 8)
              .toString(),
            collateral: ' - ',
          } as MarketsResponseDisplay);
        }
      } catch (err) {
        //market doesnt exist
      }
    }
    // .map((_) => {
    //   return {
    //     amountBorrowed: BigNumber.from(
    //       Math.floor(Math.random() * 1000000)
    //     ).mul(100000000000),
    //     available: true,
    //     amountStaked: BigNumber.from(Math.floor(Math.random() * 1000000)).mul(
    //       100000000000
    //     ),
    //     borrowRate: BigNumber.from(Math.floor(Math.random() * 10000)),
    //     supplyRate: BigNumber.from(Math.floor(Math.random() * 10000)),
    //     tokenAddress: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB', //LINK on goerli
    //   } as MarketsResponse;
    // })
    // .forEach((value) => {

    // });
    setMarkets(data);
  }, [hf]);

  useEffect(() => {
    if (!mounted) return;
    refresh().then((_) => {
      /*eslint....*/
    });
  }, [refresh, mounted]);

  return { markets, refresh };
}
