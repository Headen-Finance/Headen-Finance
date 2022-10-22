import { Disclosure, Transition } from "@headlessui/react";
import { Fragment } from "react";
import * as React from "react";
import { IoChevronDown } from "react-icons/io5";

import clsxm from "@/lib/clsxm";

import Button from "@/components/buttons/Button";

export function WaitingForTx(props: { tx: unknown }) {
  return (
    <span className="flex flex-col">
      <span>Waiting for confirmation</span>
      <span>tx: {props.tx.hash}</span>
    </span>
  );
}

export type MoreParametersDisclosureProps = {
  items: Parameter[];
  className?: string;
};
export type Parameter = {
  title: React.ReactNode;
  value: React.ReactNode;
};
export function MoreParametersDisclosure({
  items,
  className,
}: MoreParametersDisclosureProps) {
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
              items.map((item) => (
                <div className="flex justify-between" key={item.title}>
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
