import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import clsxm from '@/lib/clsxm';

import HamburgerMenu from '@/components/layout/HamburgerMenu';
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
  const { pathname } = useRouter();
  return (
    <header
      className={clsxm(
        'fixed left-0 right-0 top-0 z-50 text-white',
        !top && 'bg-black/50  backdrop-blur'
      )}
    >
      <div className='mx-auto grid h-20 max-w-screen-2xl grid-cols-2 items-center justify-between px-5 transition-[background] sm:px-10 md:grid-cols-[200px_1fr_200px]'>
        <div className='flex items-center'>
          <HamburgerMenu menuItems={menuItems} />
          <UnstyledLink
            href='/'
            className='text-md font-semibold  hover:text-secondary/50 sm:text-xl'
          >
            <span>Headen</span>.<span>Finance</span>
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
