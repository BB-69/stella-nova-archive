import { useEffect } from "react";
import {
  useOverlayContext,
  type OverlayMetaType,
} from "../components/layout/page-archive/OverlayContext";

export function useOverlayMeta(meta: OverlayMetaType) {
  const { setOverlayMeta } = useOverlayContext();

  useEffect(() => {
    setOverlayMeta(meta);
  }, [meta, setOverlayMeta]);
}
