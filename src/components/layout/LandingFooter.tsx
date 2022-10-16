import * as React from 'react';
import { FaGithub, FaTwitter } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

import clsxm from '@/lib/clsxm';

import UnstyledLink, {
  UnstyledLinkProps,
} from '@/components/links/UnstyledLink';

export const LandingFooter = () => {
  return (
    <footer className='flex flex-col justify-center bg-[#1B1D23]'>
      <div className='lg:p-30 grid w-full max-w-screen-2xl grid-cols-1 gap-4 p-16 text-white sm:grid-cols-2 md:grid-cols-3 md:p-20 lg:grid-cols-5 xl:p-40 '>
        <FooterSection>
          <p className='mx-auto text-center text-xl font-bold'>
            Headen.
            <br />
            Finance
          </p>
          <div className='flex flex-col flex-wrap gap-2'>
            <UnstyledLink
              href='mailto:headenfinance@gmail.com'
              className='flex flex-wrap items-center text-xs text-white hover:text-secondary'
            >
              <MdEmail size={30} className='mr-2' /> headenfinance@gmail.com
            </UnstyledLink>
            <UnstyledLink
              href='https://twitter.com/HeadenFinance'
              className='flex flex-wrap items-center text-xs text-white hover:text-secondary'
            >
              <FaTwitter size={30} className='mr-2' />
              @HeadenFinance
            </UnstyledLink>
            <UnstyledLink
              href='https://github.com/Headen-Finance/Headen-Finance'
              className='flex flex-wrap items-center text-xs text-white hover:text-secondary'
            >
              <FaGithub size={30} className='mr-2' />
              HeadenFinance
            </UnstyledLink>
          </div>
        </FooterSection>
        <FooterSection title='Markets'>
          {Array.of(...Array(5)).map((value, index) => (
            <LandingLink key={index} href='#'>
              eTokens
            </LandingLink>
          ))}
        </FooterSection>
        <FooterSection title='Docs'>
          {Array.of(...Array(5)).map((value, index) => (
            <LandingLink key={index} href='#'>
              eTokens
            </LandingLink>
          ))}
        </FooterSection>
        <FooterSection title='FAQ'>
          {Array.of(...Array(5)).map((value, index) => (
            <LandingLink key={index} href='#'>
              eTokens
            </LandingLink>
          ))}
        </FooterSection>
        <FooterSection title='Security'>
          {Array.of(...Array(5)).map((value, index) => (
            <LandingLink key={index} href='#'>
              eTokens
            </LandingLink>
          ))}
        </FooterSection>
      </div>

      <div className=' mx-10 mb-20 border-b border-[#E2E2E233]'></div>
    </footer>
  );
};

type FooterSectionProps = {
  title?: string;
} & React.ComponentPropsWithoutRef<'div'>;

function FooterSection({
  title,
  children,
  className,
  ...rest
}: FooterSectionProps) {
  return (
    <div className={clsxm('flex flex-col gap-6 py-4', className)} {...rest}>
      {title && <h5 className='text-center font-bold'>{title}</h5>}
      {children}
    </div>
  );
}

function LandingLink({ children, className, ...rest }: UnstyledLinkProps) {
  return (
    <UnstyledLink
      className={clsxm(
        'mx-auto block text-sm font-semibold text-gray-500 hover:text-secondary/50',
        className
      )}
      {...rest}
    >
      {children}
    </UnstyledLink>
  );
}
