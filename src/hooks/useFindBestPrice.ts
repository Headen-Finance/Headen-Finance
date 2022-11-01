import { Provider } from "@wagmi/core";
import { BigNumber, ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { Address, erc20ABI, useProvider } from "wagmi";

import { useChainlinkFeedData } from "@/hooks/useChainlinkFeed";

const UniswapV2ROuter02ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
];
//TODO should it be fetched?
const usdcDecimals = 6;
const usdcMultiplier = BigNumber.from(10).pow(usdcDecimals);

const daiDecimals = 18;
// eslint-disable-next-line unused-imports/no-unused-vars
const daiMultiplier = BigNumber.from(10).pow(daiDecimals);

function getUsdcAddress(): Address {
  return "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
}

function getDaiAddress(): Address {
  return "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
}

function getMaticAddress(): Address {
  return "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
}

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
  router: Address,
  provider: Provider,
  tokenDecimals: number
): Promise<BigNumber> {
  const tokenMultiplier = BigNumber.from(10).pow(tokenDecimals);
  const usdcAddress = getUsdcAddress();
  const daiAddress = getDaiAddress();
  const maticAddress = getMaticAddress();
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

export function useGetValueOfToken8dec(
  token: Address,
  amount: BigNumber,
  router: Address,
  provider: Provider
): BigNumber | undefined {
  const usdcPrice = useChainlinkFeedData();
  const [value, setValue] = useState<BigNumber>();
  const [tokenDecimals, setTokenDecimals] = useState<number>(usdcDecimals);
  useEffect(() => {
    if (token != getUsdcAddress()) {
      getDecimalsOfToken(token, provider).then(async (tokenDecimals) => {
        setTokenDecimals(tokenDecimals);
        if (!tokenDecimals) return 0;
        const value = await findBestPriceInUsdc(
          token,
          router,
          provider,
          tokenDecimals
        );
        setValue(value);
      });
    } else {
      setValue(usdcMultiplier);
    }
  }, [token, router, provider]);

  return useMemo(() => {
    if (usdcPrice === undefined || value === undefined) {
      return undefined;
    }
    return usdcPrice
      .mul(value)
      .div(BigNumber.from(10).pow(usdcDecimals))
      .mul(amount)
      .div(BigNumber.from(10).pow(tokenDecimals));
  }, [amount, tokenDecimals, usdcPrice, value]);
}

export async function useGetValueOfToken(token: Address, amount: BigNumber) {
  // const uni = '0xb33EaAd8d922B1083446DC23f610c2567fB5180f' //UNI polygon
  // const USDCPoly = getUsdcAddress()
  // const DAIPoly = getDaiAddress()
  // const wmatic = getMaticAddress()
  const provider = useProvider();
  //TODO router extract to chain config
  const router = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff";
  const priceDecimals = 8;
  const value = useGetValueOfToken8dec(token, amount, router, provider);
  if (value === undefined) {
    return undefined;
  }
  return value.toNumber() / 10 ** priceDecimals;
}
