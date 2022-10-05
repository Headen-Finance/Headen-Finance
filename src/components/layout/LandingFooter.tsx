import UnstyledLink from '@/components/links/UnstyledLink';

export const LandingFooter = () => {
  return (
    <footer className='flex flex-col justify-center bg-[#1B1D23]'>
      <div className='lg:p-30 grid w-full max-w-screen-2xl grid-cols-1 gap-4 p-16 text-white sm:grid-cols-2 md:grid-cols-3 md:p-20 lg:grid-cols-5 xl:p-40 '>
        <div>
          <p className='mx-auto text-center text-xl font-bold'>
            Headen.
            <br />
            Finance
          </p>
        </div>
        <div className='flex flex-col gap-6 py-4'>
          <h5 className='text-center font-bold'>Markets</h5>
          {Array.of(...Array(5)).map((value) => (
            <UnstyledLink
              key={value}
              href='#'
              className='mx-auto block text-sm font-semibold text-gray-500 hover:text-secondary'
            >
              eTokens
            </UnstyledLink>
          ))}
        </div>
        <div className='flex flex-col gap-6 py-4'>
          <h5 className='text-center font-bold'>Docs</h5>
          {Array.of(...Array(5)).map((value) => (
            <UnstyledLink
              key={value}
              href='#'
              className='mx-auto block text-sm font-semibold text-gray-500 hover:text-secondary'
            >
              eTokens
            </UnstyledLink>
          ))}
        </div>
        <div className='flex flex-col gap-6 py-4'>
          <h5 className='text-center font-bold'>FAQ</h5>
          {Array.of(...Array(5)).map((value) => (
            <UnstyledLink
              key={value}
              href='#'
              className='mx-auto block text-sm font-semibold text-gray-500 hover:text-secondary'
            >
              eTokens
            </UnstyledLink>
          ))}
        </div>
        <div className='flex flex-col gap-6 py-4'>
          <h5 className='text-center font-bold'>Security</h5>
          {Array.of(...Array(5)).map((value) => (
            <UnstyledLink
              key={value}
              href='#'
              className='mx-auto block text-sm font-semibold text-gray-500 hover:text-secondary'
            >
              eTokens
            </UnstyledLink>
          ))}
        </div>
      </div>
      <div className=' mx-10 mb-20 border-b border-[#E2E2E233]'></div>
    </footer>
  );
};
