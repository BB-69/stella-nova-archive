import type { ItemData } from "../../../scripts/structs/item-data";
import HighlightedText from "../../common/highlighted-text";
import TagLabels from "../../common/tag-labels";
import { useSearchContext } from "./SearchContext";
import QMark from "/assets/fallback/question-mark.svg";

const BrowseItem = ({ item, imgSrc }: { item: ItemData; imgSrc: string }) => {
  const { searchQuery } = useSearchContext();

  return (
    <div
      className="group flex flex-col p-4 h-full w-[220px]
      transition-colors duration-200 bg-gradient-to-br
      from-white to-white [.dark_&]:from-black [.dark_&]:to-black
      hover:from-blue-600 hover:to-purple-600
      [.dark_&]:hover:from-blue-700 [.dark_&]:hover:to-purple-700
      rounded-xl shadow-lg shadow-black/20 [.dark_&]:shadow-white/20
      cursor-pointer"
    >
      <h3
        className="font-semibold text-lg
        pb-1 border-b border-black/30 [.dark_&]:border-white/30
        group-hover:border-white/30 group-hover:text-white"
      >
        {item.title ? (
          <HighlightedText text={item.title} highlight={searchQuery} />
        ) : (
          "< Untitled >"
        )}
      </h3>
      <div>
        <TagLabels tags={[item.category, ...(item.sub_category ?? [])]} />
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
    </div>
  );
};

export default BrowseItem;
