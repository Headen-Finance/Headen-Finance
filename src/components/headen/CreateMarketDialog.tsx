import { Tab } from '@headlessui/react';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import { CreateMarket } from '@/components/headen/CreateMarket';

export const CreateMarketDialog = () => {
  return (
    <div className='w-full px-2 sm:px-0'>
      <Tab.Group>
        <Tab.List className='sticky -top-6 z-10 flex space-x-1 bg-neutral-800 p-1'>
          <Tab
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
            Create market
          </Tab>
        </Tab.List>
        <Tab.Panels className='mt-2 w-full'>
          <Tab.Panel>
            <CreateMarket />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
