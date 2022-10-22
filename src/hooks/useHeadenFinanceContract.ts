import { GetContractResult } from "@wagmi/core";
import { useContract, useProvider, useSigner } from "wagmi";

import { useHeadenFinanceAddress } from "@/hooks/useHeadenFinanceAddress";

import { headenFinanceAbi } from "@/constant/env";

export function useHeadenFinance(): GetContractResult | null {
  const address = useHeadenFinanceAddress();
  return useContract({
    address: address,
    abi: headenFinanceAbi,
    signerOrProvider: useProvider(),
  });
}

export function useHeadenFinanceWrite(): null {
  const address = useHeadenFinanceAddress();
  const { data: signer } = useSigner();
  return useContract({
    address: address,
    abi: headenFinanceAbi,
    signerOrProvider: signer,
  });
}
