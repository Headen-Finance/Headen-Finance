import { FC, useCallback, useMemo, useState } from "react";
import * as React from "react";
import toast from "react-hot-toast";
import { MdInfoOutline } from "react-icons/md";
import { Address, RpcError } from "wagmi";

import { useHeadenFinanceWrite } from "@/hooks/useHeadenFinanceContract";
import { usePercentDisplayBalance } from "@/hooks/usePercentDisplayBalance";

import { AssetDialogActionButton } from "@/components/headen/AssetDialogActionButton";
import {
  AssetAmountInput,
  AssetBalance,
  AssetParameters,
  MoreParametersDisclosure,
  WaitingForTx,
} from "@/components/headen/AssetDialogComponents";
import { Loading } from "@/components/Loading";
import { ConnectApproveAction } from "@/components/web3/ConnectWallet";
import { NoWalletConnected } from "@/components/web3/NoWalletConnected";
import { WhenWallet } from "@/components/web3/WhenAccount";

type ActionProp = {
  tokenAddress: Address;
};

export const Stake: FC<ActionProp> = ({ tokenAddress }) => {
  const { balance, amount, displayAmount, percent, setPercent } =
    usePercentDisplayBalance(tokenAddress);

  const hf = useHeadenFinanceWrite();
  const [loading, setLoading] = useState(false);
  const parameters = useMemo(
    () => [
      { title: "User Borrow Limit", value: "$0.00" },
      { title: "Utilization", value: "$0.00" },
      { title: "Supply APR", value: "$0.00" },
    ],
    []
  );
  const moreParameters = useMemo(
    () => [
      { title: "User Borrow Limit", value: "$0.00" },
      { title: "User Borrow Limit", value: "$0.00" },
      { title: "User Borrow Limit", value: "$0.00" },
    ],
    []
  );

  const stake = useCallback(async () => {
    if (amount == undefined) {
      // eslint-disable-next-line no-console
      console.error("amount was undefined");
      return;
    }
    try {
      setLoading(true);
      const tx = await hf?.stakeToken(tokenAddress, amount);
      await toast.promise(tx.wait(), {
        success: "Successfully staked",
        error: "Ooops, something went wrong",
        loading: <WaitingForTx tx={tx} />,
      });
      setLoading(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      toast.error(`${(e as RpcError<RpcError>).data?.message}`);
      setLoading(false);
    }
  }, [amount, hf, tokenAddress]);

  return (
    <>
      <div className="p-0 px-2.5 pb-2.5 sm:p-5 md:p-10">
        <div className="flex justify-center text-[0.6em]">
          <span>{tokenAddress}</span>
        </div>
        <NoWalletConnected />
        <WhenWallet status="connecting">
          <div className="flex items-center justify-center p-5">
            <Loading></Loading>
          </div>
        </WhenWallet>
        <WhenWallet status="connected">
          <AssetBalance
            displayAmount={displayAmount}
            symbol={balance.data?.symbol}
            setMax={() => setPercent(100)}
          />
          {balance.data?.value?.eq(0) ? (
            <div className="pb-4 text-sm font-bold">
              Ooops, it looks like that you do not have any{" "}
              {balance.data?.symbol}
            </div>
          ) : (
            <AssetAmountInput
              percent={percent}
              onPercentChanged={(p) => setPercent(p)}
              maxText={balance.data?.formatted}
            />
          )}
          <AssetParameters items={parameters} />
          <MoreParametersDisclosure items={moreParameters} />
        </WhenWallet>
        <ConnectApproveAction
          tokenAddress={tokenAddress}
          className="w-full justify-center"
        >
          <AssetDialogActionButton onClick={stake} loading={loading}>
            Add supply
          </AssetDialogActionButton>
        </ConnectApproveAction>
        <WhenWallet status="disconnected">
          <div className="pt-5 text-[0.625rem]">
            <MdInfoOutline className="mr-1 -mt-0.5 inline-block" />
            You are yet to connect your wallet
          </div>
        </WhenWallet>
      </div>
    </>
  );
};
