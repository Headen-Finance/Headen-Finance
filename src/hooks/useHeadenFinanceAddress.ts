import { useMemo } from 'react';
import { useNetwork } from 'wagmi';

import { CONTRACT_ADDRESS } from '@/constant/env';

export function useHeadenFinanceAddress() {
  const { chain } = useNetwork();
  return useMemo(() => CONTRACT_ADDRESS[chain?.id ?? -1], [chain]);
}
