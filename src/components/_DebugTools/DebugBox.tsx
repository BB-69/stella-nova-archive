import {
  useState,
  useRef,
  useEffect,
  type MouseEvent,
  type ReactNode,
  useLayoutEffect,
} from "react";
import { motion, useMotionValue } from "framer-motion";
import type { position } from "../../scripts/distance";

interface Props {
  title: string;
  children: ReactNode;
}

export default function DebugBox({ title, children }: Props) {
  const subtitle = "DEBUGBOX";
  const storageKey = `collapsible-${subtitle}-${title}`;

  const [open, setOpen] = useState(() => {
    const saved = localStorage?.getItem(storageKey);
    if (saved !== null) {
      return saved === "true";
    }
    return true;
  });

  useEffect(() => {
    localStorage?.setItem(storageKey, open.toString());
  }, [open, storageKey]);

  const position = useRef({
    x: useMotionValue(20),
    y: useMotionValue(20),
  });
  const [isDragging, setIsDragging] = useState(false);

  const offset = useRef<position>({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.current.x.get(),
      y: e.clientY - position.current.y.get(),
    };
  };

  const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
    if (!isDragging || !boxRef.current) return;

    const rect = boxRef.current!.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    position.current.x.set(Math.min(Math.max(0, newX), maxX));
    position.current.y.set(Math.min(Math.max(0, newY), maxY));
  };

  useLayoutEffect(() => {
    if (!boxRef.current) return;

    const ro = new ResizeObserver(() => {
      const rect = boxRef.current!.getBoundingClientRect();
      // document size to not include scrollbar in overall size
      const maxX = document.documentElement.clientWidth - rect.width;
      const maxY = document.documentElement.clientHeight - rect.height;

      position.current.x.set(Math.min(position.current.x.get(), maxX));
      position.current.y.set(Math.min(position.current.y.get(), maxY));
    });

    ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, [open]);

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <motion.div
      className="floating-box overflow-auto"
      style={{
        x: position.current.x,
        y: position.current.y,
        width: open ? "200px" : "108px",
        maxHeight: "90vh",
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      ref={boxRef}
    >
      <div className="flex flex-row justify-between">
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: "80%",
            fontWeight: 700,
            cursor: "grab",
            marginBottom: open ? "8px" : "0",
            opacity: 0.8,
          }}
        >
          ⠿ {title}
        </div>
        <button
          className="w-[20px] h-[20px] rounded-[3px] cursor-pointer
          flex justify-center items-center
          text-[var(--t-c)] [.dark_&]:text-[--var(t-c-dark)] text-[14px]/[20px]
          hover:bg-[var(--bg-hover)] [.dark_&]:hover:bg-[var(--bg-hover-dark)]"
          onClick={() => setOpen((v) => !v)}
          aria-label="toggle section"
        >
          <span className="pb-[1px]">{open ? "−" : "+"}</span>
        </button>
      </div>
      {open && <div>{children}</div>}
    </motion.div>
  );
}
