import { memo, useEffect, useRef, useState, type RefObject } from "react";

const BrowseItemModal = ({
  onHover,
  parentRef,
  description,
}: {
  onHover: boolean;
  parentRef: RefObject<HTMLDivElement | null>;
  description: string;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  useEffect(() => {
    if (!onHover || !parentRef?.current || !modalRef.current) {
      return;
    }

    const parent = parentRef.current;
    const modal = modalRef.current;

    const parentRect = parent.getBoundingClientRect();
    const modalRect = modal.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // default right side
    const pad = 0;
    let left = parentRect.right + pad;
    let top = parentRect.top;

    // if overflow right, display left
    if (left + modalRect.width > viewportWidth) {
      left = parentRect.left - modalRect.width - pad;
    }

    // cap bounds
    const capPadX = 16;
    if (left < 0 + capPadX) left = capPadX;
    if (left + modalRect.width > viewportWidth - capPadX)
      left = viewportWidth - modalRect.width - capPadX;

    const viewportHeight = window.innerHeight;
    if (top + modalRect.height > viewportHeight)
      top = Math.max(0, viewportHeight - modalRect.height);

    setPos({ top, left });
  }, [onHover, parentRef]);

  return (
    <div
      ref={modalRef}
      className={`
        absolute z-10 flex flex-col transition-opacity duration-150
        p-3 rounded-[20px] border-2 border-black [.dark_&]:border-white
        shadow-xl shadow-black/50 [.dark_&]:shadow-white/50
        bg-white [.dark_&]:bg-black
      `}
      style={{
        top: pos.top,
        left: pos.left,
        position: "fixed",
        opacity: onHover ? 1 : 0,
        pointerEvents: onHover ? "auto" : "none",
      }}
    >
      <div className="w-[180px] pb-1 overflow-hidden">
        <h3
          className="flex justify-between items-top font-semibold text-lg
        pb-1 border-b border-black/30 [.dark_&]:border-white/30
        text-sm"
        >
          Description
        </h3>
        <span
          className="mt-1.5 px-1 text-xs opacity-80
          leading-tight block break-words"
        >
          {description ?? "< Untitled >"}
        </span>
      </div>
    </div>
  );
};

export default memo(BrowseItemModal);
