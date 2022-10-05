import { AppProps } from 'next/app';

import '@/styles/globals.css';

import { CustomToaster } from '@/components/toaster/CustomToaster';
import Web3Provider from '@/components/web3/Web3Provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
      <CustomToaster />
    </Web3Provider>
  );
}

export default MyApp;
