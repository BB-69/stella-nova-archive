import { useLayoutEffect, useMemo, useRef } from "react";
import { useIsMd } from "../../../../hooks/useIsMd";
import {
  getAllDirPosition,
  getBounded,
  getDistance,
  type positionMeta,
} from "../../../../scripts/distance";
import { useOverlay } from "./context/useOverlay";
import { getScrollBounds } from "../TranslationBar/TlContent";
import { getColorId } from "../../../../scripts/color";
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

  const { connectorActive, overlayMetas, overlayTransformsRef } = useOverlay();
  const t = overlayTransformsRef.current[id];

  if (!t.overlay || !t.side) return null;

  function getNearestPair(pos: positionMeta, ref: positionMeta) {
    const from = getAllDirPosition(pos).sort(
      (a, b) => getDistance(a, ref.p) - getDistance(b, ref.p)
    )[0];
    const to = getAllDirPosition(ref).sort(
      (a, b) => getDistance(a, pos.p) - getDistance(b, pos.p)
    )[0];

    const PAD = 7;

    return {
      from: getBounded(from, {
        s: { x: PAD, y: PAD },
        e: { x: windowSize.width - PAD, y: windowSize.height - PAD },
      }),
      to: getBounded(to, {
        s: { x: to.x, y: scrollBounds.y },
        e: {
          x: to.x,
          y: Math.min(scrollBounds.y + scrollBounds.h, windowSize.height - PAD),
        },
      }),
    };
  }

  const { from, to } = getNearestPair(t.overlay, t.side);

  const connectorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = connectorRef.current;
    if (!el) return;

    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const length = getDistance(from, to);
    const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;

    el.style.left = `${midX}px`;
    el.style.top = `${midY}px`;
    el.style.width = `${length}px`;
    el.style.transform = `
      translate(-50%, -50%)
      rotate(${angle}deg)
    `;
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

  return (
    <div
      ref={connectorRef}
      className="absolute z-10 rounded-full pointer-events-none transition-opacity duration-100"
      style={{
        height: 2,
        transformOrigin: "center",
        backgroundColor: `${color}${
          connectorActive && !isVisible ? "86" : "FF"
        }`,
        opacity: isVisible || connectorActive ? 1 : 0,
      }}
    >
      <div
        className="absolute top-1/2 rounded-full pointer-events-none"
        style={{
          width: 8,
          height: 8,
          left: 0,
          transform: "translate(-50%, -50%)",
          backgroundColor: color,
        }}
      />

      <div
        className="absolute top-1/2 rounded-full pointer-events-none"
        style={{
          width: 8,
          height: 8,
          right: 0,
          transform: "translate(50%, -50%)",
          backgroundColor: color,
        }}
      />
    </div>
  );
};

export default OverlayConnector;
