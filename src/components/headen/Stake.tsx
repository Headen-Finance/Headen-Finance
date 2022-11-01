import { BigNumber } from "ethers";
import { FC, useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { MdInfoOutline } from "react-icons/md";
import { Address, RpcError } from "wagmi";

import { useGetValueOfToken } from "@/hooks/useFindBestPrice";
import { useHeadenFinanceWrite } from "@/hooks/useHeadenFinanceContract";
import { usePercentDisplayBalance } from "@/hooks/usePercentDisplayBalance";

import { AssetDialogActionButton } from "@/components/headen/AssetDialogActionButton";
import {
  AssetAmountInput,
  AssetBalance,
  AssetFrame,
  AssetParameters,
  MoreParametersDisclosure,
  WaitingForTx,
} from "@/components/headen/AssetDialogComponents";
import Skeleton from "@/components/Skeleton";
import { ConnectApproveAction } from "@/components/web3/ConnectWallet";
import { WhenWallet } from "@/components/web3/WhenAccount";

type ActionProp = {
  tokenAddress: Address;
};

export const Stake: FC<ActionProp> = ({ tokenAddress }) => {
  const { balance, amount, displayAmount, percent, setPercent, decimals } =
    usePercentDisplayBalance(tokenAddress);

  const valueCb = useGetValueOfToken({ token: tokenAddress });
  const hf = useHeadenFinanceWrite();
  const [loading, setLoading] = useState(false);
  const price = valueCb(BigNumber.from(10).pow(decimals));

  const parameters = useMemo(
    () => [
      {
        title: "Price",
        value: price ? (
          `$${price}`
        ) : (
          <Skeleton className="h-5 w-14 rounded"></Skeleton>
        ),
      },
      { title: "Utilization", value: "$0.00" },
      { title: "Supply APR", value: "$0.00" },
    ],
    [price]
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
    <AssetFrame tokenAddress={tokenAddress}>
      <WhenWallet status="connected">
        <AssetBalance
          displayAmount={displayAmount}
          symbol={balance.data?.symbol}
          setMax={() => setPercent(100)}
        />
        {balance.data?.value?.eq(0) ? (
          <div className="pb-4 text-sm font-bold">
            Ooops, it looks like that you do not have any {balance.data?.symbol}
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
    </AssetFrame>
  );
};
