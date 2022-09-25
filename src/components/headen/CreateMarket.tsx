import { AddressZero } from '@ethersproject/constants';
import { BigNumber } from 'ethers';
import * as React from 'react';
import { FC, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount, useBalance } from 'wagmi';

import clsxm from '@/lib/clsxm';
import { useHeadenFinanceWrite } from '@/hooks/useHeadenFinanceContract';
import { useUniswapTokenList } from '@/hooks/useUniswapTokenList';

import Button from '@/components/buttons/Button';
import { ConnectApproveAction } from '@/components/web3/ConnectWallet';

export const CreateMarket: FC = () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const availableTokens = useUniswapTokenList();
  const acc = useAccount();
  const balance = useBalance({
    addressOrName: acc.address,
    token: tokenAddress ?? AddressZero,
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

  const createMarket = useCallback(async () => {
    if (amount == undefined) {
      // eslint-disable-next-line no-console
      console.error('amount was undefined');
      return;
    }
    if (tokenAddress == null) {
      // eslint-disable-next-line no-console
      console.error('ano token is selected');
      return;
    }
    try {
      setLoading(true);
      const tx = await hf.createMarketPool(tokenAddress, amount);
      await toast.promise(tx.wait(), {
        success: 'Successfully created the pool and staked',
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

        {tokenAddress && (
          <ConnectApproveAction
            tokenAddress={tokenAddress}
            className='w-full justify-center py-5'
          >
            <Button
              onClick={createMarket}
              type='button'
              isLoading={loading}
              className={clsxm(
                'w-full justify-center py-5',
                'w-full justify-center py-5'
              )}
              variant='light'
            >
              Create market and stake
            </Button>
          </ConnectApproveAction>
        )}
        {!tokenAddress && (
          <Button
            type='button'
            disabled={true}
            className={clsxm(
              'w-full justify-center py-5',
              'w-full justify-center py-5'
            )}
            variant='light'
          >
            Select token first
          </Button>
        )}
      </div>
    </>
  );
};
