import { useEffect, useMemo, useRef } from "react";
import { useIsMd } from "../../../../hooks/useIsMd";
import {
  getAllDirPosition,
  getBounded,
  getDistance,
  type positionMeta,
} from "../../../../scripts/distance";
import { useOverlayContext } from "./OverlayContext";
import { getScrollBounds } from "../TranslationBar/TlContent";
import { getColorId } from "../../../../scripts/color";
import { animate, motion, useMotionValue } from "framer-motion";
import useWindowSize from "../../../../hooks/useWindowSize";

const OverlayConnector = ({
  id,
  hovering,
}: {
  id: string;
  hovering: boolean;
}) => {
  const windowSize = useWindowSize();
  const isMd = useIsMd();
  const scrollBounds = getScrollBounds();

  const { overlayMetas, overlayTransformsRef } = useOverlayContext();
  const t = overlayTransformsRef.current[id];

  if (!t.overlay || !t.side) return;

  function getNearestPair(pos: positionMeta, ref: positionMeta) {
    const from = getAllDirPosition(pos).sort(
      (a, b) => getDistance(a, ref.p) - getDistance(b, ref.p)
    )[0];
    const to = getAllDirPosition(ref).sort(
      (a, b) => getDistance(a, pos.p) - getDistance(b, pos.p)
    )[0];
    const PAD = 6;
    return {
      from: getBounded(from, {
        s: { x: PAD, y: PAD },
        e: { x: windowSize.width - PAD, y: windowSize.height - PAD },
      }),
      to: getBounded(to, {
        s: { x: to.x, y: scrollBounds.y },
        e: {
          x: to.x,
          y: scrollBounds.y + scrollBounds.h,
        },
      }),
    };
  }

  const { from, to } = getNearestPair(t.overlay, t.side);

  const transformRef = useRef({
    midPos: { x: useMotionValue(0), y: useMotionValue(0) },
    length: useMotionValue(0),
    angle: useMotionValue(0),
  });

  useEffect(() => {
    const tweenConfig = {
      type: "tween",
      duration: 0.03,
      ease: "linear",
    } as const;
    const { midPos, length, angle } = transformRef.current;

    animate(midPos.x, (from.x + to.x) / 2, tweenConfig);
    animate(midPos.y, (from.y + to.y) / 2, tweenConfig);
    animate(length, getDistance(from, to), tweenConfig);
    animate(
      angle,
      (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI,
      tweenConfig
    );
  }, [from.x, from.y, to.x, to.y]);

  const color = useMemo(
    () => overlayMetas[id]?.color ?? getColorId(id),
    [overlayMetas, id]
  );

  const isEdge = useMemo(() => {
    const scrollBounds = getScrollBounds();
    return (
      to.y < scrollBounds.y + 1 || to.y > scrollBounds.y + scrollBounds.h - 1
    );
  }, [to.y]);

  const isVisible = useMemo(
    () => hovering && !isMd && !isEdge,
    [hovering, isMd, isEdge]
  );

  const { midPos, length, angle } = transformRef.current;

  return (
    <motion.div
      key={id}
      className="absolute z-10 rounded-full transition-opacity duration-100"
      style={{
        left: midPos.x,
        top: midPos.y,
        width: length,
        height: 2,
        rotate: angle,
        translateX: "-50%",
        translateY: "-50%",
        transformOrigin: "center",
        backgroundColor: color,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div
        className="absolute top-1/2 rounded-full"
        style={{
          width: 8,
          height: 8,
          left: 0,
          transform: "translate(-50%, -50%)",
          backgroundColor: color,
        }}
      />

      <div
        className="absolute top-1/2 rounded-full"
        style={{
          width: 8,
          height: 8,
          right: 0,
          transform: "translate(50%, -50%)",
          backgroundColor: color,
        }}
      />
    </motion.div>
  );
};

export default OverlayConnector;
