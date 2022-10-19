import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { Address, erc20ABI, useContractRead } from 'wagmi';

type ERC20AllowanceProps = {
  watch: boolean;
  address?: Address;
  owner?: Address;
  spender: Address;
  enabled?: boolean;
};

export function useERC20Allowance({
  watch,
  address,
  owner,
  spender,
  enabled,
}: ERC20AllowanceProps): BigNumber | undefined {
  const args = <[Address, Address]>(
    useMemo(() => [owner, spender], [owner, spender])
  );
  const { data } = useContractRead({
    address: address,
    abi: erc20ABI,
    functionName: 'allowance',
    args,
    watch,
    enabled: enabled ?? true,
  });

  return data ? BigNumber.from(data.toString()) : undefined;
}
