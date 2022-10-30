import * as React from "react";
import { useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosAdd } from "react-icons/io";
import { useAccount, useBalance, useContract, useToken } from "wagmi";

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

function PoolsRow({ item }: PoolsRowData) {
  const acc = useAccount();
  const { data: balance } = useBalance({
    addressOrName: acc.address,
    cacheTime: 2_000,
    token: item.tokenAddress,
  });
  const { data: tokenInfo } = useToken({
    address: item.tokenAddress,
  });
  const openDialog = useAssetDialogStore.useOpenDialog();
  return (
    <tr
      // key={index}
      className="cursor-pointer border-b bg-white text-black hover:bg-gray-200"
      onClick={() => openDialog(item.tokenAddress)}
    >
      <th scope="row" className="whitespace-nowrap py-4 px-6 font-medium">
        <span>{tokenInfo?.symbol} token</span>
      </th>
      <td className="py-4 px-6">{tokenInfo?.name} detail</td>
      <td className="py-4 px-6">{item.liquidity}</td>
      <td className="py-4 px-6">{item.supplyRate}%</td>
      <td className="py-4 px-6">{item.borrowRate}%</td>
      <td className="py-4 px-6">{item.amountStaked}</td>
      <td className="py-4 px-6">4.08%</td>
      <td className="py-4 px-6">
        {balance?.formatted}
        {balance?.symbol}
      </td>
    </tr>
  );
  //todo item.amountStaked should be how much the user has staked
}

function PoolsTable() {
  const { markets, loading } = useAllMarketData();

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
          <th scope="col" className="w-1/4 py-3 px-6">
            Asset
          </th>
          <th scope="col" className="py-3 px-6">
            Detail
          </th>
          <th scope="col" className="py-3 px-6">
            Available liquidity
          </th>
          <th scope="col" className="py-3 px-6">
            Deposit rate
          </th>
          <th scope="col" className="py-3 px-6">
            Borrow rate
          </th>
          <th scope="col" className="py-3 px-6">
            Collateral
          </th>
          <th scope="col" className="py-3 px-6">
            APY
          </th>
          <th scope="col" className="py-3 px-6">
            Wallet
          </th>
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
  useContract();
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
