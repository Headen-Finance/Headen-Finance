import * as React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoIosAdd } from 'react-icons/io';

import Button from '@/components/buttons/Button';
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
import IndicatorArrow from '~/svg/indicator-arrow.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.
type HomeInfoProps = {
  title: string;
  value: string;
};

function HomeInfo({ title, value }: HomeInfoProps) {
  return (
    <div
      style={{ height: '100px' }}
      className='flex grow basis-1 flex-col items-center justify-around'
    >
      <span className='text-md font-semibold'>{title}</span>
      <span className='text-lg font-bold'>{value}</span>
    </div>
  );
}

type IndicatorPropType = {
  value: number;
};

function Indicator({ value }: IndicatorPropType) {
  return (
    <div
      style={{ height: '250px', width: '250px' }}
      className='border-6 flex flex-col items-center justify-center rounded-full border-white'
    >
      <span className='font-semibold'>Your risk level</span>
      <span className='m-2 text-2xl font-bold'>0</span>
      <div className='relative h-1.5 w-3/5 bg-gradient-to-r from-yellow-300 via-orange-500 to-red-700'>
        <IndicatorArrow
          style={{
            left: value * 100 + '%',
            bottom: '3px',
            height: '10px',
            width: '10px',
            marginLeft: '-10px',
          }}
          className='absolute'
        ></IndicatorArrow>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main className='flex justify-center  text-white'>
        <section className='mt-14 flex w-full max-w-screen-xl items-center justify-around bg-black'>
          <HomeInfo title='Total borrowed' value='$130k' />
          <Indicator value={0.4} />
          <HomeInfo title='Total supply' value='$300k' />
        </section>
      </main>
      <div className='mt-[150px] flex justify-center bg-gray-100 pb-24 '>
        <div className='mx-2 mt-[-100px]  max-w-screen-xl flex-1 rounded-lg bg-white p-10 text-black'>
          <div className='mb-3 flex justify-between border-b'>
            <span className='font-semibold'> ALL POOLS</span>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                leftIcon={<IoIosAdd size={24} />}
                className='h-8 rounded-full border-black text-xs font-light text-black'
              >
                Create pool
              </Button>
              <Input
                leftIcon={<AiOutlineSearch color='black' />}
                placeholder='Search Market'
                variant='outline'
                className='rounded-full border-black py-[7px] text-black'
              />
            </div>
          </div>
          <div className='relative overflow-x-auto'>
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
                {[...Array(5)].map((value: undefined, index: number) => (
                  <tr
                    key={index}
                    className='border-b bg-white text-black hover:bg-gray-200'
                  >
                    <th
                      scope='row'
                      className='whitespace-nowrap py-4 px-6 font-medium'
                    >
                      Aave token
                    </th>
                    <td className='py-4 px-6'>Aave detail</td>
                    <td className='py-4 px-6'>4.9k</td>
                    <td className='py-4 px-6'>0.2%</td>
                    <td className='py-4 px-6'>0.23%</td>
                    <td className='py-4 px-6'>-</td>
                    <td className='py-4 px-6'>0.08%</td>
                    <td className='py-4 px-6'>0 AAVE</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
