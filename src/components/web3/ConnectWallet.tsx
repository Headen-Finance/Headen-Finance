import { ConnectKitButton } from 'connectkit';
import { FC, ReactNode } from 'react';
import * as React from 'react';
import { useAccount } from 'wagmi';

import clsxm from '@/lib/clsxm';

import Button, { ButtonProps } from '@/components/buttons/Button';

type Visibility = 'always' | 'connected' | 'not_connected';

export const ConnectWallet: FC<{ show?: Visibility }> = ({
  show = 'always',
}) => {
  const { isConnected } = useAccount();

  if (
    (show == 'connected' && !isConnected) ||
    (show == 'not_connected' && isConnected)
  )
    return null;

  return <ConnectKitButton />;
};

//https://docs.family.co/connectkit/connect-button#connect-button
export const CustomConnectWallet: FC<
  { children?: ReactNode; onClick?: () => void } & ButtonProps
> = ({ children, onClick, className, ...rest }) => {
  return (
    <ConnectKitButton.Custom>
      {/* eslint-disable-next-line unused-imports/no-unused-vars */}
      {({ isConnected, isConnecting, show, hide, address, ensName }) => {
        return (
          <Button
            isLoading={isConnecting}
            onClick={isConnected ? onClick : show}
            variant='light'
            {...rest}
            className={clsxm('w-full justify-center py-5', className)}
          >
            {isConnected ? children : 'Connect Wallet'}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
};
