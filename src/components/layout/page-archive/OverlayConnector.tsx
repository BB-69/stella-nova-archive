import { useDebugValue } from "../../../hooks/useDebugValue";
import { getDistance } from "../../../scripts/distance";

const OverlayConnector = ({
  id,
  from,
  to,
}: {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}) => {
  const midPos = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  const length = getDistance(from, to);
  const angle = Math.atan2(to.y - from.y, to.x - from.x) * (180 / Math.PI);

  {
    useDebugValue(
      `overlayConnect-${id}`,
      `from: [${from.x.toFixed(2)}, ${from.y.toFixed(2)}] — to: [${to.x.toFixed(
        2
      )}, ${to.y.toFixed(2)}] — midPos: [${midPos.x.toFixed(
        2
      )}, ${midPos.y.toFixed(2)}] — length: ${length.toFixed(2)}`,
      "/archive"
    );
  }

  return (
    <div
      key={id}
      className="absolute z-[100] bg-white border-1 border-black"
      style={{
        left: midPos.x,
        top: midPos.y,
        width: length,
        height: 5,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        transformOrigin: "center",
      }}
    >
      {/* <div className="relative w-full h-full">
        <div className=""></div>
      </div> */}
    </div>
  );
};

export default OverlayConnector;
