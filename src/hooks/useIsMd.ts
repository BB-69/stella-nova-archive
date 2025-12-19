import { useEffect, useState } from "react";

export function useIsMd(): boolean {
  const [isMd, setIsMd] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)"); // md breakpoint
    const handler = () => setIsMd(mq.matches);

    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMd;
}
