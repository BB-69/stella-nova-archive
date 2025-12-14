import { useEffect, useMemo, useRef, useState } from "react";
import QMark from "/assets/fallback/question-mark.svg";
import Ruler from "./Ruler";
import { useDebugValue } from "../../../hooks/useDebugValue";
import type { ItemData } from "../../../scripts/structs/item-data";

const Content = ({
  item,
  imgSrc,
}: {
  item: ItemData | null;
  imgSrc: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      setCursor({
        x: Math.floor(x),
        y: Math.floor(y),
      });
    };

    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  const imgRef = useRef<HTMLImageElement>(null);
  const [resolution, setResolution] = useState({ w: 0, h: 0 }); // fixed
  const [display, setDisplay] = useState({ w: 0, h: 0 }); // display

  {
    const res = useMemo(
      () => `w: ${resolution.w.toFixed(0)}, h: ${resolution.h.toFixed(0)}`,
      [resolution]
    );
    useDebugValue("resolution", res, "/archive");
    const dis = useMemo(
      () => `w: ${display.w.toFixed(0)}, h: ${display.h.toFixed(0)}`,
      [display]
    );
    useDebugValue("display", dis, "/archive");
  }

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const updateSizes = () => {
      setResolution({
        w: img.naturalWidth,
        h: img.naturalHeight,
      });

      const rect = img.getBoundingClientRect();
      setDisplay({
        w: rect.width,
        h: rect.height,
      });
    };

    if (img.complete) {
      updateSizes();
    } else {
      img.onload = updateSizes;
    }

    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  return (
    <div className="flex min-w-full min-h-full justify-center items-center p-8">
      <div
        className="max-w-full max-h-full gap-6 overflow-hidden grid
        grid-cols-[16px_minmax(0,1fr)]
        grid-rows-[16px_minmax(0,1fr)]"
      >
        {/* tl */}
        <div></div>

        {/* tr */}
        <Ruler
          orientation="horizontal"
          cursorPos={cursor.x}
          imageResolution={resolution.w}
          displaySize={display.w}
        />

        {/* bl */}
        <Ruler
          orientation="vertical"
          cursorPos={cursor.y}
          imageResolution={resolution.w}
          displaySize={display.w}
        />

        {/* br */}
        <div ref={containerRef} className="flex flex-col max-w-full max-h-full">
          <img
            ref={imgRef}
            src={` ${imgSrc || ""}`}
            onError={(e) => {
              const img = e.currentTarget;
              img.onerror = null;
              if (!img.src.includes(QMark)) {
                img.src = QMark;
                img.classList.add("[.dark_&]:invert");
              }
            }}
            onLoad={(e) => {
              const img = e.currentTarget;
              if (!img.src.includes(QMark)) {
                img.classList.remove("[.dark_&]:invert");
              }
            }}
            className="p-1 w-full h-full object-contain"
            alt={item != null && imgSrc ? item.title : "< null >"}
          />
        </div>
      </div>
    </div>
  );
};

export default Content;
