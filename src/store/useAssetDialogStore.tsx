import { createSelectorHooks } from 'auto-zustand-selectors-hook';
import produce from 'immer';
import { Address } from 'wagmi';
import create from 'zustand';

type AssetDialogStoreType = {
  tokenAddress: Address | null;
  disableClose: boolean;
  handleClose: () => void;
  openDialog: (tokenAddress: Address) => void;
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
  openDialog: (tokenAddress: Address) => {
    set(
      produce<AssetDialogStoreType>((state) => {
        state.tokenAddress = tokenAddress;
      })
    );
  },
}));

const useAssetDialogStore = createSelectorHooks(useAssetDialogStoreBase);

export default useAssetDialogStore;
