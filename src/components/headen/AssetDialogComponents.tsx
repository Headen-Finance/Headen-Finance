import { Disclosure, Transition } from "@headlessui/react";
import { Fragment } from "react";
import * as React from "react";
import { IoChevronDown } from "react-icons/io5";
import { Address } from "wagmi";

import clsxm from "@/lib/clsxm";

import Button from "@/components/buttons/Button";
import { Loading } from "@/components/Loading";
import { NoWalletConnected } from "@/components/web3/NoWalletConnected";
import { WhenWallet } from "@/components/web3/WhenAccount";

export function WaitingForTx(props: { tx: { hash: string } }) {
  return (
    <span className="flex flex-col">
      <span>Waiting for confirmation</span>
      <span>tx: {props.tx.hash}</span>
    </span>
  );
}

export type ParametersProps = {
  items: Parameter[];
  className?: string;
};
export type Parameter = {
  title: React.ReactNode;
  value: React.ReactNode;
};

export function AssetParameters({ className, items }: ParametersProps) {
  return (
    <div className={clsxm("flex flex-col gap-1", className)}>
      {items &&
        items.map((item, index) => (
          <div className="flex justify-between" key={index}>
            <span>{item.title}</span>
            <span>{item.value}</span>
          </div>
        ))}
    </div>
  );
}

export function MoreParametersDisclosure({
  items,
  className,
}: ParametersProps) {
  return (
    <Disclosure>
      <Disclosure.Button as={Fragment}>
        <Button
          className={clsxm("mt-4 mb-2 sm:mt-8", className)}
          variant="ghost"
        >
          More parameters <IoChevronDown />
        </Button>
      </Disclosure.Button>

      <Transition
        enter="transition-all duration-100 ease-out"
        enterFrom="transform max-h-0 scale-95 opacity-0"
        enterTo="transform scale-100  max-h-[200px] opacity-100"
        leave="transition-all duration-75 ease-out"
        leaveFrom="transform scale-100  max-h-[200px] opacity-100"
        leaveTo="transform max-h-0 scale-95 opacity-0"
      >
        <Disclosure.Panel>
          <div className="flex flex-col gap-1 pb-4">
            {items &&
              items.map((item, index) => (
                <div className="flex justify-between" key={index}>
                  <span>{item.title}</span>
                  <span>{item.value}</span>
                </div>
              ))}
          </div>
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}

export type AssetAmountInput = {
  percent: number;
  onPercentChanged: (percent: number) => void;
  maxText?: string;
  className?: string;
};

export function AssetAmountInput({
  maxText,
  onPercentChanged,
  percent,
  className,
}: AssetAmountInput) {
  return (
    <div className={clsxm("relative py-5 sm:py-10", className)}>
      <input
        type="range"
        className="range-input h-1.5 w-full cursor-pointer appearance-none  rounded-lg bg-gray-200 accent-amber-900 dark:bg-gray-100"
        min={1}
        max={100}
        step={1}
        value={percent}
        onChange={(event) => onPercentChanged(parseInt(event.target.value))}
        id="customRange1"
      />
      <div className="flex justify-between">
        <span> 0</span>
        <span> {maxText}</span>
      </div>
    </div>
  );
}

export type AssetBalanceProps = {
  displayAmount: number;
  symbol?: string | null;
  setMax?: () => void;
};

export function AssetBalance({
  displayAmount,
  symbol,
  setMax,
}: AssetBalanceProps) {
  return (
    <div className="py-3.5 sm:py-5 md:py-10">
      <div className="relative">
        <span className="text-2xl sm:text-3xl md:text-5xl">
          {displayAmount}
          {symbol}
        </span>
        {setMax && (
          <Button
            variant="outline"
            isDarkBg
            className="absolute right-0 top-1 aspect-square rounded-full border-black p-0.5 text-xs text-black sm:text-lg"
            onClick={setMax}
          >
            Max
          </Button>
        )}
      </div>
    </div>
  );
}

export type AssetFrameProps = {
  tokenAddress?: Address;
  children: React.ReactNode;
};

export function AssetFrame({ tokenAddress, children }: AssetFrameProps) {
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
        {children}
      </div>
    </>
  );
}
