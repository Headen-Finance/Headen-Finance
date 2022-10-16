import { Disclosure, Transition } from '@headlessui/react';
import { FC, Fragment, useCallback, useState } from 'react';
import * as React from 'react';
import toast from 'react-hot-toast';
import { IoChevronDown } from 'react-icons/io5';
import { MdInfoOutline } from 'react-icons/md';
import { RpcError } from 'wagmi';

import { useHeadenFinanceWrite } from '@/hooks/useHeadenFinanceContract';
import { usePercentDisplayBalance } from '@/hooks/usePercentDisplayBalance';

import Button from '@/components/buttons/Button';
import { AssetDialogActionButton } from '@/components/headen/AssetDialogActionButton';
import { Loading } from '@/components/Loading';
import { ConnectApproveAction } from '@/components/web3/ConnectWallet';
import { NoWalletConnected } from '@/components/web3/NoWalletConnected';
import { WhenWallet } from '@/components/web3/WhenAccount';

type ActionProp = {
  tokenAddress: string;
};

export const Stake: FC<ActionProp> = ({ tokenAddress }) => {
  const { balance, amount, displayAmount, percent, setPercent } =
    usePercentDisplayBalance(tokenAddress);

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
      toast.error(`${(e as RpcError<RpcError>).data?.message}`);
      setLoading(false);
    }
  }, [amount, hf, tokenAddress]);

  return (
    <>
      <div className='p-0 px-2.5 pb-2.5 sm:p-5 md:p-10'>
        <div className='flex justify-center text-[0.6em]'>
          <span>{tokenAddress}</span>
        </div>
        <NoWalletConnected />
        <WhenWallet status='connecting'>
          <div className='flex items-center justify-center p-5'>
            <Loading></Loading>
          </div>
        </WhenWallet>
        <WhenWallet status='connected'>
          <div className='py-3.5 sm:py-5 md:py-10'>
            <div className='relative'>
              <span className='text-2xl sm:text-3xl md:text-5xl'>
                {displayAmount}
                {balance.data?.symbol}
              </span>
              {/*<span className='text-2xl sm:text-5xl'>{(balance.data?.value?.div(10**balance.data?.decimals )?.toNumber() ?? 0) * percent/100}{balance.data?.symbol}</span>*/}
              <Button
                variant='outline'
                isDarkBg
                className='absolute right-0 top-1 aspect-square rounded-full border-black p-0.5 text-xs text-black sm:text-lg'
                onClick={() => setPercent(100)}
              >
                Max
              </Button>
            </div>
          </div>

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
          <Disclosure>
            <Disclosure.Button as={Fragment}>
              <Button className='mt-4 mb-2 sm:mt-8' variant='ghost'>
                More parameters <IoChevronDown />
              </Button>
            </Disclosure.Button>

            <Transition
              enter='transition-all duration-100 ease-out'
              enterFrom='transform max-h-0 scale-95 opacity-0'
              enterTo='transform scale-100  max-h-[200px] opacity-100'
              leave='transition-all duration-75 ease-out'
              leaveFrom='transform scale-100  max-h-[200px] opacity-100'
              leaveTo='transform max-h-0 scale-95 opacity-0'
            >
              <Disclosure.Panel>
                <div className='flex flex-col gap-1 pb-4'>
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
              </Disclosure.Panel>
            </Transition>
          </Disclosure>
        </WhenWallet>
        <ConnectApproveAction
          tokenAddress={tokenAddress}
          className='w-full justify-center'
        >
          <AssetDialogActionButton onClick={stake} loading={loading}>
            Add supply
          </AssetDialogActionButton>
        </ConnectApproveAction>
        <WhenWallet status='disconnected'>
          <div className='pt-5 text-[0.625rem]'>
            <MdInfoOutline className='mr-1 -mt-0.5 inline-block' />
            You are yet to connect your wallet
          </div>
        </WhenWallet>
      </div>
    </>
  );
};
