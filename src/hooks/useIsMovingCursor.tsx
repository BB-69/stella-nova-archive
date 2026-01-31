import { useEffect } from "react";
import { useIsChanging } from "./useIsChanging";
import { useMotionValue } from "framer-motion";

export function useIsMovingCursor() {
  const value = useMotionValue(0);
  const isMovingCursor = useIsChanging(value, 100);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      value.set(e.clientX - e.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return isMovingCursor;
}
