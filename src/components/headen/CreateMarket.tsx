import { AddressZero } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import * as React from "react";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";
import {
  Address,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

import clsxm from "@/lib/clsxm";
import { useGetValueOfToken } from "@/hooks/useFindBestPrice";
import { useHeadenFinanceAddress } from "@/hooks/useHeadenFinanceAddress";
import { usePercentDisplayBalance } from "@/hooks/usePercentDisplayBalance";
import { useUniswapTokenList } from "@/hooks/useUniswapTokenList";

import Button from "@/components/buttons/Button";
import { WaitingForTx } from "@/components/headen/AssetDialogComponents";
import { Loading } from "@/components/Loading";
import { Select, SelectOption } from "@/components/selects/Select";
import { ConnectApproveAction } from "@/components/web3/ConnectWallet";
import { NoWalletConnected } from "@/components/web3/NoWalletConnected";
import { WhenWallet } from "@/components/web3/WhenAccount";

import { TokenResponse } from "@/store/useUniswapTokensStore";

import { headenFinanceAbi } from "@/constant/env";

export const CreateMarket: FC = () => {
  const [tokenAddress, setTokenAddress] = useState<Address | null>(null);
  const availableTokens = useUniswapTokenList();
  const valueCb = useGetValueOfToken({ token: tokenAddress ?? undefined });

  const options = useMemo(
    () =>
      availableTokens.map(
        (value) =>
          ({
            label: value.name,
            value: value,
            id: value.address,
          } as SelectOption<TokenResponse>)
      ),
    [availableTokens]
  );
  const { chain } = useNetwork();
  const { balance, amount, displayAmount, percent, setPercent } =
    usePercentDisplayBalance(tokenAddress);
  const [debouncedAmount] = useDebounce(amount, 500);

  const {
    config,
    isError: isErrorGasCost,
    isLoading: isLoadingGasCost,
  } = usePrepareContractWrite({
    address: useHeadenFinanceAddress(),
    abi: headenFinanceAbi,
    functionName: "createMarketPool",
    args: [tokenAddress ?? AddressZero, debouncedAmount ?? BigNumber.from(0)],
    enabled: Boolean(tokenAddress && debouncedAmount),
  });
  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: data?.hash,
  });
  const dialogId = useRef<string>();
  useEffect(() => {
    if (isLoading && !dialogId.current) {
      dialogId.current = toast.loading(<WaitingForTx tx={data} />);
    } else {
      if (isSuccess) {
        toast.success("Successfully created the pool and staked", {
          id: dialogId.current,
        });
      } else if (isError) {
        toast.error("Ooops, something went wrong", { id: dialogId.current });
      }
    }
  }, [isLoading, isSuccess, isError, data]);

  return (
    <>
      <div className="p-2.5 sm:p-5 md:p-10">
        <NoWalletConnected />
        <WhenWallet status="connected">
          <div className="md:py-10">
            <div className="relative">
              {!tokenAddress && <span> Select token address</span>}
              <Select
                options={options}
                className={clsxm("mb-8", tokenAddress ? "" : "mb-40 sm:mb-24 ")}
                selectedOption={options.find(
                  (value) =>
                    value.value.address == tokenAddress &&
                    value.value.chainId == (chain?.id ?? 1)
                )}
                onChanged={(it) => setTokenAddress(it.value.address)}
              />

              {tokenAddress && (
                <span className="text-2xl sm:text-5xl ">
                  {displayAmount}
                  {balance.data?.symbol}
                </span>
              )}
            </div>
            {/*<h6>=$0</h6>*/}
          </div>

          {!tokenAddress ? (
            <></>
          ) : balance.data?.value?.eq(0) ? (
            <div className="min-h-[8rem] pb-4 text-sm font-bold">
              Ooops, it looks like that you do not have any{" "}
              {balance.data?.symbol}
            </div>
          ) : (
            <div className="relative py-5 sm:py-10 ">
              <input
                type="range"
                className="range-input h-1.5 w-full cursor-pointer appearance-none  rounded-lg bg-gray-200 accent-amber-900 dark:bg-gray-100"
                min={1}
                max={100}
                step={1}
                value={percent}
                onChange={(event) => setPercent(parseInt(event.target.value))}
                id="customRange1"
              />
              <div className="flex justify-between">
                <span> 0</span>
                <span> {balance.data?.formatted}</span>
              </div>
              <div>value: {valueCb(amount)}</div>
            </div>
          )}
        </WhenWallet>

        <ConnectApproveAction
          tokenAddress={tokenAddress}
          className="w-full justify-center py-5"
        >
          {tokenAddress ? (
            <Button
              onClick={() => (write ? write() : null)}
              type="button"
              isLoading={isLoading}
              disabled={!write || isLoadingGasCost || isErrorGasCost}
              className={clsxm(
                "w-full justify-center py-5",
                "w-full justify-center py-5"
              )}
              variant="light"
            >
              {isLoadingGasCost ? (
                <Loading />
              ) : isErrorGasCost ? (
                "Could not estimate gas price"
              ) : (
                "Create market and stake"
              )}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={true}
              className={clsxm(
                "w-full justify-center py-5",
                "w-full justify-center py-5"
              )}
              variant="light"
            >
              Select token first
            </Button>
          )}
        </ConnectApproveAction>
      </div>
    </>
  );
};
