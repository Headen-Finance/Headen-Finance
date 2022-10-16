import * as React from 'react';
import { FC, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { RpcError, useNetwork } from 'wagmi';

import clsxm from '@/lib/clsxm';
import { useHeadenFinanceWrite } from '@/hooks/useHeadenFinanceContract';
import { usePercentDisplayBalance } from '@/hooks/usePercentDisplayBalance';
import { useUniswapTokenList } from '@/hooks/useUniswapTokenList';

import Button from '@/components/buttons/Button';
import { Select, SelectOption } from '@/components/selects/Select';
import { ConnectApproveAction } from '@/components/web3/ConnectWallet';
import { NoWalletConnected } from '@/components/web3/NoWalletConnected';
import { WhenWallet } from '@/components/web3/WhenAccount';

import { TokenResponse } from '@/store/useUniswapTokensStore';

export const CreateMarket: FC = () => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [tokenAddress, setTokenAddress] = useState<string | null>(null);

  // eslint-disable-next-line unused-imports/no-unused-vars
  const availableTokens = useUniswapTokenList();

  const options = useMemo(
    () =>
      availableTokens.map(
        (value) =>
          ({
            label: value.name,
            value: value,
            id: value.address,
          } as SelectOption<TokenResponse>)
      ),
    [availableTokens]
  );
  const { chain } = useNetwork();
  const { balance, amount, displayAmount, percent, setPercent } =
    usePercentDisplayBalance(tokenAddress);

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
      console.error('no token is selected');
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
    } catch ({ error }) {
      // eslint-disable-next-line no-console
      console.error();

      toast.error(`${(error as RpcError<RpcError>).data?.message}`);
      setLoading(false);
    }
  }, [amount, hf, tokenAddress]);

  return (
    <>
      <div className='p-2.5 sm:p-5 md:p-10'>
        <NoWalletConnected />
        <WhenWallet status='connected'>
          <div className='md:py-10'>
            <div className='relative'>
              {!tokenAddress && <span> Select token address</span>}
              <Select
                options={options}
                className='mb-8'
                selectedOption={options.find(
                  (value) =>
                    value.value.address == tokenAddress &&
                    value.value.chainId == (chain?.id ?? 1)
                )}
                onChanged={(it) => setTokenAddress(it.value.address)}
              />

              {tokenAddress && (
                <span className='text-2xl sm:text-5xl'>
                  {displayAmount}
                  {balance.data?.symbol}
                </span>
              )}
            </div>
            {/*<h6>=$0</h6>*/}
          </div>

          {!tokenAddress ? (
            <></>
          ) : balance.data?.value?.eq(0) ? (
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
        </WhenWallet>

        <ConnectApproveAction
          tokenAddress={tokenAddress}
          className='w-full justify-center py-5'
        >
          {tokenAddress ? (
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
          ) : (
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
        </ConnectApproveAction>
      </div>
    </>
  );
};
