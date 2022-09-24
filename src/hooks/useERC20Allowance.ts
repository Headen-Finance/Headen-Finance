import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { erc20ABI, useContractRead } from 'wagmi';

export function useERC20Allowance(
  watch: boolean,
  address: string,
  owner?: string,
  spender?: string
): BigNumber | undefined {
  const args = useMemo(() => [owner, spender], [owner, spender]);
  const { data } = useContractRead({
    addressOrName: address,
    contractInterface: erc20ABI,
    functionName: 'allowance',
    args,
    watch,
    enabled: true,
  });

  return data ? BigNumber.from(data.toString()) : undefined;
}
