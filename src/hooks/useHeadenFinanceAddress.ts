import { Address } from "wagmi";

import { useChainData } from "@/hooks/useChainData";

export function useHeadenFinanceAddress(): Address {
  return useChainData().contractAddress;
}
