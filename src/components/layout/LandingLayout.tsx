import * as React from 'react';

import BaseDialog from '@/components/dialog/BaseDialog';
import { LandingFooter } from '@/components/layout/LandingFooter';
import LandingHeader from '@/components/layout/LandingHeader';

import useDialogStore from '@/store/useDialogStore';

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  //#region  //*=========== Store ===========
  const open = useDialogStore.useOpen();
  const state = useDialogStore.useState();
  const handleClose = useDialogStore.useHandleClose();
  const handleSubmit = useDialogStore.useHandleSubmit();
  //#endregion  //*======== Store ===========

  return (
    <div className=''>
      <LandingHeader />
      {children}
      <LandingFooter />
      <BaseDialog
        onClose={handleClose}
        onSubmit={handleSubmit}
        open={open}
        options={state}
      />
    </div>
  );
}
