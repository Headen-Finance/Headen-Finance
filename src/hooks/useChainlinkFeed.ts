import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContract, useContractRead, useProvider } from "wagmi";
// const addr = '0x48731cF7e84dc94C5f84577882c14Be11a5B7456';
const addr = "0xfe4a8cc5b5b2366c1b58bea3858e81843581b2f7"; //polygon
const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export enum FeedState {
  INIT = "INIT",
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
}

export function useChainlinkFeedData() {
  const latestRoundData = useContractRead({
    address: addr,
    abi: aggregatorV3InterfaceABI,
    functionName: "latestRoundData",
    cacheTime: 10000,
  });
  return latestRoundData?.data?.answer;
}

export const useChainlinkContract = () => {
  const provider = useProvider();
  return useContract({
    address: addr,
    abi: aggregatorV3InterfaceABI,
    signerOrProvider: provider,
  });
};

export function useChainlinkFeed() {
  const [lastRoundData, setLastRoundData] = useState<BigNumber>();
  const [state, setState] = useState(FeedState.INIT);
  const priceFeed = useChainlinkContract();

  const refresh = useCallback(() => {
    setState(FeedState.FETCHING);
    priceFeed
      ?.latestRoundData()
      ?.then((roundData) => {
        setState(FeedState.FETCHED);
        setLastRoundData(roundData.answer);
        // Do something with roundData
        // eslint-disable-next-line no-console
        console.log("Latest Round Data", roundData);
      })
      ?.catch(() => {
        setState(FeedState.ERROR);
        setLastRoundData(undefined);
      });
  }, [priceFeed]);

  useEffect(() => refresh(), [refresh]);

  return { lastRoundData, state, refresh };
}
