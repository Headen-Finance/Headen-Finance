import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-black text-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <div className='grow basis-0'>
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
          <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
            User Account
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
