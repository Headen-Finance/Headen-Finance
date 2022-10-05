import { BigNumber } from 'ethers';
import * as React from 'react';
import { FC, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { IoChevronDown } from 'react-icons/io5';
import { MdInfoOutline } from 'react-icons/md';
import { useAccount, useBalance } from 'wagmi';

import clsxm from '@/lib/clsxm';
import { useHeadenFinanceWrite } from '@/hooks/useHeadenFinanceContract';

import Button from '@/components/buttons/Button';
import { ConnectApproveAction } from '@/components/web3/ConnectWallet';

import NoWalletImage from '~/images/app/no_wallet.svg';

type ActionProp = {
  tokenAddress: string;
};
export const Stake: FC<ActionProp> = ({ tokenAddress }) => {
  const acc = useAccount();
  const balance = useBalance({
    addressOrName: acc.address,
    token: tokenAddress,
    enabled: acc.isConnected,
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

  const hf = useHeadenFinanceWrite();
  const [loading, setLoading] = useState(false);

  const stake = useCallback(async () => {
    if (amount == undefined) {
      // eslint-disable-next-line no-console
      console.error('amount was undefined');
      return;
    }
    try {
      setLoading(true);
      const tx = await hf.stakeToken(tokenAddress, amount);
      await toast.promise(tx.wait(), {
        success: 'Successfully staked',
        error: 'Ooops, something went wrong',
        loading: (
          <span className='flex flex-col'>
            <span>Waiting for confirmation</span>
            <span>tx: {tx.hash}</span>
          </span>
        ),
      });
      setLoading(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toast.error(`${e}`);
      setLoading(false);
    }
  }, [amount, hf, tokenAddress]);

  return (
    <>
      <div className='p-0 sm:p-5 md:p-10'>
        <div className='flex justify-center text-[0.6em]'>
          <span>{tokenAddress}</span>
        </div>
        {acc.status == 'disconnected' && (
          <div className='flex flex-col items-center text-xs '>
            <NoWalletImage style={{ height: 172, width: 189, margin: 20 }} />
            <div className='mt-5'>
              To borrow/stake you would have to connect your wallet
            </div>
            <div className='mb-5'>Click the button below to get started</div>
          </div>
        )}
        {acc.status != 'disconnected' && (
          <>
            <div className='md:py-10'>
              <div className='relative'>
                <span className='text-2xl sm:text-5xl'>
                  {displayAmount}
                  {balance.data?.symbol}
                </span>
                {/*<span className='text-2xl sm:text-5xl'>{(balance.data?.value?.div(10**balance.data?.decimals )?.toNumber() ?? 0) * percent/100}{balance.data?.symbol}</span>*/}
                {/*<Button*/}
                {/*  variant='outline'*/}
                {/*  isDarkBg*/}
                {/*  className='absolute left-0 top-12 aspect-square rounded-full border-white p-0.5 text-xs text-white sm:text-lg'*/}
                {/*  onClick={()=>setPercent(100)}*/}
                {/*>*/}
                {/*  Max*/}
                {/*</Button>*/}
              </div>
              {/*<h6>=$0</h6>*/}
            </div>
            {/*<> allowance: {allowance}</>*/}
            {/*{allowance === ApprovalState.NOT_APPROVED && (*/}
            {/*  <Button onClick={allow}> Approve</Button>*/}
            {/*)}*/}

            {balance.data?.value?.eq(0) ? (
              <div className='pb-4 text-sm font-bold'>
                Ooops, it looks like that you do not have any{' '}
                {balance.data?.symbol}
              </div>
            ) : (
              <div className='relative py-5 sm:py-10 '>
                <input
                  type='range'
                  className='range-input h-1.5 w-full cursor-pointer appearance-none  rounded-lg bg-gray-200 accent-amber-900 dark:bg-gray-100'
                  min={1}
                  max={100}
                  step={1}
                  value={percent}
                  onChange={(event) => setPercent(parseInt(event.target.value))}
                  id='customRange1'
                />
                <div className='flex justify-between'>
                  <span> 0</span>
                  <span> {balance.data?.formatted}</span>
                </div>
              </div>
            )}
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
                <span>6.99%</span>
              </div>
            </div>
            <Button className='mt-4 mb-2 sm:mt-8' variant='ghost'>
              More parameters <IoChevronDown />
            </Button>
          </>
        )}
        <ConnectApproveAction
          tokenAddress={tokenAddress}
          className='w-full justify-center py-5'
        >
          <Button
            onClick={stake}
            type='button'
            isLoading={loading}
            className={clsxm(
              'w-full justify-center py-5',
              'w-full justify-center py-5'
            )}
            variant='light'
          >
            Add supply
          </Button>
        </ConnectApproveAction>
        <div className='pt-5 text-[0.625rem]'>
          <MdInfoOutline className='mr-1 -mt-0.5 inline-block' />
          You are yet to connect your wallet
        </div>

        {/*<div className='mt-5 flex justify-between'>*/}
        {/*  <span>*/}
        {/*    {' '}*/}
        {/*    {balance.data?.formatted} {balance.data?.symbol} in wallet*/}
        {/*  </span>*/}
        {/*  <span>0 {balance.data?.symbol} supplied</span>*/}
        {/*</div>*/}
      </div>
    </>
  );
};
