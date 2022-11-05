/* eslint-disable */
import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { ConnectKitButton } from 'connectkit';
import * as React from "react";
import { FC, ReactNode, useCallback } from "react";
import { Address, useAccount } from "wagmi";

import clsxm from "@/lib/clsxm";

import Button, { ButtonProps } from "@/components/buttons/Button";
import {
  ApprovalState,
  useERC20ApproveCallback,
} from "@/hooks/useERC20ApproveCallback";
import { MaxUint256 } from "@ethersproject/constants";
import { Loading } from "@/components/Loading";

type Visibility = "always" | "connected" | "not_connected";

export const ConnectWallet: FC<{ show?: Visibility }> = ({
  show = "always",
}) => {
  const { isConnected } = useAccount();

  if (
    (show == "connected" && !isConnected) ||
    (show == "not_connected" && isConnected)
  )
    return null;

  return <ConnectButton showBalance={false} />;
};
//
// //https://docs.family.co/connectkit/connect-button#connect-button
// export const CustomConnectWallet: FC<
//   { children?: ReactNode; onClick?: () => void } & ButtonProps
// > = ({ children, onClick, className, ...rest }) => {
//   return (
//     <ConnectKitButton.Custom>
//       {({ isConnected, isConnecting, show, hide, address, ensName }) => {
//         return (
//           <Button
//             isLoading={isConnecting}
//             onClick={isConnected ? onClick : show}
//             variant='light'
//             {...rest}
//             className={clsxm('w-full justify-center py-3.5 sm:py-5', className)}
//           >
//             {isConnected ? children : 'Connect Wallet'}
//           </Button>
//         );
//       }}
//     </ConnectKitButton.Custom>
//   );
// };

export const ConnectApproveAction: FC<
  {
    tokenAddress: Address | null;
    children: ReactNode;
  } & ButtonProps
> = ({ children, onClick, className, tokenAddress, ...rest }) => {
  return (
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
        const ready = mounted;
        const connected = ready && account && chain && !authenticationStatus;

        const ApproveOrActionButton = useCallback(
          ({ children }: { children: ReactNode }) => {
            const [approvalState, approve] = useERC20ApproveCallback(
              true,
              tokenAddress!,
              MaxUint256
            );
            if (approvalState == ApprovalState.NOT_APPROVED) {
              return (
                <Button
                  onClick={approve}
                  className={clsxm(
                    "w-full justify-center py-3.5 sm:py-5",
                    className
                  )}
                  variant="primary"
                >
                  Approve token
                </Button>
              );
            }
            if (approvalState == ApprovalState.PENDING) {
              return (
                <div className={"w-full justify-center py-3.5 sm:py-5"}>
                  <Loading />
                </div>
              );
            }
            return <>{children}</>;
          },
          [tokenAddress]
        );

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className={clsxm(
                      "w-full justify-center py-3.5 sm:py-5",
                      className
                    )}
                    variant="light"
                  >
                    Connect Wallet
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    className={clsxm(
                      "w-full justify-center py-3.5 sm:py-5",
                      className
                    )}
                    variant="light"
                  >
                    Wrong network
                  </Button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  {/*<Button*/}
                  {/*  onClick={openChainModal}*/}
                  {/*  style={{ display: 'flex', alignItems: 'center' }}*/}
                  {/*  type='button'*/}
                  {/*>*/}
                  {/*  {chain.hasIcon && (*/}
                  {/*    <div*/}
                  {/*      style={{*/}
                  {/*        background: chain.iconBackground,*/}
                  {/*        width: 12,*/}
                  {/*        height: 12,*/}
                  {/*        borderRadius: 999,*/}
                  {/*        overflow: 'hidden',*/}
                  {/*        marginRight: 4,*/}
                  {/*      }}*/}
                  {/*    >*/}
                  {/*      {chain.iconUrl && (*/}
                  {/*        <img*/}
                  {/*          alt={chain.name ?? 'Chain icon'}*/}
                  {/*          src={chain.iconUrl}*/}
                  {/*          style={{ width: 12, height: 12 }}*/}
                  {/*        />*/}
                  {/*      )}*/}
                  {/*    </div>*/}
                  {/*  )}*/}
                  {/*  {chain.name}*/}
                  {/*</Button>*/}

                  {tokenAddress ? (
                    <ApproveOrActionButton children={children} />
                  ) : (
                    children
                  )}
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
