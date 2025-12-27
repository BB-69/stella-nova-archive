import { useLayoutEffect, useRef, useState } from "react";
import { useOverlayContext } from "./OverlayContext";
import type { positionMeta } from "../../../scripts/distance";
import { getColorId } from "../../../scripts/color";

const Ruler = ({
  orientation,
  cursorPos,
}: {
  orientation: "horizontal" | "vertical";
  cursorPos: number;
}) => {
  const isHorizontal = orientation === "horizontal";
  const { overlayActive, overlayMetas, overlayTransforms } =
    useOverlayContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setOffset(isHorizontal ? rect.left : rect.top);
  }, [isHorizontal]);

  return (
    <div
      ref={containerRef}
      className={`
        relative bg-gray-200 border-gray-400 shadow-lg shadow-black/40
        select-none text-[10px] overflow-hidden
        ${isHorizontal ? "border-b" : "border-r"}
      `}
      style={isHorizontal ? { width: "auto" } : { height: "auto" }}
    >
      {/* --- Overlay marker --- */}
      {Object.entries(overlayTransforms)
        .sort(([_a, a], [_b, b]) => {
          if (!a.overlay || !b.overlay) return 0;

          function getLength(meta: positionMeta) {
            return isHorizontal ? meta.r - meta.l : meta.b - meta.t;
          }

          return getLength(b.overlay) - getLength(a.overlay);
        })
        .map(([id, { overlay }]) => {
          if (!overlay) return;

          const start = (isHorizontal ? overlay.l : overlay.t) - offset;
          const end = (isHorizontal ? overlay.r : overlay.b) - offset;

          return (
            <div
              key={id}
              className="absolute transition-opacity duration-100"
              style={
                isHorizontal
                  ? {
                      left: start,
                      width: end - start,
                      top: 0,
                      bottom: 0,
                      backgroundColor:
                        overlayMetas[id]?.color ?? getColorId(id),
                      opacity:
                        overlayActive || overlayMetas[id]?.hover ? 100 : 0,
                    }
                  : {
                      top: start,
                      height: end - start,
                      left: 0,
                      right: 0,
                      backgroundColor:
                        overlayMetas[id]?.color ?? getColorId(id),
                      opacity:
                        overlayActive || overlayMetas[id]?.hover ? 100 : 0,
                    }
              }
            />
          );
        })}

      {/* --- Cursor marker --- */}
      <div
        className={`
          absolute bg-red-500 pointer-events-none outline-white
          ${
            isHorizontal
              ? "top-0 bottom-0 w-[2px] outline-[1.5px]"
              : "left-0 right-0 h-[2px] outline-[1.5px]"
          }
        `}
        style={isHorizontal ? { left: cursorPos } : { top: cursorPos }}
      />
    </div>
  );
};

export default Ruler;
