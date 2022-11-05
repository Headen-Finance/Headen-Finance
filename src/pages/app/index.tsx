import { BigNumber } from "ethers";
import * as React from "react";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";
import { useAccount, useBalance, useToken } from "wagmi";

import clsxm from "@/lib/clsxm";
import {
  MarketsResponseDisplay,
  useAllMarketData,
} from "@/hooks/useAllMarketData";

import { AssetDialog } from "@/components/AssetDialog";
import Button from "@/components/buttons/Button";
import { DialogFrame } from "@/components/dialog/DialogFrame";
import { CreateMarketDialog } from "@/components/headen/CreateMarketDialog";
import HomeInfo from "@/components/home/HomeInfo";
import Indicator from "@/components/home/Indicator";
import Input from "@/components/inputs/Input";
import Layout from "@/components/layout/Layout";
import { Loading } from "@/components/Loading";
import Seo from "@/components/Seo";
import Skeleton from "@/components/Skeleton";

import useAssetDialogStore from "@/store/useAssetDialogStore";

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

type PoolsRowData = {
  item: MarketsResponseDisplay;
};

function LoadingText({
  isLoading,
  children,
  className,
}: {
  isLoading: boolean;
  children: ReactNode;
  className?: string;
}) {
  if (isLoading) {
    return <Skeleton className={clsxm("h-5 w-20 rounded", className)} />;
  }
  return <>{children}</>;
}

function PoolsRow({ item }: PoolsRowData) {
  const acc = useAccount();
  const { data: balance, isLoading: isLoadingBalance } = useBalance({
    addressOrName: acc.address,
    staleTime: 10_000,
    token: item.tokenAddress,
  });
  const { data: tokenInfo, isLoading } = useToken({
    address: item.tokenAddress,
  });
  const openDialog = useAssetDialogStore.useOpenDialog();
  const getDisplayValue = useCallback(
    (value: BigNumber) => {
      if (tokenInfo?.decimals == undefined) return 0;
      if (tokenInfo.decimals < 6) return value.toNumber() / tokenInfo.decimals;
      const fixedDigits = 5;
      const diff = tokenInfo.decimals - fixedDigits;
      return (
        value.div(BigNumber.from(10).pow(diff)).toNumber() /
        10 ** fixedDigits
      ).toFixed(fixedDigits);
    },
    [tokenInfo]
  );
  return (
    <tr
      // key={index}
      className="cursor-pointer border-b bg-white text-black hover:bg-gray-200"
      onClick={() => openDialog(item.tokenAddress)}
    >
      <th scope="row" className="whitespace-nowrap py-4 px-6 font-medium">
        <LoadingText isLoading={isLoading}>
          <span>{tokenInfo?.symbol} token</span>
        </LoadingText>
      </th>
      <td className="py-4 px-6">
        <LoadingText isLoading={isLoading}>
          <span>{tokenInfo?.name} detail</span>
        </LoadingText>
      </td>
      <td className="py-4 px-6">
        <LoadingText isLoading={isLoading}>
          {getDisplayValue(item.liquidity)}
        </LoadingText>
      </td>
      <td className="py-4 px-6">{item.supplyRate}%</td>
      <td className="py-4 px-6">{item.borrowRate}%</td>
      <td className="py-4 px-6">
        <LoadingText isLoading={isLoading}>
          {getDisplayValue(item.amountStaked)}
        </LoadingText>
      </td>
      <td className="py-4 px-6">4.08%</td>
      <td className="py-4 px-6">
        <LoadingText isLoading={isLoadingBalance}>
          {balance?.formatted}
          {balance?.symbol}
        </LoadingText>
      </td>
    </tr>
  );
  //todo item.amountStaked should be how much the user has staked
}

type TableColumn = {
  className?: string;
  title: string;
};

