import clsx from 'clsx';
import * as React from 'react';
import { HiOutlineX } from 'react-icons/hi';

export function CloseButton(props: { onClick: () => void }) {
  return (
    <button
      type='button'
      className={clsx(
        'rounded-md border text-white hover:bg-gray-600',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2',
        'disabled:cursor-wait disabled:brightness-90 disabled:filter'
      )}
      onClick={props.onClick}
    >
      <span className='sr-only'>Close</span>
      <HiOutlineX className='h-6 w-6' aria-hidden='true' />
    </button>
  );
}
