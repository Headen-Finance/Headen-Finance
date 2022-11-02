import { useNetwork } from "wagmi";

import { CHAIN_CONFIG, ChainConfig } from "@/constant/env";

export function useChainData(): ChainConfig {
  const { chain } = useNetwork();
  return CHAIN_CONFIG[chain?.id ?? -1];
}
