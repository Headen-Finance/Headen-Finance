import { solidityKeccak256 } from "ethers/lib/utils";
import { Address } from "wagmi";

import { HASH_SALT } from "@/constant/env";

export function getKeccak256ForMarket(
  address: Address,
  tokenAddress: Address
): string {
  return solidityKeccak256(
    ["address", "address", "string"],
    [address, tokenAddress, HASH_SALT]
  );
}
