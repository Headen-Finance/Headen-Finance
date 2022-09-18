import { Tab } from '@headlessui/react';
import { useState } from 'react';
import * as React from 'react';
import { IoChevronDown } from 'react-icons/io5';

import clsxm from '@/lib/clsxm';

import Button from '@/components/buttons/Button';

export const AssetDialog = () => {
  const [categories] = useState({
    Supply: (
      <div className='p-0 sm:p-5 md:p-10'>
        <div className='md:py-10'>
          <div className='relative'>
            <span className='text-2xl sm:text-5xl'>SOL</span>
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
        <div className='relative py-5 sm:py-10 '>
          <input
            type='range'
            className='range-input h-1.5 w-full cursor-pointer appearance-none  rounded-lg bg-gray-200 accent-amber-900 dark:bg-gray-100'
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
        <Button variant='light' className='w-full justify-center py-5'>
          Connect Wallet
        </Button>
        <div className='mt-5 flex justify-between'>
          <span>0 SOL in waller</span>
          <span>0 SOL supplied</span>
        </div>
      </div>
    ),
    Borrow: <div> borrow...</div>,
    Withdraw: <div> withdraw...</div>,
    Repay: <div> repay...</div>,
  });

  return (
    <div className='w-full px-2 sm:px-0'>
      <Tab.Group>
        <Tab.List className='sticky -top-6 z-10 flex space-x-1 bg-neutral-800 p-1'>
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                clsxm(
                  'w-full  py-2.5 text-sm font-medium leading-5 text-white',
                  'border-b-2 ring-white ring-opacity-60 ring-offset-2 focus-visible:bg-white/[0.1] focus-visible:outline-none',
                  selected
                    ? 'border-white'
                    : 'border-transparent text-blue-100 hover:bg-white/[0.2] hover:text-white'
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='mt-2 w-full'>
          {Object.values(categories).map((element, idx) => (
            <Tab.Panel key={idx}>{element}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
