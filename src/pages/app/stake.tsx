import * as React from 'react';

import clsxm from '@/lib/clsxm';

import Button from '@/components/buttons/Button';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function StakePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main className='flex justify-center  text-white'>
        <section className='w-full max-w-screen-xl'>
          <div className='px-4 text-center md:w-2/3 md:px-10 md:text-left lg:w-1/2 '>
            <h1 className='text-3xl md:text-5xl'>Staking</h1>
            <p className='mt-5 text-sm text-[#8E93A3]'>
              Put your crypto assets to work today.Start generating the best
              yields.
            </p>
            <p className='mt-3 text-sm text-[#8E93A3]'>
              Liquidity tokens are accepted: No need to liquidate your
              investments tokens like Uniswap V3 NFT but rather use them as a
              collateral. Also, With Multi-chain lending, You do not need to
              move your liquidity from any chain to the chain of choice(Polygon
              chain). Just stake and have access to credit base borrowing on any
              chain and you can borrow from any chain without withdrawing and
              bridging
            </p>
          </div>
        </section>
      </main>
      <div className='mt-[150px] flex justify-center bg-gray-100 pb-24'>
        <div className='mx-2 -mt-[100px] flex w-full  max-w-screen-xl flex-1 shrink flex-wrap justify-center gap-10 rounded-lg p-2 text-black sm:p-10'>
          {Array.of(...Array(3)).map((value, index) => (
            <div
              key={index}
              className='min-w-[290px] max-w-[370px] grow rounded-xl bg-white p-6'
            >
              <h2 className='text-center text-xl font-semibold'>
                50x V3 DAI / USDC 0.05% tier
              </h2>
              <p className='px-2 pt-4 pb-20 text-center text-sm'>
                Earn on your Dai with exposure to the DAI,USDC 5bps pool on UNI
                V3
              </p>
              <div className='flex flex-col gap-2 text-sm'>
                <div className='flex'>
                  <span className='flex-grow'>7 day net APY</span>
                  <span className='font-semibold'>4.26%</span>
                </div>
                <div className='flex'>
                  <span className='flex-grow'>90 day net APY</span>
                  <span className='font-semibold'>3.97%</span>
                </div>
                <div className='flex'>
                  <span className='flex-grow'>90 day net APY</span>
                  <span className='font-semibold'>3.97%</span>
                </div>
                <div className='flex'>
                  <span className='flex-grow'>Current Liquidity Availble</span>
                  <span className='font-semibold'>50.0M</span>
                </div>
                <div className='flex'>
                  <span className='flex-grow'>Protocol</span>
                  <span>Maker/Gelato</span>
                </div>
              </div>
              <Button
                type='button'
                className={clsxm(
                  'w-full justify-center py-3.5 sm:py-5',
                  'mt-12 w-full justify-center rounded-lg'
                )}
                variant='primary'
              >
                Stake
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
