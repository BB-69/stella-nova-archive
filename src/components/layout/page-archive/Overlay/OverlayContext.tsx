import {
  createContext,
  type ReactNode,
  useState,
  useContext,
  useRef,
  type RefObject,
} from "react";
import {
  positionMetaDefault,
  type positionMeta,
} from "../../../../scripts/distance";
import { useDebugValue } from "../../../../hooks/useDebugValue";
import { getColorId } from "../../../../scripts/color";
import OverlayApplier from "./OverlayApplier";

export type OverlayMetaType = {
  [key: string]: { color?: string; hover: boolean };
};
export type OverlayTransformType = RefObject<{
  [key: string]: {
    overlay?: positionMeta;
    side?: positionMeta;
  };
}>;

interface OverlayContextType {
  overlayActive: boolean;
  toggleOverlayActive: () => void;
  overlayMetas: OverlayMetaType;
  setOverlayMeta: (meta: OverlayMetaType) => void;
  overlayTransformsRef: OverlayTransformType;
  setOverlayTransform: (
    isOverlay: boolean,
    id: string,
    transform: positionMeta
  ) => void;
  removeOverlay: (id: string) => void;
  resetOverlayData: () => void;
}

export const OverlayContext = createContext<OverlayContextType | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [overlayActive, setOverlayActive] = useState<boolean>(true);
  const [overlayMetas, setOverlayMetas] = useState<{
    [key: string]: { color: string; hover: boolean };
  }>({});
  const overlayTransformsRef = useRef<{
    [key: string]: {
      overlay: positionMeta;
      side: positionMeta;
    };
  }>({});

  {
    useDebugValue("overlayMetas", overlayMetas, "/archive");
    // useDebugValue("overlayTransformsRef", overlayTransformsRef.current, "/archive");
  }

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

  return (
    <OverlayContext.Provider
      value={{
        overlayActive,
        toggleOverlayActive,
        overlayMetas,
        setOverlayMeta,
        overlayTransformsRef,
        setOverlayTransform,
        removeOverlay,
        resetOverlayData,
      }}
    >
      {children}
      <OverlayApplier />
    </OverlayContext.Provider>
  );
}

export const useOverlayContext = () => {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("OverlayContext missing provider!");
  return ctx;
};
