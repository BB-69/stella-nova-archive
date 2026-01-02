import useWindowSize from "../../../../hooks/useWindowSize";
import { getBounded, type positionMeta } from "../../../../scripts/distance";
import { useOverlayContext } from "./context/OverlayContext";

const OverlayBoxliner = ({
  id,
  hovering,
}: {
  id: string;
  hovering: boolean;
}) => {
  const windowSize = useWindowSize();
  const { overlayTransformsRef } = useOverlayContext();
  const overlay = overlayTransformsRef.current[id].overlay;

  if (!overlay) return;

  function getBoundedOverlay(o: positionMeta): positionMeta {
    const PAD = 0;
    return {
      p: getBounded(o.p, {
        s: { x: PAD, y: PAD },
        e: { x: windowSize.width - PAD, y: windowSize.height - PAD },
      }),
      t: Math.max(PAD, Math.min(windowSize.height - PAD, o.t)),
      b: Math.max(PAD, Math.min(windowSize.height - PAD, o.b)),
      l: Math.max(PAD, Math.min(windowSize.width - PAD, o.l)),
      r: Math.max(PAD, Math.min(windowSize.width - PAD, o.r)),
    };
  }

  const bounded = getBoundedOverlay(overlay);

  return (
    <div
      className={`absolute pointer-events-none ${
        hovering && "border-1 border-dashed"
      }`}
      style={(() => {
        return {
          left: bounded.l,
          top: bounded.t,
          width: bounded.r - bounded.l,
          height: bounded.b - bounded.t,
        };
      })()}
    />
  );
};

export default OverlayBoxliner;
