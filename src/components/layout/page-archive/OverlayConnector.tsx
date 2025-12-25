import { useIsMd } from "../../../hooks/useIsMd";
import { getDistance } from "../../../scripts/distance";
import { useOverlayContext } from "./OverlayContext";
import { getScrollBounds } from "./TranslationBar";

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
  const midPos = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const length = getDistance(from, to);
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

  const { overlayMetas } = useOverlayContext();

  const isMd = useIsMd();

  const isEdge = () => {
    const scrollBounds = getScrollBounds();

    return (
      to.y < scrollBounds.y + 1 || to.y > scrollBounds.y + scrollBounds.h - 1
    );
  };

  return (
    <div
      key={id}
      className="absolute z-10 rounded-full"
      style={{
        left: midPos.x,
        top: midPos.y,
        width: length,
        height: 2,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        transformOrigin: "center",
        backgroundColor: overlayMetas[id].color ?? "#676767",
        opacity: hovering && !isMd && !isEdge() ? 1 : 0,
      }}
    >
      <div
        className="absolute top-1/2 rounded-full"
        style={{
          width: 8,
          height: 8,
          left: 0,
          transform: "translate(-50%, -50%)",
          backgroundColor: overlayMetas[id].color ?? "#676767",
        }}
      />

      {/* Right circle */}
      <div
        className="absolute top-1/2 rounded-full"
        style={{
          width: 8,
          height: 8,
          right: 0,
          transform: "translate(50%, -50%)",
          backgroundColor: overlayMetas[id].color ?? "#676767",
        }}
      />
    </div>
  );
};

export default OverlayConnector;
