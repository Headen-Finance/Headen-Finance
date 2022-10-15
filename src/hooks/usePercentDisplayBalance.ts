import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

export function usePercentDisplayBalance(tokenAddress: string | null) {
  const acc = useAccount();
  const balance = useBalance({
    addressOrName: acc.address,
    token: tokenAddress ?? AddressZero,
    enabled: !!tokenAddress,
  });

  const [percent, setPercent] = useState(50);
  const amount = useMemo(
    () => balance.data?.value?.mul(percent)?.div(100),
    [percent, balance]
  );

  const displayAmount = useMemo(
    () =>
      (amount
        ?.div(BigNumber.from(10).pow((balance.data?.decimals ?? 8) - 3))
        ?.toNumber() ?? 0) / 1000,
    [amount, balance]
  );

  return {
    balance,
    percent,
    setPercent,
    amount,
    displayAmount,
  };
}
