import { AddressZero } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import { useMemo, useState } from "react";
import { Address, useAccount, useBalance } from "wagmi";

export function usePercentDisplayBalance(tokenAddress: Address | null) {
  const acc = useAccount();
  const balance = useBalance({
    addressOrName: acc.address,
    token: tokenAddress ?? AddressZero,
    enabled: !!tokenAddress,
    staleTime: 10_000,
  });

  const decimals = balance.data?.decimals ?? 8;

  const { percent, setPercent, amount, displayAmount } = useDisplayPercent({
    total: balance.data?.value,
    decimals,
  });

  return {
    balance,
    percent,
    setPercent,
    amount,
    displayAmount,
  };
}

export function useDisplayPercent({
  total,
  decimals,
}: {
  decimals: number;
  total?: BigNumber | null;
}) {
  const [percent, setPercent] = useState(50);
  const amount = useMemo(() => total?.mul(percent)?.div(100), [percent, total]);

  const displayAmount = useMemo(
    () =>
      (amount?.div(BigNumber.from(10).pow(decimals - 3))?.toNumber() ?? 0) /
      1000,
    [amount, decimals]
  );
  return { percent, setPercent, amount, displayAmount };
}
