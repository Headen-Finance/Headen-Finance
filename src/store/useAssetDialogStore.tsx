import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import produce from 'immer';
import create from 'zustand';

type AssetDialogStoreType = {
  tokenAddress: string | null;
  disableClose: boolean;
  handleClose: () => void;
  openDialog: (tokenAddress: string) => void;
};

const useAssetDialogStoreBase = create<AssetDialogStoreType>((set) => ({
  disableClose: false,
  tokenAddress: null,
  handleClose: () => {
    set(
      produce<AssetDialogStoreType>((state) => {
        state.tokenAddress = null;
      })
    );
  },
  openDialog: (tokenAddress: string) => {
    set(
      produce<AssetDialogStoreType>((state) => {
        state.tokenAddress = tokenAddress;
      })
    );
  },
}));

const useAssetDialogStore = createSelectorHooks(useAssetDialogStoreBase);

export default useAssetDialogStore;
