import { AddressZero } from "@ethersproject/constants";
import { useAccount, useContractRead } from "wagmi";

import { useHeadenFinanceAddress } from "@/hooks/useHeadenFinanceAddress";

import { headenFinanceAbi } from "@/constant/env";

export function useUserData() {
  const { address, isConnected } = useAccount();
  const hfAddress = useHeadenFinanceAddress();
  //TODO untested, not available in the current version
  const { data } = useContractRead({
    address: hfAddress,
    abi: headenFinanceAbi,
    functionName: "users",
    args: [address ?? AddressZero],
    enabled: Boolean(address && isConnected),
  });
  return data;
}