function PoolsTable() {
  const { markets, loading } = useAllMarketData();
  const columns = useMemo<TableColumn[]>(
    () => [
      {
        title: "Asset",
        className: "w-1/4",
      },
      { title: "Detail" },
      { title: "Available liquidity" },
      { title: "Deposit rate" },
      { title: "Borrow rate" },
      { title: "Collateral" },
      { title: "APY" },
      { title: "Wallet" },
    ],
    []
  );
  if (loading) {
    return (
      <div className="w-full">
        <Loading className="mx-auto min-h-[40vh]" />
      </div>
    );
  }
  return (
    <table className="w-full text-left text-sm text-xs">
      <thead className="text-xs uppercase text-black">
        <tr className="bg-gray-300">
          {columns.map((value) => (
            <th
              key={value.title}
              scope="col"
              className={clsxm(" py-3 px-6", value.className)}
            >
              {value.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {markets.map((value: MarketsResponseDisplay) => (
          <PoolsRow key={value.tokenAddress} item={value} />
        ))}
      </tbody>
    </table>
  );
}

function DashboardInfoSection() {
  return (
    <section className="mt-14 grid w-full max-w-screen-xl grid-cols-2 grid-rows-2 items-center justify-around sm:grid-cols-3 sm:grid-rows-1">
      <div className=" order-1 col-span-2 sm:order-3 sm:col-span-1 ">
        <Indicator value={0.4} className="m-auto" />
      </div>
      <HomeInfo title="Total borrowed" value="$130k " className="order-1" />
      <HomeInfo title="Total supply" value="$300k" className="order-4" />
    </section>
  );
}

export default function HomePage() {
  const disableClose = useAssetDialogStore.useDisableClose();
  const tokenAddress = useAssetDialogStore.useTokenAddress();

  const closeModal = useAssetDialogStore.useHandleClose();
  const [showCreateMarketDialog, setShowCreateMarketDialog] = useState(false);
  // useAvgPriceForTokensTest()
  const dialog = useMemo(
    () => (
      <DialogFrame
        show={!!tokenAddress}
        onClose={
          disableClose
            ? () => {
                /*lint...*/
              }
            : closeModal
        }
        className="w-[100vw] p-0"
      >
        {tokenAddress && <AssetDialog tokenAddress={tokenAddress} />}
      </DialogFrame>
    ),
    [tokenAddress, disableClose, closeModal]
  );
  const createMarketDialog = useMemo(
    () => (
      <DialogFrame
        show={showCreateMarketDialog}
        onClose={() => setShowCreateMarketDialog(false)}
        className="w-[100vw] p-0"
      >
        <CreateMarketDialog />
      </DialogFrame>
    ),
    [showCreateMarketDialog]
  );

  const createPoolButton = (
    <Button
      variant="outline"
      leftIcon={<IoIosAdd size={24} />}
      className="h-8 rounded-full border-black text-xs font-light text-black"
      onClick={() => setShowCreateMarketDialog(true)}
    >
      Create pool
    </Button>
  );

  const searchInput = (
    <Input
      leftIcon={<AiOutlineSearch color="black" />}
      placeholder="Search Market"
      variant="outline"
      className="rounded-full border-black py-[7px] text-black"
    />
  );

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      {dialog}
      {createMarketDialog}

      <main className="flex justify-center  text-white">
        <DashboardInfoSection />
      </main>
      <div className="mt-[150px] flex justify-center bg-gray-100 pb-24">
        <div className="mx-2 -mt-[100px] w-full  max-w-screen-xl flex-1 shrink rounded-lg bg-white p-2 text-black sm:p-10">
          <div className="mb-3 flex flex-col items-center justify-between border-b sm:flex-row">
            <span className="p-2 font-semibold"> ALL POOLS</span>
            <div className="flex gap-2">
              {createPoolButton}
              {searchInput}
            </div>
          </div>
          <div className="relative w-full overflow-x-auto">
            <PoolsTable />
          </div>
        </div>
      </div>
    </Layout>
  );
}
