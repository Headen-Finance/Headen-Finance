import * as React from 'react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoIosAdd } from 'react-icons/io';
import { useAccount, useBalance } from 'wagmi';

import {
  MarketsResponseDisplay,
  useAllMarketData,
} from '@/hooks/useAllMarketData';
import useDialog from '@/hooks/useDialog';

import { AssetDialog } from '@/components/AssetDialog';
import Button from '@/components/buttons/Button';
import { DialogFrame } from '@/components/dialog/DialogFrame';
import HomeInfo from '@/components/home/HomeInfo';
import Indicator from '@/components/home/Indicator';
import Input from '@/components/inputs/Input';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

type PoolsRowData = {
  item: MarketsResponseDisplay;
};

function PoolsRow({ item }: PoolsRowData) {
  const acc = useAccount();
  const { data } = useBalance({
    addressOrName: acc.address,
    token: item.tokenAddress,
  });
  return (
    <tr
      // key={index}
      className='cursor-pointer border-b bg-white text-black hover:bg-gray-200'
      onClick={() =>
        toast.promise(
          new Promise<void>((resolve, reject) => {
            const fail = Math.random() < 0.5;
            setTimeout(() => (fail ? reject() : resolve()), 2000);
          }),
          {
            success: 'wohooo',
            error: 'Ooops, something went wrong',
            loading: 'Loading',
          }
        )
      }
    >
      <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium'>
        <span>{data?.symbol} token</span>
      </th>
      <td className='py-4 px-6'>{data?.symbol} detail</td>
      <td className='py-4 px-6'>{item.amountStaked}</td>
      <td className='py-4 px-6'>{item.supplyRate}%</td>
      <td className='py-4 px-6'>{item.borrowRate}%</td>
      <td className='py-4 px-6'>-</td>
      <td className='py-4 px-6'>0.08%</td>
      <td className='py-4 px-6'>
        {data?.formatted}
        {data?.symbol}
      </td>
    </tr>
  );
}

function PoolsTable() {
  const { markets } = useAllMarketData();
  return (
    <table className='w-full text-left text-sm text-xs'>
      <thead className='text-xs uppercase text-black'>
        <tr className='bg-gray-300'>
          <th scope='col' className='w-1/4 py-3 px-6'>
            Asset
          </th>
          <th scope='col' className='py-3 px-6'>
            Detail
          </th>
          <th scope='col' className='py-3 px-6'>
            Available liquidity
          </th>
          <th scope='col' className='py-3 px-6'>
            Deposit rate
          </th>
          <th scope='col' className='py-3 px-6'>
            Borrow rate
          </th>
          <th scope='col' className='py-3 px-6'>
            Collateral
          </th>
          <th scope='col' className='py-3 px-6'>
            APY
          </th>
          <th scope='col' className='py-3 px-6'>
            Wallet
          </th>
        </tr>
      </thead>
      <tbody>
        {markets.map((value: MarketsResponseDisplay, index: number) => (
          <PoolsRow key={index} item={value} />
        ))}
      </tbody>
    </table>
  );
}

export default function HomePage() {
  const [isOpen, setIsOpen] = useState(true);

  function closeModal() {
    setIsOpen(false);
  }

  const openDialog = useDialog();
  function openTestDialog() {
    openDialog({
      title: 'hello1',
      description: 'oooops',
      variant: 'danger',
      // submitText: 'submit'
    });
  }

  const dialog = useMemo(
    () => (
      <DialogFrame show={isOpen} onClose={closeModal} className='w-[100vw]'>
        <AssetDialog />
      </DialogFrame>
    ),
    [isOpen]
  );

  const createPoolButton = (
    <Button
      variant='outline'
      leftIcon={<IoIosAdd size={24} />}
      className='h-8 rounded-full border-black text-xs font-light text-black'
      onClick={() => setIsOpen(true)}
    >
      Create pool
    </Button>
  );

  const searchInput = (
    <Input
      leftIcon={<AiOutlineSearch color='black' />}
      placeholder='Search Market'
      variant='outline'
      className='rounded-full border-black py-[7px] text-black'
    />
  );

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      {dialog}
      <main className='flex justify-center  text-white'>
        <section className='mt-14 grid w-full max-w-screen-xl grid-cols-2 grid-rows-2 items-center justify-around bg-black sm:grid-cols-3 sm:grid-rows-1'>
          <div className=' order-1 col-span-2 sm:order-3 sm:col-span-1 '>
            <Indicator
              onClick={() => openTestDialog()}
              value={0.4}
              className='m-auto'
            />
          </div>
          <HomeInfo title='Total borrowed' value='$130k ' className='order-1' />
          <HomeInfo title='Total supply' value='$300k' className='order-4' />
        </section>
      </main>
      <div className='mt-[150px] flex justify-center bg-gray-100 pb-24'>
        <div className='mx-2 -mt-[100px] w-full  max-w-screen-xl flex-1 shrink rounded-lg bg-white p-2 text-black sm:p-10'>
          <div className='mb-3 flex flex-col items-center justify-between border-b sm:flex-row'>
            <span className='p-2 font-semibold'> ALL POOLS</span>
            <div className='flex gap-2'>
              {createPoolButton}
              {searchInput}
            </div>
          </div>
          <div className='relative w-full overflow-x-auto'>
            <PoolsTable />
          </div>
        </div>
      </div>
    </Layout>
  );
}
