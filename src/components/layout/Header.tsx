import * as React from 'react';

import HamburgerMenu from '@/components/layout/HamburgerMenu';
import UnstyledLink from '@/components/links/UnstyledLink';
import { ConnectWallet } from '@/components/web3/ConnectWallet';
const menuItems = [
  {
    href: '#',
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
  return (
    <header className='sticky top-0 z-50 bg-[#0E1118] text-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <div className='flex grow basis-0 flex-nowrap items-center'>
          <HamburgerMenu menuItems={menuItems} />
          <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
            Headen Finance
          </UnstyledLink>
        </div>
        <div>
          <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
            Dashboard
          </UnstyledLink>
        </div>
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
