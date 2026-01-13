import {
  createContext,
  type ReactNode,
  useState,
  useContext,
  useRef,
  type RefObject,
} from "react";
import { type positionMeta } from "../../../../../scripts/distance";
import { useDebugValue } from "../../../../_DebugTools/useDebugValue";
import OverlayApplier from "../OverlayApplier";

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
  const [overlayActive, setOverlayActive] = useState<boolean>(true);
  const [connectorActive, setConnectorActive] = useState<boolean>(true);
  const [infoAutoScroll, setInfoAutoScroll] = useState<boolean>(true);
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
  }

  return (
    <OverlayContext.Provider
      value={{
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
