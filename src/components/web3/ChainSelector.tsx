/* eslint-disable */
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';

import Button from '@/components/buttons/Button';

export type ChainSelectorProps = {
  className?: string;
};

function ChainSelector({ className }: ChainSelectorProps) {
  const { chains, switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  return (
    <>
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return <></>;
                }

                if (chain.unsupported) {
                  return (
                    <button onClick={openChainModal} type='button'>
                      Wrong network
                    </button>
                  );
                }

                return (
                  <Button
                    variant='light'
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 24,
                          height: 24,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 24, height: 24 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </Button>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
      {/*{chain && (*/}
      {/*  <Menu as='div' className='relative '>*/}
      {/*    <Menu.Button>*/}
      {/*      <Button variant='primary' className='rounded-xl'>*/}
      {/*        {chain.name}*/}
      {/*      </Button>*/}
      {/*    </Menu.Button>*/}
      {/*    <Transition*/}
      {/*      enter='transition duration-100 ease-out'*/}
      {/*      enterFrom='transform scale-95 opacity-0'*/}
      {/*      enterTo='transform scale-100 opacity-100'*/}
      {/*      leave='transition duration-75 ease-out'*/}
      {/*      leaveFrom='transform scale-100 opacity-100'*/}
      {/*      leaveTo='transform scale-95 opacity-0'*/}
      {/*    >*/}
      {/*      <Menu.Items className='absolute top-[100%] right-0 mt-2 flex w-56 flex-col divide-y  divide-gray-100 overflow-hidden rounded-md bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>*/}
      {/*        {chains.map((chain) => (*/}
      {/*          <Menu.Item key={chain.id}>*/}
      {/*            {({ active }) => (*/}
      {/*              <Button*/}
      {/*                variant='ghost'*/}
      {/*                onClick={() =>*/}
      {/*                  switchNetwork ? switchNetwork(chain.id) : null*/}
      {/*                }*/}
      {/*                className='rounded-none text-white ui-active:bg-gray-700'*/}
      {/*              >*/}
      {/*                {chain.name}*/}
      {/*              </Button>*/}
      {/*            )}*/}
      {/*          </Menu.Item>*/}
      {/*        ))}*/}
      {/*      </Menu.Items>*/}
      {/*    </Transition>*/}
      {/*  </Menu>*/}
      {/*)}*/}
    </>
  );
}

export default ChainSelector;
