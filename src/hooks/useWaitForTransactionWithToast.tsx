import { SendTransactionResult } from "@wagmi/core";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useWaitForTransaction } from "wagmi";

import { WaitingForTx } from "@/components/headen/AssetDialogComponents";

export type UseWaitForTransactionWithToastProps = {
  data?: SendTransactionResult;
};

export function useWaitForTransactionWithToast({
  data,
}: UseWaitForTransactionWithToastProps) {
  const transactionData = useWaitForTransaction({
    hash: data?.hash,
  });
  const dialogId = useRef<string>();
  useEffect(() => {
    if (transactionData.isLoading && !dialogId.current) {
      dialogId.current = toast.loading(<WaitingForTx tx={data} />);
    } else {
      if (transactionData.isSuccess) {
        toast.success("Successfully created the pool and staked", {
          id: dialogId.current,
        });
      } else if (transactionData.isError) {
        toast.error("Ooops, something went wrong", { id: dialogId.current });
      }
    }
    return toast.dismiss(dialogId.current);
  }, [
    transactionData.isLoading,
    transactionData.isSuccess,
    transactionData.isError,
    data,
  ]);
  return transactionData;
}
