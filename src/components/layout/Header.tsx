import { useRouter } from 'next/router';
import * as React from 'react';

import HamburgerMenu from '@/components/layout/HamburgerMenu';
import UnstyledLink from '@/components/links/UnstyledLink';
import { ConnectWallet } from '@/components/web3/ConnectWallet';
const menuItems = [
  {
    href: '/app',
    title: 'Dashboard',
  },
  {
    href: '/app/stake',
    title: 'Stake',
  },
  {
    href: '#',
    title: 'Borrow',
  },
  {
    href: '#',
    title: 'Withdraw',
  },
  {
    href: '#',
    title: 'Repay',
  },
];

export default function Header() {
  const { pathname } = useRouter();
  return (
    <header className='sticky top-0 z-50 bg-[#0E1118] text-white'>
      <div className='mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-5 sm:px-10'>
        <div className='flex grow basis-0 flex-nowrap items-center'>
          <HamburgerMenu menuItems={menuItems} />
          <UnstyledLink
            href='/'
            className='text-md break-words font-semibold hover:text-secondary/50 sm:text-xl'
          >
            <span className='inline-block'>Headen.</span>
            <span className='inline-block'>Finance</span>
          </UnstyledLink>
        </div>
        <nav className='hidden justify-center gap-8 md:flex lg:gap-12 '>
          {menuItems.map((value) => (
            <UnstyledLink
              key={value.title}
              href={value.href}
              className={`text-sm font-semibold hover:text-secondary/50 ${
                pathname == value.href ? 'text-secondary' : undefined
              }`}
            >
              {value.title}
            </UnstyledLink>
          ))}
        </nav>
        <div className='flex grow basis-0 justify-end'>
          {/*<UnstyledLink href='/' className='font-bold hover:text-gray-600'>*/}
          {/*  User Account*/}
          {/*</UnstyledLink>*/}
          {/*<ChainSelector />*/}
          <ConnectWallet />
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
