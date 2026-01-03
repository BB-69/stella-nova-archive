import { getColorId } from "../../../../../scripts/color";
import {
  positionMetaDefault,
  type positionMeta,
} from "../../../../../scripts/distance";
import { useOverlayContext, type OverlayMetaType } from "./OverlayContext";

export function useOverlay() {
  const {
    overlayActive,
    setOverlayActive,
    overlayMetas,
    setOverlayMetas,
    overlayTransformsRef,
  } = useOverlayContext();

  const toggleOverlayActive = () => {
    setOverlayActive((prev) => !prev);
  };

  const resetOverlayData = () => {
    setOverlayMetas({});
    overlayTransformsRef.current = {};
  };

  const setOverlayMeta = (meta: OverlayMetaType) => {
    setOverlayMetas((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(meta)) {
        next[key] = {
          color: value.color ?? prev[key]?.color ?? getColorId(key),
          hover: value.hover,
        };
      }
      return next;
    });
  };

  const setOverlayTransform = (
    isOverlay: boolean,
    id: string,
    transform: positionMeta
  ) => {
    const prev = overlayTransformsRef.current;
    overlayTransformsRef.current = {
      ...prev,
      [id]: {
        overlay: isOverlay
          ? transform
          : prev[id]?.overlay ?? positionMetaDefault(),
        side: !isOverlay ? transform : prev[id]?.side ?? positionMetaDefault(),
      },
    };
  };

  const removeOverlay = (id: string) => {
    setOverlayMetas((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    overlayTransformsRef.current = (() => {
      const prev = overlayTransformsRef.current;
      const { [id]: _, ...rest } = prev;
      return rest;
    })();
  };

  return {
    overlayActive,
    toggleOverlayActive,
    overlayMetas,
    setOverlayMeta,
    overlayTransformsRef,
    setOverlayTransform,
    removeOverlay,
    resetOverlayData,
  };
}
