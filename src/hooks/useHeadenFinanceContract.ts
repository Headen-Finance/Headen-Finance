import { useContract, useProvider } from 'wagmi';

import { useHeadenFinanceAddress } from '@/hooks/useHeadenFinanceAddress';

import { headenFinanceAbi } from '@/constant/env';
import { ContractContext } from '@/generated/HeadenFinanceChild';

export function useHeadenFinance(): ContractContext {
  const address = useHeadenFinanceAddress();
  return useContract<ContractContext>({
    addressOrName: address,
    contractInterface: headenFinanceAbi,
    signerOrProvider: useProvider(),
  });
}
