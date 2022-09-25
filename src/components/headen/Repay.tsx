import { BigNumber } from 'ethers';
import * as React from 'react';
import { FC, useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import { useAccount, useBalance } from 'wagmi';

import {
  ApprovalState,
  useERC20ApproveCallback,
} from '@/hooks/useERC20ApproveCallback';

import Button from '@/components/buttons/Button';
import { ConnectApproveAction } from '@/components/web3/ConnectWallet';

type ActionProp = {
  tokenAddress: string;
};
export const Repay: FC<ActionProp> = ({ tokenAddress }) => {
  const acc = useAccount();
  const balance = useBalance({
    addressOrName: acc.address,
    token: tokenAddress,
  });
  const [percent, setPercent] = useState(50);
  // const hf = useHeadenFinance();
  const [allowance, allow] = useERC20ApproveCallback(
    true,
    tokenAddress,
    BigNumber.from(100)
  );

  return (
    <>
      <div className='p-0 sm:p-5 md:p-10'>
        <div className='md:py-10'>
          <div className='relative'>
            <span className='text-2xl sm:text-5xl'>
              {(balance.data?.value
                ?.div(BigNumber.from(10).pow(balance.data?.decimals - 3))
                ?.mul(percent)
                ?.div(100)
                ?.toNumber() ?? 0) / 1000}
              {balance.data?.symbol}
            </span>
            {/*<span className='text-2xl sm:text-5xl'>{(balance.data?.value?.div(10**balance.data?.decimals )?.toNumber() ?? 0) * percent/100}{balance.data?.symbol}</span>*/}
            <Button
              variant='outline'
              isDarkBg
              className='absolute left-0 top-0 aspect-square rounded-full border-white p-0.5 text-xs text-white sm:text-lg'
            >
              Max
            </Button>
          </div>
          <h6>=$0</h6>
        </div>
        <> allowance: {allowance}</>
        {allowance === ApprovalState.NOT_APPROVED && (
          <Button onClick={allow}> Approve</Button>
        )}
        <div className='relative py-5 sm:py-10 '>
          <input
            type='range'
            className='range-input h-1.5 w-full cursor-pointer appearance-none  rounded-lg bg-gray-200 accent-amber-900 dark:bg-gray-100'
            min={0}
            max={100}
            step={1}
            // value={percent}
            onChange={(event) => setPercent(parseInt(event.target.value))}
            id='customRange1'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between'>
            <span>User Borrow Limit</span>
            <span>$0.00</span>
          </div>
          <div className='flex justify-between'>
            <span>Utilization</span>
            <span>0%</span>
          </div>
          <div className='flex justify-between'>
            <span>Supply APR</span>
            <span>0.99%</span>
          </div>
        </div>
        <Button isDarkBg className='mt-4 mb-2 sm:mt-8' variant='ghost'>
          More parameters <IoChevronDown />
        </Button>
        <ConnectApproveAction className='w-full justify-center py-5'>
          Repay
        </ConnectApproveAction>
        <div className='mt-5 flex justify-between'>
          <span>
            {' '}
            {balance.data?.formatted} {balance.data?.symbol} in wallet
          </span>
          <span>0 {balance.data?.symbol} supplied</span>
        </div>
      </div>
    </>
  );
};
