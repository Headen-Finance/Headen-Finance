import { Tab } from "@headlessui/react";
import { useMemo } from "react";
import * as React from "react";
import { Address } from "wagmi";

import clsxm from "@/lib/clsxm";

import { Borrow } from "@/components/headen/Borrow";
import { Repay } from "@/components/headen/Repay";
import { Stake } from "@/components/headen/Stake";
import { Withdraw } from "@/components/headen/Withdraw";

type AssetDialogProp = {
  tokenAddress: Address;
};
export const AssetDialog = ({ tokenAddress }: AssetDialogProp) => {
  // const tokenAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'; //LINK on goerli
  // useChainlinkFeed();
  const categories = useMemo(
    () => ({
      Supply: () => <Stake tokenAddress={tokenAddress} />,
      Borrow: () => <Borrow tokenAddress={tokenAddress} />,
      Withdraw: () => <Withdraw tokenAddress={tokenAddress} />,
      Repay: () => <Repay tokenAddress={tokenAddress} />,
    }),
    [tokenAddress]
  );

  return (
    <div className="w-full px-0">
      <Tab.Group>
        <Tab.List className="sticky top-0 z-10 flex bg-[#F5F5F5]">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
              className={({ selected }) =>
                clsxm(
                  "w-full  rounded-none py-3.5 text-sm font-medium leading-5 text-white",
                  "ring-white ring-opacity-60 ring-offset-2 focus-visible:bg-primary-500",
                  selected
                    ? " bg-primary text-white"
                    : "text-primary hover:bg-primary-600 hover:text-white"
                )
              }
            >
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2 w-full px-2 pb-2">
          {Object.values(categories).map((element, idx) => (
            <Tab.Panel key={idx}>{element()}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
