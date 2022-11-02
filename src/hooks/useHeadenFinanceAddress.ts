import { useChainData } from "@/hooks/useChainData";

export function useHeadenFinanceAddress() {
  return useChainData().contractAddress;
}
