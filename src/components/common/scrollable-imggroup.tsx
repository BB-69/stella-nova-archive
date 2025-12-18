import { useLayoutEffect, useRef, useState } from "react";
import { useDebugValue } from "../../hooks/useDebugValue";
import { getImageDimensions } from "../../scripts/image";

const ScrollableImgGroup = ({
  srcs,
}: {
  srcs: { src: string; alt?: string }[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxRes = useRef<number>(0);
  const res = useRef<number>(0);
  const [isCol, setIsCol] = useState<boolean>(false);

  {
    useDebugValue("isCol", isCol, "/browse");
  }

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    async function initialize() {
      let max = 0;
      await Promise.all(
        Object.values(srcs).map(async ({ src }) => {
          const { width, height } = await getImageDimensions(src);
          max = Math.max(max, width / height);
        })
      );
      maxRes.current = max;

      checkAndUpdateLayout();
    }

    function checkAndUpdateLayout() {
      const containerRect = container?.getBoundingClientRect();
      if (!containerRect) return;

      res.current = containerRect.width / containerRect.height;

      const shouldBeCol = res.current < maxRes.current;
      setIsCol((prev) => (prev !== shouldBeCol ? shouldBeCol : prev));
    }

    const observer = new ResizeObserver(() => {
      checkAndUpdateLayout();
    });

    observer.observe(container);

    initialize();

    return () => {
      observer.disconnect();
    };
  }, [srcs]);

  return (
    <div
      ref={containerRef}
      className={`flex w-full h-full p-3 gap-4 ${
        isCol
          ? `overflow-x-hidden overflow-y-auto flex-col`
          : `overflow-x-auto overflow-y-hidden flex-row`
      }`}
    >
      {srcs.map(({ src, alt }) => {
        return (
          <img
            key={src}
            src={src}
            alt={alt}
            className="max-w-full max-h-full
            rounded-md outline-4 outline-black/30 [.dark_]:outline-white/30"
          />
        );
      })}
    </div>
  );
};

export default ScrollableImgGroup;
