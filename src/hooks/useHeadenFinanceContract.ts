import { useContract, useProvider } from 'wagmi';

import { ContractContext } from '@/generated/HeadenFinanceChild';

import { abi } from '../../artifacts/contracts/headenFinanceChild.sol/HeadenFinanceChild.json';

export function useHeadenFinance(): ContractContext {
  return useContract<ContractContext>({
    addressOrName: '',
    contractInterface: abi,
    signerOrProvider: useProvider(),
  });
}
