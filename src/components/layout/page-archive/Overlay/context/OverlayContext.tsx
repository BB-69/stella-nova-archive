import {
  createContext,
  type ReactNode,
  useState,
  useContext,
  useRef,
  type RefObject,
  useEffect,
} from "react";
import { type positionMeta } from "../../../../../scripts/distance";
import { useDebugValue } from "../../../../_DebugTools/useDebugValue";
import OverlayApplier from "../OverlayApplier";

type CursorGuideModeType = "always" | "onMove" | "none";
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
  cursorGuideMode: CursorGuideModeType;
  setCursorGuideMode: React.Dispatch<React.SetStateAction<CursorGuideModeType>>;
  overlayActive: boolean;
  setOverlayActive: React.Dispatch<React.SetStateAction<boolean>>;
  connectorActive: boolean;
  setConnectorActive: React.Dispatch<React.SetStateAction<boolean>>;
  infoAutoScroll: boolean;
  setInfoAutoScroll: React.Dispatch<React.SetStateAction<boolean>>;
  overlayMetas: OverlayMetaType;
  setOverlayMetas: React.Dispatch<
    React.SetStateAction<{
      [key: string]: { color: string; hover: boolean };
    }>
  >;
  overlayTransformsRef: OverlayTransformType;
  hoveringOverlayUID: string[];
  setHoveringOverlayUID: React.Dispatch<React.SetStateAction<string[]>>;
}

export const OverlayContext = createContext<OverlayContextType | null>(null);

export function OverlayProvider({ children }: { children: ReactNode }) {
  const [cursorGuideMode, setCursorGuideMode] = useState<CursorGuideModeType>(
    (() => {
      const isCursorGuideMode = (
        value: string | null
      ): value is CursorGuideModeType =>
        value === "always" || value === "onMove" || value === "none";

      const value = localStorage?.getItem("overlayConfig-cursorGuideMode");
      return isCursorGuideMode(value) ? value : "onMove";
    })()
  );
  const [overlayActive, setOverlayActive] = useState<boolean>(
    localStorage?.getItem("overlayConfig-overlayActive")
      ? localStorage.getItem("overlayConfig-overlayActive") === "true"
      : true
  );
  const [connectorActive, setConnectorActive] = useState<boolean>(
    localStorage?.getItem("overlayConfig-connectorActive")
      ? localStorage.getItem("overlayConfig-connectorActive") === "true"
      : true
  );
  const [infoAutoScroll, setInfoAutoScroll] = useState<boolean>(
    localStorage?.getItem("overlayConfig-infoAutoScroll")
      ? localStorage.getItem("overlayConfig-infoAutoScroll") === "true"
      : true
  );
  const [overlayMetas, setOverlayMetas] = useState<{
    [key: string]: { color: string; hover: boolean };
  }>({});
  const overlayTransformsRef = useRef<{
    [key: string]: {
      overlay: positionMeta;
      side: positionMeta;
    };
  }>({});
  const [hoveringOverlayUID, setHoveringOverlayUID] = useState<string[]>([]);

  {
    useDebugValue("overlayMetas", overlayMetas, "/archive");
    // useDebugValue("overlayTransformsRef", overlayTransformsRef.current, "/archive");

    /* remove typos */
    localStorage.removeItem("overlogConfig-overlayActive");
    localStorage.removeItem("overlogConfig-connectorActive");
    localStorage.removeItem("overlogConfig-infoAutoScroll");
  }

  useEffect(() => {
    localStorage?.setItem("overlayConfig-cursorGuideMode", cursorGuideMode);
    localStorage?.setItem(
      "overlayConfig-overlayActive",
      overlayActive ? "true" : "false"
    );
    localStorage?.setItem(
      "overlayConfig-connectorActive",
      connectorActive ? "true" : "false"
    );
    localStorage?.setItem(
      "overlayConfig-infoAutoScroll",
      infoAutoScroll ? "true" : "false"
    );
  }, [overlayActive, connectorActive, infoAutoScroll]);

  return (
    <OverlayContext.Provider
      value={{
        cursorGuideMode,
        setCursorGuideMode,
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
