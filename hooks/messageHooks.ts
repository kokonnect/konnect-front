import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { AppDispatch } from "@/store/store";
import {
  selectCurrentRequest,
  selectCurrentResult,
  selectIsComposing,
  selectIsLoading,
  selectComposeError,
  composeMessageThunk,
  clearMessage,
  clearComposeError,
  setCurrentRequest,
} from "@/store/features/message/messageSlice";
import { MessageComposeRequest } from "@/types/message";

export function useMessageCompose() {
  const dispatch = useDispatch<AppDispatch>();
  const currentRequest = useSelector(selectCurrentRequest);
  const currentResult = useSelector(selectCurrentResult);
  const isComposing = useSelector(selectIsComposing);
  const isLoading = useSelector(selectIsLoading);
  const composeError = useSelector(selectComposeError);

  const composeMessage = useCallback(
    async (request: MessageComposeRequest) => {
      const result = await dispatch(composeMessageThunk(request));
      if (composeMessageThunk.rejected.match(result)) {
        throw new Error(result.error.message || "Message composition failed");
      }
      return result.payload;
    },
    [dispatch],
  );

  const clearMessageState = useCallback(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearComposeError());
  }, [dispatch]);

  const setRequest = useCallback(
    (request: MessageComposeRequest) => {
      dispatch(setCurrentRequest(request));
    },
    [dispatch],
  );

  return {
    // State
    currentRequest,
    currentResult,
    isComposing,
    isLoading,
    composeError,
    // Actions
    composeMessage,
    clearMessageState,
    clearError,
    setRequest,
  };
}
