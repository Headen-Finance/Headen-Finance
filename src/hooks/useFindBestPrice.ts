import { Provider } from "@wagmi/core";
import { BigNumber, ethers } from "ethers";
import { useCallback } from "react";
import { Address, erc20ABI, useProvider, useQuery } from "wagmi";

import { useChainData } from "@/hooks/useChainData";
import { useChainlinkFeedData } from "@/hooks/useChainlinkFeed";

import { ChainConfig } from "@/constant/env";

const UniswapV2ROuter02ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
];
//TODO should it be fetched?
const usdcDecimals = 6;
const usdcMultiplier = BigNumber.from(10).pow(usdcDecimals);

const daiDecimals = 18;
// eslint-disable-next-line unused-imports/no-unused-vars
const daiMultiplier = BigNumber.from(10).pow(daiDecimals);

export async function getAvgPriceForTokens(
  amountIn: BigNumber,
  path: Address[],
  uniswapRouterAddress: Address,
  provider: Provider
): Promise<BigNumber> {
  const router = new ethers.Contract(
    uniswapRouterAddress,
    UniswapV2ROuter02ABI,
    provider
  );
  const arr = await router.getAmountsOut(amountIn.toString(), path);
  return arr[arr.length - 1] as BigNumber;
}

export async function getDecimalsOfToken(
  token: Address,
  provider: Provider
): Promise<number> {
  const contract = new ethers.Contract(token, erc20ABI, provider);
  return await contract.decimals();
}

export async function findBestPriceInUsdc(
  token: Address,
  chainConfig: ChainConfig,
  provider: Provider,
  tokenDecimals: number
): Promise<BigNumber> {
  const tokenMultiplier = BigNumber.from(10).pow(tokenDecimals);
  const usdcAddress = chainConfig.usdcAddress;
  const daiAddress = chainConfig.daiAddress;
  const maticAddress = chainConfig.maticAddress;
  const router = chainConfig.routerAddress;
  // try direct pair
  let path = [token, usdcAddress];
  let result: BigNumber = await getAvgPriceForTokens(
    tokenMultiplier,
    path,
    router,
    provider
  );
  if (result.gt(0)) {
    return result;
  }
  // try dai in between
  path = [token, daiAddress, usdcAddress];
  result = await getAvgPriceForTokens(tokenMultiplier, path, router, provider);
  if (result.gt(0)) {
    return result;
  }
  //try matic in between
  path = [token, maticAddress, usdcAddress];
  result = await getAvgPriceForTokens(tokenMultiplier, path, router, provider);
  if (result.gt(0)) {
    return result;
  }

  return BigNumber.from(0);
}

type TokenValueResult = { decimals?: number; value?: BigNumber };

async function getValueOfToken8dec({
  token,
  provider,
  chainConfig,
}: {
  token?: Address;
  amount?: BigNumber;
  provider: Provider;
  chainConfig: ChainConfig;
}): Promise<TokenValueResult> {
  if (token == null) return {};
  if (token != chainConfig.usdcAddress) {
    try {
      const tokenDecimals = await getDecimalsOfToken(token, provider);
      const value = await findBestPriceInUsdc(
        token,
        chainConfig,
        provider,
        tokenDecimals
      );
      return { decimals: tokenDecimals, value };
    } catch (err) {
      return {};
    }
  }
  return { decimals: usdcDecimals, value: usdcMultiplier };
}

export type GetValueOfToken8decProps = {
  token?: Address;
  amount?: BigNumber;
  provider: Provider;
};
export type BigNumberCallback = (amount?: BigNumber) => BigNumber | undefined;
export type ValueCallback = (amount?: BigNumber) => number | undefined;

export function useGetValueOfToken8dec({
  token,
  provider,
}: GetValueOfToken8decProps): BigNumberCallback {
  const usdcPrice = useChainlinkFeedData();
  const chainConfig = useChainData();
  const { data } = useQuery(
    ["getValueOfToken8dec", token, chainConfig.contractAddress],
    () =>
      getValueOfToken8dec({
        token,
        provider,
        chainConfig,
      })
  );
  return useCallback(
    (amount?: BigNumber) => {
      if (
        usdcPrice === undefined ||
        data?.value === undefined ||
        data?.decimals === undefined
      ) {
        return undefined;
      }
      return usdcPrice
        .mul(data.value)
        .div(BigNumber.from(10).pow(usdcDecimals))
        .mul(amount ?? 0)
        .div(BigNumber.from(10).pow(data.decimals));
    },
    [usdcPrice, data]
  );
}

export function useGetValueOfToken({
  token,
}: {
  token?: Address;
}): ValueCallback {
  const provider = useProvider();
  const priceDecimals = 6;
  const valueCb = useGetValueOfToken8dec({ token, provider });

  return useCallback(
    (amount?: BigNumber) => {
      const value = valueCb(amount);
      if (value === undefined) return undefined;
      return value.div(100).toNumber() / 10 ** priceDecimals;
    },
    [valueCb]
  );
}
