import { motion, type MotionValue } from "framer-motion";
import { useOverlay } from "../layout/page-archive/Overlay/context/useOverlay";
import { useIsMovingCursor } from "../../hooks/useIsMovingCursor";

const Guide = ({
  orientation,
  pos,
}: {
  orientation: "horizontal" | "vertical";
  pos: MotionValue<number>;
}) => {
  const isHorizontal = orientation === "horizontal";
  const { cursorGuideMode } = useOverlay();

  const isMovingCursor = useIsMovingCursor();

  return (
    <div className="z-[5] absolute inset-0 overflow-hidden pointer-events-none">
      <div className="relative w-full h-full">
        <motion.div
          className={`
            absolute pointer-events-none
            ${isHorizontal ? "inset-y-0 w-[2px]" : "inset-x-0 h-[2px]"}
            transition-opacity duration-100
          `}
          style={{
            ...(isHorizontal ? { left: pos } : { top: pos }),
            opacity:
              cursorGuideMode === "always" ||
              (cursorGuideMode === "onMove" ? isMovingCursor : false)
                ? 1
                : 0,
            backgroundImage: isHorizontal
              ? `
              repeating-linear-gradient(
                to bottom,
                white 2px 6px,
                transparent 6px 14px
              ),
              repeating-linear-gradient(
                to bottom,
                transparent 0 8px,
                red 8px 12px
              )
            `
              : `
              repeating-linear-gradient(
                to right,
                white 2px 6px,
                transparent 6px 14px
              ),
              repeating-linear-gradient(
                to right,
                transparent 0 8px,
                red 8px 12px
              )
            `,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
          }}
        />
      </div>
    </div>
  );
};

export default Guide;
