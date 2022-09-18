import * as React from 'react';

import clsxm from '@/lib/clsxm';

type HomeInfoProps = {
  title: string;
  value: string;
} & React.ComponentPropsWithRef<'div'>;

export default function HomeInfo({
  title,
  value,
  className,
  ...rest
}: HomeInfoProps) {
  return (
    <div
      {...rest}
      style={{ height: '100px' }}
      className={clsxm(
        'flex grow basis-1 flex-col items-center justify-around',
        className
      )}
    >
      <span className='text-md font-semibold'>{title}</span>
      <span className='text-lg font-bold'>{value}</span>
    </div>
  );
}
