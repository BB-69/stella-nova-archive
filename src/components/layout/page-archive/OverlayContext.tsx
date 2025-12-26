import {
  createContext,
  type ReactNode,
  useState,
  useContext,
  Fragment,
} from "react";
import OverlayConnector from "./OverlayConnector";
import {
  getAllDirPosition,
  getBounded,
  getDistance,
  positionMetaDefault,
  type positionMeta,
} from "../../../scripts/distance";
import { useDebugValue } from "../../../hooks/useDebugValue";
import { getScrollBounds } from "./TranslationBar";
import { DEFAULT_COLOR } from "../../../scripts/color";
import OverlayBoxliner from "./OverlayBoxliner";

export type OverlayMetaType = {
  [key: string]: { color?: string; hover: boolean };
};
export type OverlayTransformType = {
  [key: string]: {
    overlay?: positionMeta;
    side?: positionMeta;
  };
};

interface OverlayContextType {
  overlayActive: boolean;
  toggleOverlayActive: () => void;
  overlayMetas: OverlayMetaType;
  setOverlayMeta: (meta: OverlayMetaType) => void;
  overlayTransforms: OverlayTransformType;
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
  const [overlayTransforms, setOverlayTransforms] = useState<{
    [key: string]: {
      overlay: positionMeta;
      side: positionMeta;
    };
  }>({});

  {
    useDebugValue("overlayMetas", overlayMetas, "/archive");
    // useDebugValue("overlayTransforms", overlayTransforms, "/archive");
  }

  const toggleOverlayActive = () => {
    setOverlayActive(!overlayActive);
  };

  const resetOverlayData = () => {
    setOverlayMetas({});
    setOverlayTransforms({});
  };

  const setOverlayMeta = (meta: OverlayMetaType) => {
    Object.entries(meta).forEach(([key, value]) => {
      setOverlayMetas((prev) => ({
        ...prev,
        [key]: {
          color: value.color ?? prev[key]?.color ?? DEFAULT_COLOR,
          hover: value.hover,
        },
      }));
    });
  };

  const setOverlayTransform = (
    isOverlay: boolean,
    id: string,
    transform: positionMeta
  ) => {
    setOverlayTransforms((prev) => ({
      ...prev,
      [id]: {
        overlay: isOverlay
          ? transform
          : prev[id]?.overlay ?? positionMetaDefault(),
        side: !isOverlay ? transform : prev[id]?.side ?? positionMetaDefault(),
      },
    }));
  };

  const removeOverlayMeta = (id: string) => {
    setOverlayMetas((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const removeOverlayTransform = (id: string) => {
    setOverlayTransforms((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const removeOverlay = (id: string) => {
    removeOverlayMeta(id);
    removeOverlayTransform(id);
  };

  return (
    <OverlayContext.Provider
      value={{
        overlayActive,
        toggleOverlayActive,
        overlayMetas,
        setOverlayMeta,
        overlayTransforms,
        setOverlayTransform,
        removeOverlay,
        resetOverlayData,
      }}
    >
      {children}
      {Object.entries(overlayTransforms).map(([id, t]) => {
        const scrollBounds = getScrollBounds();

        function getNearestPair(pos: positionMeta, ref: positionMeta) {
          const from = getAllDirPosition(pos).sort(
            (a, b) => getDistance(a, ref.p) - getDistance(b, ref.p)
          )[0];
          const to = getAllDirPosition(ref).sort(
            (a, b) => getDistance(a, pos.p) - getDistance(b, pos.p)
          )[0];
          return {
            from: from,
            to: getBounded(to, {
              s: { x: to.x, y: scrollBounds.y },
              e: {
                x: to.x,
                y: scrollBounds.y + scrollBounds.h,
              },
            }),
          };
        }

        const pair = getNearestPair(t.overlay, t.side);
        const hovering = overlayMetas[id].hover;

        return (
          <Fragment key={id}>
            <OverlayConnector
              id={id}
              from={pair.from}
              to={pair.to}
              hovering={hovering}
            />
            <OverlayBoxliner
              hovering={hovering}
              overlay={overlayTransforms[id].overlay}
            />
          </Fragment>
        );
      })}
    </OverlayContext.Provider>
  );
}

export const useOverlayContext = () => {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("OverlayContext missing provider!");
  return ctx;
};
