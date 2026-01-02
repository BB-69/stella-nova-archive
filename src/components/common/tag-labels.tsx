import { useRef, useEffect, useState, useMemo } from "react";
import { getTagColor } from "../../scripts/structs/tag-data";
import { useDebugValue } from "../_DebugTools/useDebugValue";
import { getUniqueId } from "../../scripts/id-generator";

const TagLabels = ({ tags }: { tags?: string[] }) => {
  if (!tags || tags.length === 0) return null;

  const thisId = useMemo(() => getUniqueId("tag_labels"), []);

  const tagItems = tags.map((t) => {
    const c = getTagColor(t.split("-")[0]);
    return (
      <div key={t} className="pr-1">
        <div
          className={`
            tag-${thisId}-${t} px-1 border-1 rounded-full
            shadow-sm shadow-white/80 [.dark_&]:shadow-black/80
          `}
          style={{
            borderColor: `var(--border-color, ${c.col1})`,
            backgroundColor: `var(--bg-color, ${c.col2})`,
            color: `var(--text-color, ${c.col1})`,
          }}
        >
          {t}
        </div>

        <style>{`
          .tag-${thisId}-${t} {
            --border-color: ${c.col1};
            --bg-color: ${c.col2};
            --text-color: ${c.col1};
          }
          .dark .tag-${thisId}-${t} {
            --border-color: ${c.col2};
            --bg-color: ${c.col1};
            --text-color: ${c.col2};
          }
        `}</style>
      </div>
    );
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isOverflow, setIsOverflow] = useState<boolean>(false);
  const [scrollTime, setScrollTime] = useState<number>(10);
  const percent = useMemo(() => 150 / scrollTime, [scrollTime]);
  const speed = 100;

  if (tags.length > 2) {
    useDebugValue("scrollWidth", scrollRef.current?.offsetWidth, "/browse");
    useDebugValue("trackWidth", trackRef.current?.scrollWidth, "/browse");
    useDebugValue("scrollTime", scrollTime, "/browse");
    useDebugValue("kframe%", percent, "/browse");
  }

  useEffect(() => {
    if (!trackRef.current) return;

    const trackWidth = trackRef.current.scrollWidth;
    const time = trackWidth / speed;
    setScrollTime(time);

    if (!scrollRef.current) return;
    const scrollWidth = scrollRef.current.clientWidth;
    setIsOverflow(trackWidth > scrollWidth);
  }, [tags]);

  return (
    <div className={`tag-scroller-${thisId}`} ref={scrollRef}>
      <div
        className={`tag-track-${thisId} flex flex-row text-[10px] font-bold`}
        ref={trackRef}
      >
        {tagItems}
        {isOverflow && tagItems}
      </div>

      <style>{`
        .tag-scroller-${thisId} {
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }
        .tag-track-${thisId} {
          display: inline-flex;
          --scroll-time: ${scrollTime}s;
          animation: ${
            isOverflow ? `scroll-${thisId}` : ""
          } var(--scroll-time) linear infinite;
        }
        @keyframes scroll-${thisId} {
          0% {
            transform: translateX(0);
          }
          ${percent}% {
            transform: translateX(0);
          }
          99.9999% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TagLabels;
