import { useRef, memo } from "react";
import { useNavigate } from "react-router-dom";
import HighlightedText from "../../../common/highlighted-text";
import QMark from "/assets/fallback/question-mark.svg";
import { useSearchQuery } from "../../context/useSearchQuery";

const BrowseImg = ({
  name,
  url,
  imgSrc,
}: {
  name: string;
  url: string;
  imgSrc: string;
}) => {
  const browseItemRef = useRef<HTMLDivElement>(null);

  const search = useSearchQuery();
  const navigate = useNavigate();

  const startIdx = url.search("/data/");
  const endIdx = url.search(".json");
  const id =
    startIdx != -1 && endIdx != -1 ? url.substring(startIdx + 6, endIdx) : null;

  return (
    <div
      ref={browseItemRef}
      className="group flex flex-col p-2 h-full w-[160px]
      transition-colors duration-200 bg-gradient-to-br
      from-white to-white [.dark_&]:from-black [.dark_&]:to-black
      hover:from-blue-600 hover:to-purple-600
      [.dark_&]:hover:from-blue-700 [.dark_&]:hover:to-purple-700
      rounded-xl border-2
      cursor-pointer"
      onClick={() => navigate(`/archive?id=${id}`)}
    >
      <h3
        className="flex justify-between items-top font-semibold text-md
        pb-1 border-b border-black/30 [.dark_&]:border-white/30
        group-hover:border-white/30 group-hover:text-white"
      >
        {name ? (
          <HighlightedText text={name} highlight={search.query} />
        ) : (
          "< Untitled >"
        )}
      </h3>
      <div
        className="mt-2 flex w-full h-[105px] rounded-lg
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
          alt={name}
        />
      </div>
    </div>
  );
};

export default memo(BrowseImg);
