import { memo, useRef, useState } from "react";
import type { ItemData } from "../../../scripts/structs/item-data";
import HighlightedText from "../../common/highlighted-text";
import TagLabels from "../../common/tag-labels";
import { useSearchContext } from "../context/SearchContext";
import QMark from "/assets/fallback/question-mark.svg";
import BrowseItemModal from "./BrowseItemModal";
import { CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BrowseItem = ({
  item,
  url,
  imgSrc,
}: {
  item: ItemData;
  url: string;
  imgSrc: string;
}) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const browseItemRef = useRef<HTMLDivElement>(null);
  const { searchQuery } = useSearchContext();

  const navigate = useNavigate();

  const startIdx = url.search("/data/");
  const endIdx = url.search(".json");
  const id =
    startIdx != -1 && endIdx != -1 ? url.substring(startIdx + 6, endIdx) : null;

  return (
    <div
      ref={browseItemRef}
      className="group flex flex-col p-4 h-full w-[220px]
      transition-colors duration-200 bg-gradient-to-br
      from-white to-white [.dark_&]:from-black [.dark_&]:to-black
      hover:from-blue-600 hover:to-purple-600
      [.dark_&]:hover:from-blue-700 [.dark_&]:hover:to-purple-700
      rounded-xl shadow-lg shadow-black/20 [.dark_&]:shadow-white/20
      cursor-pointer"
      onClick={() => navigate(`/archive?id=${id}`)}
    >
      <h3
        className="flex justify-between items-top font-semibold text-lg
        pb-1 border-b border-black/30 [.dark_&]:border-white/30
        group-hover:border-white/30 group-hover:text-white"
      >
        {item.title ? (
          <HighlightedText text={item.title} highlight={searchQuery} />
        ) : (
          "< Untitled >"
        )}
        <div
          className="flex justify-center items-center
          w-[28px] h-[28px] rounded-full opacity-60 hover:opacity-100
          hover:border-0 hover:bg-white hover:text-black"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <CircleAlert />
        </div>
      </h3>
      <div>
        <TagLabels tags={[item.category, ...item.sub_category]} />
      </div>
      <div
        className="mt-2 flex w-full h-[135px] rounded-lg
        border-x-2 border-black/30 [.dark_&]:border-white/30
        group-hover:border-white/30"
      >
        <img
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
          className="p-1 w-auto h-auto object-contain"
          alt={item.title}
        />
      </div>

      <BrowseItemModal
        onHover={hovered}
        parentRef={browseItemRef}
        description={item.description}
      />
    </div>
  );
};

export default memo(BrowseItem);
