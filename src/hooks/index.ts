import { useState } from "react";

import { type AnyAsyncFunction } from "@/types";

type UseAsyncActionState = {
  pending: boolean;
  isSuccess: boolean;
  isError: boolean;
};

type UseAsyncActionProps<T extends AnyAsyncFunction> = {
  action: T;
  onSuccess?: (data: Awaited<ReturnType<T>>) => void;
  onError?: (error: Error) => void;
};

export function useAsyncAction<T extends AnyAsyncFunction>(
  props: UseAsyncActionProps<T>
) {
  const { action, onSuccess, onError } = props;

  const [state, setState] = useState<UseAsyncActionState>({
    pending: false,
    isSuccess: false,
    isError: false,
  });

  const asyncAction = async (...args: Parameters<T>) => {
    setState((state) => ({ ...state, pending: true }));

    try {
      const result = (await action(...args)) as Awaited<ReturnType<T>>;
      setState((state) => ({ ...state, isSuccess: true, isError: false }));
      onSuccess?.(result);
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error);
        setState((state) => ({ ...state, isSuccess: false, isError: true }));
      } else {
        throw error;
      }
    } finally {
      setState((state) => ({ ...state, pending: false }));
    }
  };

  return [state, asyncAction] as const;
}
