import { useEffect, useState, useMemo, useRef } from "react";
import { useIsChanging } from "../../../hooks/useIsChanging";
import { useIsMd } from "../../../hooks/useIsMd";
import { getDistance } from "../../../scripts/distance";
import { useOverlayContext } from "./OverlayContext";
import { getScrollBounds } from "./TranslationBar/TlContent";
import { getColorId } from "../../../scripts/color";

const OverlayConnector = ({
  id,
  from,
  to,
  hovering,
}: {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  hovering: boolean;
}) => {
  const isScrolling = useIsChanging(to.y, 50);
  const isScrollingDelay = useIsChanging(to.y, 100);

  const transformRef = useRef({ midPos: { x: 0, y: 0 }, length: 0, angle: 0 });
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (isScrolling) return;

    transformRef.current = {
      midPos: { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 },
      length: getDistance(from, to),
      angle: (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI,
    };

    forceUpdate({});
  }, [from.x, from.y, to.x, to.y, isScrolling]);

  const { overlayMetas } = useOverlayContext();
  const isMd = useIsMd();

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
    () => hovering && !isMd && !isEdge && !isScrollingDelay,
    [hovering, isMd, isEdge, isScrollingDelay]
  );

  const { midPos, length, angle } = transformRef.current;

  return (
    <div
      key={id}
      className="absolute z-10 rounded-full transition-opacity duration-100"
      style={{
        left: midPos.x,
        top: midPos.y,
        width: length,
        height: 2,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        transformOrigin: "center",
        backgroundColor: color,
        opacity: isVisible ? 1 : 0,
        willChange: isScrolling ? "transform" : "auto",
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
    </div>
  );
};

export default OverlayConnector;
