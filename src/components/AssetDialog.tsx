import { Tab } from '@headlessui/react';
import { useState } from 'react';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import { Stake } from '@/components/headen/Stake';

type AssetDialogProp = {
  tokenAddress: string;
};
export const AssetDialog = ({ tokenAddress }: AssetDialogProp) => {
  // const tokenAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'; //LINK on goerli
  // useChainlinkFeed();
  const [categories] = useState({
    Supply: () => <Stake tokenAddress={tokenAddress} />,
    Borrow: () => <div> borrow...</div>,
    Withdraw: () => <div> withdraw...</div>,
    Repay: () => <div> repay...</div>,
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
            <Tab.Panel key={idx}>{element()}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
