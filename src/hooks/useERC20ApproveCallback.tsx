/* eslint-disable no-console */
import { BigNumber, Contract } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  erc20ABI,
  useAccount,
  useContract,
  useNetwork,
  usePrepareContractWrite,
  UserRejectedRequestError,
  useSendTransaction,
  useSigner,
} from 'wagmi';

import { CONTRACT_ADDRESS } from '@/constant/env';

import { useERC20Allowance } from './useERC20Allowance';

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000 + 2000)).div(BigNumber.from(10000));
}

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useERC20ApproveCallback(
  watch: boolean,
  tokenAddress: string,
  amountToApprove?: BigNumber,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { chain } = useNetwork();
  const _spender = spender ?? CONTRACT_ADDRESS[chain?.id ?? -1];

  const { address } = useAccount();
  const { data: signer } = useSigner();
  //TODO handle tokens which limits the approve amount
  const { config } = usePrepareContractWrite({
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    functionName: 'approve',
    signer,
    args: [_spender, amountToApprove],
  });
  const { sendTransactionAsync, isLoading: isWritePending } =
    useSendTransaction(config);

  const currentAllowance = useERC20Allowance(
    watch,
    tokenAddress,
    address ?? undefined,
    _spender
  );
  const [loading, setLoading] = useState(false);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !_spender) return ApprovalState.UNKNOWN;
    if (isWritePending || loading) return ApprovalState.PENDING;

    // We might not have enough data to know whether we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lt(amountToApprove)
      ? ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, isWritePending, _spender, loading]);

  const tokenContract = useContract<Contract>({
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
    signerOrProvider: signer,
  });

  const approve = useCallback(async (): Promise<void> => {
    if (
      approvalState !== ApprovalState.NOT_APPROVED &&
      !amountToApprove?.eq(0)
    ) {
      console.error('approve was called unnecessarily');
      return;
    }

    if (!tokenContract) {
      console.error('tokenContract is null');
      return;
    }

    if (!amountToApprove) {
      console.error('missing amount to approve');
      return;
    }

    if (!_spender) {
      console.error('no spender');
      return;
    }

    // let useExact = false
    // const estimatedGas = await tokenContract.estimateGas.approve(_spender, MaxUint256).catch(() => {
    //   // General fallback for tokens who restrict approval amounts
    //   useExact = true
    //   return tokenContract.estimateGas.approve(_spender, amountToApprove.toString())
    // })

    try {
      if (sendTransactionAsync) {
        const data = await sendTransactionAsync();
        setLoading(true);
        await toast.promise(data.wait(), {
          success: 'Successfully approved',
          error: 'Ooops, something went wrong',
          loading: (
            <p className='flex flex-col'>
              <span>Waiting for confirmation</span>
              <span>tx: {data.hash}</span>
            </p>
          ),
        });
        setLoading(false);
      }
      // const data = await sendTransactionAsync({
      //
      //   recklesslySetUnpreparedRequest: ,
      //   request: {
      //     from: address,
      //     to: tokenContract?.address,
      //     data: tokenContract.interface.encodeFunctionData('approve', [
      //       spender,
      //       useExact ? amountToApprove.quotient.toString() : MaxUint256,
      //     ]),
      //     gasLimit: calculateGasMargin(estimatedGas),
      //   }
      // })

      // createToast({
      //   txHash: data.hash,
      //   href: Chain.from(amountToApprove.currency.chainId).getTxUrl(data.hash),
      //   promise: data.wait(),
      //   summary: {
      //     pending: <Dots>Approving {amountToApprove.currency.symbol}</Dots>,
      //     completed: `Successfully approved ${amountToApprove.currency.symbol}`,
      //     failed: `Something went wrong approving ${amountToApprove.currency.symbol}`,
      //   },
      // })
    } catch (e: unknown) {
      if (!(e instanceof UserRejectedRequestError)) {
        console.error(e);
      }
    }
  }, [
    approvalState,
    tokenContract,
    amountToApprove,
    _spender,
    sendTransactionAsync,
  ]);

  return [approvalState, approve];
}
