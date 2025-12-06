import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

const BrowseItemModal = ({
  onHover,
  parentRef,
  children,
}: {
  onHover: boolean;
  parentRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{
    top: number;
    left: number;
    visibility: React.CSSProperties["visibility"];
  }>({ top: 0, left: 0, visibility: "hidden" });

  useEffect(() => {
    if (!onHover || !parentRef?.current || !modalRef.current) {
      setPos((p) => ({ ...p, visibility: "hidden" }));
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
    if (left < 0) left = 0;
    if (left + modalRect.width > viewportWidth)
      left = viewportWidth - modalRect.width;

    const viewportHeight = window.innerHeight;
    if (top + modalRect.height > viewportHeight)
      top = Math.max(0, viewportHeight - modalRect.height);

    setPos({ top, left, visibility: "visible" });
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
        visibility: pos.visibility,
        position: "fixed",
        opacity: pos.visibility === "visible" ? 1 : 0,
        pointerEvents: onHover ? "auto" : "none",
      }}
    >
      {children}
    </div>
  );
};

export default BrowseItemModal;
