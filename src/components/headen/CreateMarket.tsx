import { AddressZero } from "@ethersproject/constants";
import { BigNumber } from "ethers";
import * as React from "react";
import { FC, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  Address,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";

import clsxm from "@/lib/clsxm";
import { useGetValueOfToken } from "@/hooks/useFindBestPrice";
import { useHeadenFinanceAddress } from "@/hooks/useHeadenFinanceAddress";
import { usePercentDisplayBalance } from "@/hooks/usePercentDisplayBalance";
import { useUniswapTokenList } from "@/hooks/useUniswapTokenList";
import { useWaitForTransactionWithToast } from "@/hooks/useWaitForTransactionWithToast";

import Button from "@/components/buttons/Button";
import {
  AssetAmountInput,
  AssetBalance,
} from "@/components/headen/AssetDialogComponents";
import { Loading } from "@/components/Loading";
import { Select, SelectOption } from "@/components/selects/Select";
import Skeleton from "@/components/Skeleton";
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
  const isLoadingBalance = balance.isLoading;
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
  const { isLoading } = useWaitForTransactionWithToast({ data });

  const selectedOption = useMemo(
    () =>
      options.find(
        (value) =>
          value.value.address == tokenAddress &&
          value.value.chainId == (chain?.id ?? 1)
      ),
    [chain, options, tokenAddress]
  );

  return (
    <>
      <div className="p-2.5 sm:p-5 md:p-10">
        <NoWalletConnected />
        <WhenWallet status="connected">
          <div className="md:pt-10">
            <div className="relative">
              {!tokenAddress && <span> Select token address</span>}
              <Select
                options={options}
                className={clsxm(
                  "mb-8",
                  tokenAddress ? "" : "mt-20 mb-40 sm:mb-40 sm:mt-0 "
                )}
                selectedOption={selectedOption}
                onChanged={(it) => setTokenAddress(it.value.address)}
              />
              {tokenAddress &&
                (isLoadingBalance ? (
                  <Skeleton className="mx-auto h-[5rem] w-[9rem]" />
                ) : (
                  <AssetBalance
                    displayAmount={displayAmount}
                    symbol={balance.data?.symbol}
                    usdValue={valueCb(amount)?.toFixed(2) ?? ""}
                  />
                ))}
            </div>
          </div>

          {!tokenAddress ? (
            <></>
          ) : balance.data?.value?.eq(0) ? (
            <div className="min-h-[8rem] pb-4 text-sm font-bold">
              Ooops, it looks like that you do not have any{" "}
              {balance.data?.symbol}
            </div>
          ) : isLoadingBalance ? (
            <Skeleton className="mx-auto mb-8 h-[2rem] w-[80%]" />
          ) : (
            <AssetAmountInput
              percent={percent}
              onPercentChanged={(p) => setPercent(p)}
              maxText={balance.data?.formatted}
            />
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
