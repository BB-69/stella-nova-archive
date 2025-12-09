import { useEffect, useRef, useState } from "react";
import NovaTable from "/assets/nova-alphabet-table.jpg";
import Ruler from "./Ruler";

const Content = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      x = Math.max(0, Math.min(x, rect.width));
      y = Math.max(0, Math.min(y, rect.height));

      setCursor({
        x: Math.floor(x),
        y: Math.floor(y),
      });
    };

    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  return (
    <div className="flex min-w-full min-h-full justify-center items-center p-8">
      <div
        className="max-w-full max-h-full gap-6 overflow-hidden grid
        grid-cols-[16px_minmax(0,1fr)_16px]
        grid-rows-[16px_minmax(0,1fr)_16px]"
      >
        {/* Top */}
        <div></div>
        <Ruler orientation="horizontal" cursorPos={cursor.x} label={cursor.x} />
        <div></div>

        {/* Left */}
        <Ruler orientation="vertical" cursorPos={cursor.y} label={cursor.y} />

        {/* Center */}
        <div
          ref={containerRef}
          className="bg-white border border-gray-300
          transition-transform duration-300"
        >
          <img
            src={NovaTable}
            alt="Nova Table"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Right */}
        <Ruler orientation="vertical" cursorPos={cursor.y} />

        {/* Bottom */}
        <div></div>
        <Ruler orientation="horizontal" cursorPos={cursor.x} />
        <div></div>
      </div>
    </div>
  );
};

export default Content;
