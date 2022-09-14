import { Divider } from '@mantine/core';
import { Button, Input } from '@mantine/core';
import * as React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoIosAdd } from 'react-icons/io';

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
      style={{ height: '200px', width: '200px' }}
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
        <section className='mt-6 flex w-full max-w-screen-lg items-center justify-around bg-black'>
          <HomeInfo title='Total borrowed' value='$130k' />
          <Indicator value={0.4} />
          <HomeInfo title='Total supply' value='$300k' />
        </section>
      </main>
      <div className='flex items-center'>
        <div className='mx-2 max-w-screen-lg  flex-1 rounded-lg bg-white p-10 text-black'>
          <div className='flex justify-between'>
            <span> All pools</span>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                leftIcon={<IoIosAdd size={24} />}
                radius='xl'
                sx={{ height: '32px' }}
                compact
                className='font-light'
              >
                Create pool
              </Button>
              <Input
                icon={<AiOutlineSearch />}
                placeholder='Search Market'
                variant='unstyled'
                className='rounded-full border border-black'
                size='xs'
                radius='xl'
              />
            </div>
          </div>
          <Divider />
          <div>asdadas</div>
          <div>asdadas</div>
          sd as das d
        </div>
      </div>
      {/*<Button*/}
      {/*    onClick={() =>*/}
      {/*        showNotification({*/}
      {/*            title: 'Default notification',*/}
      {/*            message: 'Hey there, your code is awesome! 🤥',*/}
      {/*        })*/}
      {/*    }*/}
      {/*>*/}
      {/*    Show notification*/}
      {/*</Button>*/}
    </Layout>
  );
}
