import { useEffect } from "react";
import { useOverlayContext, type OverlayMetaType } from "./OverlayContext";
import type { position } from "../../../../scripts/distance";

export function useOverlayReset() {
  const { resetOverlayData } = useOverlayContext();

  useEffect(() => {
    resetOverlayData();
  }, [resetOverlayData]);
}

export function useOverlayMeta(meta: OverlayMetaType) {
  const { setOverlayMeta } = useOverlayContext();

  useEffect(() => {
    setOverlayMeta(meta);
  }, [meta, setOverlayMeta]);
}

export function useOverlayTransform(
  isOverlay: boolean,
  id: string,
  transform: { p: position; t: number; b: number; l: number; r: number }
) {
  const { setOverlayTransform } = useOverlayContext();

  useEffect(() => {
    setOverlayTransform(isOverlay, id, transform);
  }, [isOverlay, id, transform, setOverlayTransform]);
}
