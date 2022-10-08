import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import NoWalletImage from '~/images/app/no_wallet.svg';

export default function StakePage() {
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo title='Repay' />

      <main className='flex justify-center  text-white'>
        <section className='w-full max-w-screen-xl'>
          <div className='px-4 text-center md:w-2/3 md:px-10 md:text-left lg:w-1/2 '>
            <h1 className='mt-4 text-3xl md:mt-14 md:text-5xl'>Repay</h1>
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
      {/*<div className='mt-[150px] flex justify-center bg-gray-100 pb-24'>*/}
      {/*  <div className='mx-2 -mt-[100px] flex w-full  max-w-screen-xl flex-1 shrink flex-wrap justify-center gap-10 rounded-lg p-2 text-black sm:p-10'>*/}
      {/*    <div>*/}
      {/*      <NoWalletImage style={{ height: 172, width: 189, margin: 20 }} />*/}
      {/*      <div className='mt-5 mb-5'>*/}
      {/*        Oops, you have no withdrawal balance*/}
      {/*      </div>*/}
      {/*      <Button*/}
      {/*        type='button'*/}
      {/*        className={clsxm(*/}
      {/*          'w-full justify-center py-3.5 sm:py-5',*/}
      {/*          'w-full justify-center py-3.5 sm:py-5'*/}
      {/*        )}*/}
      {/*        variant='primary'*/}
      {/*      >*/}
      {/*        Start staking*/}
      {/*      </Button>*/}
      {/*      <ButtonLink*/}
      {/*        href="/app/stake"*/}
      {/*        className={clsxm(*/}
      {/*          'w-full justify-center py-3.5 sm:py-5',*/}
      {/*          'w-full justify-center py-3.5 sm:py-5'*/}
      {/*        )}*/}
      {/*        variant='primary'*/}
      {/*      >*/}
      {/*        Start staking*/}
      {/*      </ButtonLink>*/}

      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className='mt-20 flex justify-center bg-gray-100 pb-24'>
        <div className='mx-2 flex w-full  max-w-screen-xl flex-1 shrink flex-wrap justify-center gap-10 rounded-lg p-2 text-black sm:p-10'>
          <div className='flex flex-col items-center'>
            <NoWalletImage style={{ height: 172, width: 189, margin: 20 }} />
            <div className='mt-5 mb-5'>Oops, you have nothing to repay</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
