import {
  useState,
  useRef,
  useEffect,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  children: ReactNode;
}

interface Position {
  x: number;
  y: number;
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

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (headerRef.current) {
      if (open) {
        headerRef.current.classList.remove("fold");
      } else {
        headerRef.current.classList.add("fold");
      }
    }
    localStorage?.setItem(storageKey, open.toString());
  }, [open, storageKey]);

  const [position, setPosition] = useState<Position>({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef<Position>({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent | globalThis.MouseEvent) => {
    if (!isDragging || !boxRef.current) return;

    const newX = e.clientX - offset.current.x;
    const newY = e.clientY - offset.current.y;

    const box = boxRef.current;
    const maxX = window.innerWidth - box.offsetWidth;
    const maxY = window.innerHeight - box.offsetHeight;

    setPosition({
      x: Math.min(Math.max(0, newX), maxX),
      y: Math.min(Math.max(0, newY), maxY),
    });
  };

  useEffect(() => {
    if (!boxRef.current) return;

    const box = boxRef.current;
    const maxX = window.innerWidth - box.offsetWidth;
    const maxY = window.innerHeight - box.offsetHeight;

    setPosition((prev) => ({
      x: Math.min(prev.x, maxX),
      y: Math.min(prev.y, maxY),
    }));
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
        left: position.x,
        top: position.y,
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
