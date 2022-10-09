import { Tab } from '@headlessui/react';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

import { CreateMarket } from '@/components/headen/CreateMarket';

export const CreateMarketDialog = () => {
  return (
    <div className='w-full px-0'>
      <Tab.Group>
        <Tab.List className='sticky top-0 z-10 flex bg-[#F5F5F5]'>
          <Tab
            className={({ selected }) =>
              clsxm(
                'w-full  rounded-none py-3.5 text-sm font-medium leading-5 text-white',
                'ring-white ring-opacity-60 ring-offset-2 focus-visible:bg-primary-500',
                selected
                  ? ' bg-primary text-white'
                  : 'text-primary hover:bg-primary-600 hover:text-white'
              )
            }
          >
            Create market
          </Tab>
        </Tab.List>
        <Tab.Panels className='mt-2 w-full px-2 pb-2'>
          <Tab.Panel>
            <CreateMarket />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
