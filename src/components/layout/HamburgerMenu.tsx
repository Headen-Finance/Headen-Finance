import { Popover, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { Fragment, ReactNode } from 'react';
import * as React from 'react';
import { MdClose, MdMenu } from 'react-icons/md';

import UnstyledLink from '@/components/links/UnstyledLink';

export type MenuItem = {
  href: string;
  title: string;
};
export type HamburgerMenuProps = {
  menuItems: MenuItem[];
  children?: ReactNode;
};

export default function HamburgerMenu({ menuItems }: HamburgerMenuProps) {
  const { pathname } = useRouter();
  return (
    <Popover className='relative block md:hidden'>
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                group mr-1 inline-flex items-center rounded-md  text-base text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            {open ? (
              <MdClose className='m-2 inline-block flex-shrink-0 cursor-pointer text-lg'></MdClose>
            ) : (
              <MdMenu className='m-2 inline-block flex-shrink-0 cursor-pointer text-lg'></MdMenu>
            )}
          </Popover.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <Popover.Panel className='fixed top-16 left-0 right-0 z-10 mt-3 max-w-xl transform px-5 sm:px-10'>
              <div>
                <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                  <nav className='bg-gray-50 p-4'>
                    {menuItems.map((value) => (
                      <Popover.Button
                        key={value.title}
                        href={value.href}
                        className={`block rounded-md p-4 text-sm font-semibold text-primary hover:bg-primary hover:text-secondary/50 ${
                          pathname == value.href ? 'text-secondary' : undefined
                        }`}
                        as={UnstyledLink}
                      >
                        {value.title}
                      </Popover.Button>
                    ))}
                  </nav>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
