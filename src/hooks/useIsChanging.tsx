import { useState, useEffect, useRef } from "react";

export function useIsChanging(value: any, delay = 100) {
  const [isChanging, setIsChanging] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (prevValueRef.current !== value) {
      setIsChanging(true);
      prevValueRef.current = value;

      timeoutRef.current = setTimeout(() => {
        setIsChanging(false);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return isChanging;
}
