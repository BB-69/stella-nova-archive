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
    uid: string,
    transform: positionMeta
  ) => {
    if (!uid) return;

    const prev = overlayTransformsRef.current;
    overlayTransformsRef.current = {
      ...prev,
      [uid]: {
        overlay: isOverlay
          ? transform
          : prev[uid]?.overlay ?? positionMetaDefault(),
        side: !isOverlay ? transform : prev[uid]?.side ?? positionMetaDefault(),
      },
    };
  };

  const removeOverlay = (uid: string) => {
    if (!uid) return;

    setOverlayMetas((prev) => {
      const { [uid]: _, ...rest } = prev;
      return rest;
    });

    overlayTransformsRef.current = (() => {
      const prev = overlayTransformsRef.current;
      const { [uid]: _, ...rest } = prev;
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
