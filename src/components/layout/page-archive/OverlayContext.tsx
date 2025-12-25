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
import { getImageBounds } from "./Content";
import { getScrollBounds } from "./TranslationBar";

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
          color: value.color ?? prev[key]?.color ?? "#676767",
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

  return (
    <OverlayContext.Provider
      value={{
        overlayActive,
        toggleOverlayActive,
        overlayMetas,
        setOverlayMeta,
        overlayTransforms,
        setOverlayTransform,
        resetOverlayData,
      }}
    >
      {children}
      {Object.entries(overlayTransforms).map(([id, t]) => {
        const imgBounds = getImageBounds();
        const scrollBounds = getScrollBounds();

        function getNearestPair(pos: positionMeta, ref: positionMeta) {
          const from = getAllDirPosition(pos).sort(
            (a, b) => getDistance(a, ref.p) - getDistance(b, ref.p)
          )[0];
          const to = getAllDirPosition(ref).sort(
            (a, b) => getDistance(a, pos.p) - getDistance(b, pos.p)
          )[0];
          return {
            from: getBounded(from, {
              s: { x: imgBounds.x, y: imgBounds.y },
              e: { x: imgBounds.x + imgBounds.w, y: imgBounds.y + imgBounds.h },
            }),
            to: getBounded(to, {
              s: { x: scrollBounds.x, y: scrollBounds.y },
              e: {
                x: scrollBounds.x + scrollBounds.w,
                y: scrollBounds.y + scrollBounds.h,
              },
            }),
          };
        }

        const pair = getNearestPair(t.overlay, t.side);

        return (
          <Fragment key={id}>
            <OverlayConnector
              id={id}
              from={pair.from}
              to={pair.to}
              hovering={overlayMetas[id].hover}
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
