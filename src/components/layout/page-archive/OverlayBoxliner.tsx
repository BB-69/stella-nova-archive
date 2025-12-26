import type { positionMeta } from "../../../scripts/distance";

const OverlayBoxliner = ({
  hovering,
  overlay,
}: {
  hovering: boolean;
  overlay: positionMeta;
}) => {
  return (
    <div
      className={`absolute pointer-events-none ${
        hovering && "border-1 border-dashed"
      }`}
      style={(() => {
        return {
          left: overlay.l,
          top: overlay.t,
          width: overlay.r - overlay.l,
          height: overlay.b - overlay.t,
        };
      })()}
    />
  );
};

export default OverlayBoxliner;
