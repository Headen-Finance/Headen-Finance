import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import * as React from 'react';
import {
  HiExclamationCircle,
  HiOutlineCheck,
  HiOutlineExclamation,
} from 'react-icons/hi';

import Button from '@/components/buttons/Button';
import { CloseButton } from '@/components/buttons/CloseButton';
import { DialogFrame } from '@/components/dialog/DialogFrame';

type BaseDialogProps = {
  /** Maintained by useDialogStore */
  open: boolean;
  /** Maintained by useDialogStore */
  onSubmit: () => void;
  /** Maintained by useDialogStore */
  onClose: () => void;
  /** Customizable Dialog Options */
  options: DialogOptions;
};

export type DialogOptions = {
  catchOnCancel?: boolean;
  title: React.ReactNode;
  description: React.ReactNode;
  variant: 'success' | 'warning' | 'danger';
  submitText?: React.ReactNode;
};

/**
 * Base Dialog for useDialog hook implementation.
 *
 * **Should be called with the hook, not by the component itself**
 *
 *
 * @see useDialogStore
 * @example ```tsx
 * const dialog = useDialog();
 *
 * dialog(options);
 * ```
 */
export default function BaseDialog({
  open,
  onSubmit,
  onClose,
  options: { title, description, variant, submitText, catchOnCancel },
}: BaseDialogProps) {
  const current = colorVariant[variant];

  return (
    <DialogFrame
      show={open}
      onClose={onClose}
      className='min-w-[16rem]'
      disableClose={catchOnCancel}
    >
      <div className='absolute -top-1 -right-1 hidden pt-4 pr-4 sm:block'>
        <CloseButton onClick={onClose} />
      </div>
      <div className='sm:flex sm:items-start'>
        <div
          className={clsx(
            'flex flex-shrink-0 items-center justify-center rounded-full',
            'mx-auto h-12 w-12 sm:mx-0 sm:h-10 sm:w-10',
            current.bg.light
          )}
        >
          <current.icon
            className={clsx('h-6 w-6', current.text.primary)}
            aria-hidden='true'
          />
        </div>
        <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
          <Dialog.Title
            as='h3'
            className='text-lg font-medium leading-6 text-white'
          >
            {title}
          </Dialog.Title>
          <div className='mt-2'>
            <p className='text-sm text-gray-200'>{description}</p>
          </div>
        </div>
      </div>
      <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
        {submitText && (
          <Button
            onClick={onSubmit}
            className={clsx(
              'w-full items-center justify-center !font-medium sm:ml-3 sm:w-auto sm:text-sm'
            )}
          >
            {submitText}
          </Button>
        )}
        <Button
          type='button'
          variant='outline'
          onClick={onClose}
          className='mt-3 w-full items-center justify-center !font-medium sm:mt-0 sm:w-auto sm:text-sm'
        >
          {submitText ? 'Cancel' : 'OK'}
        </Button>
      </div>
    </DialogFrame>
  );
}

const colorVariant = {
  success: {
    bg: {
      light: 'bg-green-100',
    },
    text: {
      primary: 'text-green-500',
    },
    icon: HiOutlineCheck,
  },
  warning: {
    bg: {
      light: 'bg-yellow-100',
    },
    text: {
      primary: 'text-yellow-500',
    },
    icon: HiOutlineExclamation,
  },
  danger: {
    bg: {
      light: 'bg-red-100',
    },
    text: {
      primary: 'text-red-500',
    },
    icon: HiExclamationCircle,
  },
};
