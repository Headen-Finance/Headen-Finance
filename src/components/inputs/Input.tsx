import * as React from 'react';
import { ReactElement } from 'react';

import clsxm from '@/lib/clsxm';

enum InputVariant {
  'outline',
}

type InputProps = {
  isDarkBg?: boolean;
  variant?: keyof typeof InputVariant;
  leftIcon?: ReactElement;
} & React.ComponentPropsWithRef<'input'>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      disabled,
      variant = 'outline',
      isDarkBg = false,
      leftIcon,
      ...rest
    },
    ref
  ) => {
    return (
      <div className='relative mb-3 flex'>
        <span className='absolute z-10 flex h-full w-8 items-center justify-center rounded bg-transparent pl-3 text-center text-base font-normal leading-snug text-slate-300'>
          {leftIcon}
        </span>
        <input
          ref={ref}
          type='text'
          disabled={disabled}
          className={clsxm(
            'inline-flex items-center rounded px-4 py-2 pl-8 text-xs',
            'focus:outline-none focus-visible:ring focus-visible:ring-primary-500',
            //#region  //*=========== Variants ===========
            [
              variant === 'outline' && [
                'text-primary-500',
                'border border-primary-500',
                'hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100',
                isDarkBg &&
                  'hover:bg-gray-900 active:bg-gray-800 disabled:bg-gray-800',
              ],
            ],
            //#endregion  //*======== Variants ===========
            'disabled:cursor-not-allowed',
            className
          )}
          {...rest}
        ></input>
      </div>
    );
  }
);

export default Input;
