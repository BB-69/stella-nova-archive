import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";

function isMotionValue(v: any): v is MotionValue<any> {
  return v && typeof v.on === "function" && typeof v.get === "function";
}

export function useIsChanging(value: any, delay = 100) {
  const [isChanging, setIsChanging] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const prevValueRef = useRef<any>(null);

  // prevent first trigger on mount for normal React values
  const isFirstRun = useRef(true);

  const trigger = (next: any) => {
    if (prevValueRef.current === next) return;

    prevValueRef.current = next;
    setIsChanging(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsChanging(false);
    }, delay);
  };

  // React value path
  useEffect(() => {
    if (isMotionValue(value)) return;

    if (isFirstRun.current) {
      prevValueRef.current = value;
      isFirstRun.current = false;
      return;
    }

    trigger(value);
  }, [value, delay]);

  // MotionValue path
  useEffect(() => {
    if (!isMotionValue(value)) return;

    prevValueRef.current = value.get();

    const unsubscribe = value.on("change", trigger);

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return isChanging;
}
