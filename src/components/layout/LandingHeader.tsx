import { Popover, Transition } from '@headlessui/react';
import * as React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { MdClose, MdMenu } from 'react-icons/md';

import clsxm from '@/lib/clsxm';

import UnstyledLink from '@/components/links/UnstyledLink';

const menuItems = [
  {
    href: '#',
    title: 'Markets',
  },
  {
    href: '#',
    title: 'Governance',
  },
  {
    href: '#',
    title: 'Docs',
  },
  {
    href: '#',
    title: 'Security',
  },
];

export default function LandingHeader() {
  const [top, setTop] = useState(true);
  useEffect(() => {
    const handleScroll = (_: Event) => {
      if (top != window.scrollY < 10) {
        setTop(window.scrollY < 10);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [top]);
  return (
    <header
      className={clsxm(
        'fixed left-0 right-0 top-0 z-50 text-white',
        !top && 'bg-black/50  backdrop-blur'
      )}
    >
      <div className='mx-auto grid h-20 max-w-screen-2xl grid-cols-2 items-center justify-between px-5 transition-[background] sm:px-10 md:grid-cols-[200px_1fr_200px]'>
        <div className='flex items-center'>
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
                  <Popover.Panel className='fixed left-0 right-0 z-10 mt-3 max-w-xl transform px-5 sm:px-10'>
                    <div>
                      <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                        <nav className='bg-gray-50 p-4'>
                          {menuItems.map((value) => (
                            <Popover.Button
                              key={value.title}
                              href={value.href}
                              className='block rounded-md p-4 text-sm font-semibold text-primary hover:bg-primary hover:text-secondary'
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
          <UnstyledLink
            href='/'
            className='text-lg font-semibold  hover:text-secondary sm:text-xl'
          >
            Headen.Finance
          </UnstyledLink>
        </div>
        <nav className='hidden justify-center gap-8 md:flex lg:gap-12 '>
          {menuItems.map((value) => (
            <UnstyledLink
              key={value.title}
              href={value.href}
              className='text-sm font-semibold hover:text-secondary'
            >
              {value.title}
            </UnstyledLink>
          ))}
        </nav>
        <div className='flex justify-end'>
          <UnstyledLink
            href='/app'
            className='rounded-[20px] border border-white py-2 px-4 font-semibold text-white hover:border-secondary hover:bg-transparent'
          >
            Launch App
          </UnstyledLink>
        </div>

        {/*<nav>*/}
        {/*  <ul className='flex items-center justify-between space-x-4'>*/}
        {/*    {links.map(({ href, label }) => (*/}
        {/*      <li key={`${href}${label}`}>*/}
        {/*        <UnstyledLink href={href} className='hover:text-gray-600'>*/}
        {/*          {label}*/}
        {/*        </UnstyledLink>*/}
        {/*      </li>*/}
        {/*    ))}*/}
        {/*  </ul>*/}
        {/*</nav>*/}
      </div>
    </header>
  );
}
