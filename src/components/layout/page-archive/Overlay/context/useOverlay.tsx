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
    connectorActive,
    setConnectorActive,
    infoAutoScroll,
    setInfoAutoScroll,
    overlayMetas,
    setOverlayMetas,
    overlayTransformsRef,
    hoveringOverlayUID,
    setHoveringOverlayUID,
  } = useOverlayContext();

  const toggleOverlayActive = () => {
    setOverlayActive((prev) => !prev);
  };

  const toggleConnectorActive = () => {
    setConnectorActive((prev) => !prev);
  };

  const toggleInfoAutoScroll = () => {
    setInfoAutoScroll((prev) => !prev);
  };

  const resetOverlayData = () => {
    setOverlayMetas({});
    overlayTransformsRef.current = {};
  };

  const applyHoveringOverlayUID = (uid: string) => {
    setHoveringOverlayUID((prev) => [...prev, uid]);
  };
  const removeHoveringOverlayUID = (uid: string) => {
    setHoveringOverlayUID((prev) => prev.filter((id) => id !== uid));
  };

  const setOverlayMeta = (meta: OverlayMetaType) => {
    setOverlayMetas((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(meta)) {
        next[key] = {
          color: value.color ?? prev[key]?.color ?? getColorId(key),
          hover: value.hover,
        };
        if (value.hover && !hoveringOverlayUID.includes(key))
          applyHoveringOverlayUID(key);
        else if (!value.hover && hoveringOverlayUID.includes(key))
          removeHoveringOverlayUID(key);
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
    connectorActive,
    toggleConnectorActive,
    infoAutoScroll,
    toggleInfoAutoScroll,
    hoveringOverlayUID,
    overlayMetas,
    setOverlayMeta,
    overlayTransformsRef,
    setOverlayTransform,
    removeOverlay,
    resetOverlayData,
  };
}
