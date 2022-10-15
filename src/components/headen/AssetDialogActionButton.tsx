import { ReactNode } from 'react';

import clsxm from '@/lib/clsxm';

import Button from '@/components/buttons/Button';

export type AssetDialogActionButtonProps = {
  loading?: boolean;
  onClick?: () => unknown;
  className?: string;
  children: ReactNode;
};
export function AssetDialogActionButton({
  loading,
  onClick,
  children,
  className,
}: AssetDialogActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      type='button'
      isLoading={loading}
      className={clsxm(
        'w-full justify-center py-3.5 sm:py-5',
        'w-full justify-center py-3.5 sm:py-5',
        className
      )}
      variant='light'
    >
      {children}
    </Button>
  );
}
