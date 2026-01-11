import { useEffect, useRef } from "react";

export function useReloadOnChange(value: unknown, condition?: boolean) {
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value && condition) {
      window.location.reload();
    }
    prev.current = value;
  }, [value]);
}
