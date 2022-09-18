import * as React from 'react';

import clsxm from '@/lib/clsxm';

import IndicatorArrow from '~/svg/indicator-arrow.svg';

type IndicatorPropType = {
  value: number;
} & React.ComponentPropsWithRef<'div'>;

export default function Indicator({
  value,
  className,
  ...rest
}: IndicatorPropType) {
  return (
    <div
      style={{ height: '250px', width: '250px' }}
      className={clsxm(
        'border-6 flex flex-col items-center justify-center rounded-full border-white',
        className
      )}
      {...rest}
    >
      <span className='font-semibold'>Your risk level</span>
      <span className='m-2 text-2xl font-bold'>0</span>
      <div className='relative h-1.5 w-3/5 bg-gradient-to-r from-yellow-300 via-orange-500 to-red-700'>
        <IndicatorArrow
          style={{
            left: value * 100 + '%',
            bottom: '3px',
            height: '10px',
            width: '10px',
            marginLeft: '-10px',
          }}
          className='absolute'
        ></IndicatorArrow>
      </div>
    </div>
  );
}
