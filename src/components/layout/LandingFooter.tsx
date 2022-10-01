export const LandingFooter = () => {
  return (
    <footer className='flex flex-col justify-center bg-[#1B1D23]'>
      <div className='grid w-full max-w-screen-2xl grid-cols-2 gap-4  p-40 text-white md:grid-cols-5 '>
        <div>
          <p className='text-xl font-bold'>
            Headen.
            <br />
            Finance
          </p>
        </div>
        <div>
          <h5 className='font-bold'>Markets</h5>
        </div>
        <div>
          <h5 className='font-bold'>Docs</h5>
        </div>
        <div>
          <h5 className='font-bold'>FAQ</h5>
        </div>
        <div>
          <h5 className='font-bold'>Security</h5>
        </div>
      </div>
      <div className=' mx-10 mb-20 border-b border-[#E2E2E233]'></div>
    </footer>
  );
};
