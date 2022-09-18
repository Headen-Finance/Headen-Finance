import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import * as React from 'react';

import clsxm from '@/lib/clsxm';

type DialogProps = {
  show: boolean;
  onClose: () => void;
  backdropClassName?: string | undefined;
} & React.ComponentPropsWithRef<'div'>;

export const DialogFrame = ({
  show,
  onClose,
  children,
  backdropClassName,
  className,
}: DialogProps) => {
  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div
            className={clsxm(
              'fixed inset-0 bg-black bg-opacity-25',
              backdropClassName
            )}
          />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full w-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel as='div' className='flex justify-center'>
                <div
                  className={clsxm(
                    'w-fullmax-w-xs transform  overflow-hidden rounded-2xl bg-gray-700 p-6 align-middle text-white shadow-xl transition-all sm:max-w-sm md:max-w-md lg:max-w-xl',
                    className
                  )}
                >
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
