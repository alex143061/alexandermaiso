import { useEffect, useState } from "react";

const getIsLowPowerDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const connection = navigator.connection || navigator.webkitConnection;
  const saveData = !!connection?.saveData;
  const slowNetwork =
    !!connection &&
    typeof connection.effectiveType === "string" &&
    /^(slow-2g|2g|3g)$/.test(connection.effectiveType);
  const smallScreen = window.matchMedia("(max-width: 768px)").matches;
  const lowMemory =
    typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
  const fewCores =
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency <= 4;
  return saveData || slowNetwork || (smallScreen && (lowMemory || fewCores));
};

export const useIsLowPowerDevice = () => {
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    setIsLowPower(getIsLowPowerDevice());
  }, []);

  return isLowPower;
};