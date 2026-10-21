import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Toast state with auto-dismiss.
 *
 * A single timer ref is reused for every toast, so a new toast cancels the
 * pending dismissal of the previous one. (Keeping a timer per toast would let
 * an older timer clear a freshly-shown toast early.)
 */
export const useToast = (duration = 3500) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    clearTimer();
    setToast(null);
  }, [clearTimer]);

  const showToast = useCallback(
    (type, message) => {
      clearTimer();
      setToast({ type, message });
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setToast(null);
      }, duration);
    },
    [clearTimer, duration]
  );

  // Never leave a timer running after the page unmounts.
  useEffect(() => clearTimer, [clearTimer]);

  return { toast, showToast, dismiss };
};
