import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import QMark from "/assets/fallback/question-mark.svg";
import Ruler from "./Ruler";
import { useDebugValue } from "../../../hooks/useDebugValue";
import type { ItemData } from "../../../scripts/structs/item-data";
import Overlay from "./Overlay";

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

      requestAnimationFrame(() =>
        setCursor({
          x: Math.floor(x),
          y: Math.floor(y),
        })
      );
    };

    window.addEventListener("mousemove", handlePointerMove);
    return () => window.removeEventListener("mousemove", handlePointerMove);
  }, []);

  const imgRef = useRef<HTMLImageElement>(null);
  const [resolution, setResolution] = useState({ w: 0, h: 0 }); // fixed
  const [display, setDisplay] = useState({ x: 0, y: 0, w: 0, h: 0 }); // display

  {
    const res = useMemo(
      () => `w: ${resolution.w.toFixed(0)}, h: ${resolution.h.toFixed(0)}`,
      [resolution]
    );
    useDebugValue("resolution", res, "/archive");
    const dis = useMemo(
      () =>
        `x: ${display.x.toFixed(0)}, y: ${display.y.toFixed(
          0
        )}, w: ${display.w.toFixed(0)}, h: ${display.h.toFixed(0)}`,
      [display]
    );
    useDebugValue("display", dis, "/archive");
  }

  useEffect(() => {
    if (item == null) return;

    setResolution({
      w: item.meta.width,
      h: item.meta.height,
    });
  }, [item]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const img = imgRef.current;
    if (!container || !img) return;

    const updateDisplay = () => {
      const rect = img.getBoundingClientRect();
      setDisplay({
        x: rect.x,
        y: rect.y,
        w: rect.width,
        h: rect.height,
      });
    };

    updateDisplay();

    const observer = new ResizeObserver(() => {
      updateDisplay();
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const imageOffset = useMemo(() => {
    if (!containerRef.current || !imgRef.current) {
      return { x: 0, y: 0 };
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imgRef.current.getBoundingClientRect();

    return {
      x: imageRect.left - containerRect.left,
      y: imageRect.top - containerRect.top,
    };
  }, [display]);

  return (
    <div
      className="max-w-full max-h-full
        p-8 gap-6 overflow-hidden grid
        grid-cols-[16px_minmax(0,1fr)]
        grid-rows-[16px_minmax(0,1fr)]"
    >
      {/* tl */}
      <div />

      {/* tr */}
      <Ruler orientation="horizontal" cursorPos={cursor.x} />

      {/* bl */}
      <Ruler orientation="vertical" cursorPos={cursor.y} />

      {/* br */}
      <div
        ref={containerRef}
        className="relative flex justify-center items-center w-full h-full"
      >
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

            requestAnimationFrame(() => {
              const rect = imgRef.current!.getBoundingClientRect();
              if (!rect) return;

              setDisplay({
                x: rect.x,
                y: rect.y,
                w: rect.width,
                h: rect.height,
              });
            });
          }}
          className="max-w-full max-h-full
          rounded-md outline-4 outline-black/30 [.dark_]:outline-white/30"
          alt={item != null && imgSrc ? item.title : "< null >"}
        />

        <Overlay
          item={item}
          resolution={resolution}
          display={display}
          offset={imageOffset}
        />
      </div>
    </div>
  );
};

export default Content;
