import { useAccount } from 'wagmi';

type WhenWalletProp = {
  status: 'connected' | 'connecting' | 'reconnecting' | 'disconnected';
  isNot?: boolean;
  children: React.ReactNode;
};

export const WhenWallet = ({
  status,
  isNot = false,
  children,
}: WhenWalletProp) => {
  const acc = useAccount();
  const show = isNot ? acc.status !== status : acc.status === status;

  return <> {show && children}</>;
};
