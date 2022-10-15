import { WhenWallet } from '@/components/web3/WhenAccount';

import NoWalletImage from '~/images/app/no_wallet.svg';

export const NoWalletConnected = () => {
  return (
    <WhenWallet isNot status='connected'>
      <div className='flex flex-col items-center text-xs '>
        <NoWalletImage style={{ height: 172, width: 189, margin: 20 }} />
        <div className='mt-5'>
          To borrow/stake you would have to connect your wallet
        </div>
        <div className='mb-5'>Click the button below to get started</div>
      </div>
    </WhenWallet>
  );
};
