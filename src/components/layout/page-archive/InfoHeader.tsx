import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ItemData } from "../../../scripts/structs/item-data";
import { useRef } from "react";

const InfoHeader = ({ item }: { item: ItemData | null }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    containerRef.current?.scrollBy({
      left: direction == "left" ? -120 : 120,
      behavior: "smooth",
    });
  };

  return (
    <div
      className="flex flex-row items-center
      w-full h-[80px] p-4 overflow-hidden
      bg-[#BBE5FF] [.dark_&]:bg-[#003366]
      shadow-md shadow-black/10
      text-md text-shadow-sm"
    >
      <div className="flex flex-row overflow-auto items-center w-full h-full gap-4">
        <button
          className="flex justify-center items-center
            min-w-[40px] min-h-[40px] rounded-full
            bg-white [.dark_&]:bg-black
            hover:bg-[#225588] [.dark_&]:hover:bg-white
            hover:text-white [.dark_&]:hover:text-[#225588]
            shadow-md shadow-black/20 [.dark_&]:shadow-white/20
            transition-background duration-100"
          onClick={() => scroll("left")}
        >
          <ChevronLeft width={28} height={28} />
        </button>
        <div ref={containerRef} className="flex w-full overflow-hidden">
          <div className="flex flex-row justify-around items-center w-full gap-6">
            <div className="text-nowrap">
              <span className="font-bold">{"Title: "}</span>
              <span>{item?.title ?? "< null >"}</span>
            </div>
            <div className="text-nowrap">
              <span className="font-bold">{"Category: "}</span>
              <span>{item?.category ?? "< null >"}</span>
            </div>
            <div className="text-nowrap">
              <span className="font-bold">{"Sub Category: "}</span>
              <span>
                {item != null && item.sub_category != null
                  ? item.sub_category
                  : "< null >"}
              </span>
            </div>
            <div className="text-nowrap">
              <span className="font-bold">{"Description: "}</span>
              <span>{item?.description ?? "< null >"}</span>
            </div>
          </div>
        </div>
        <button
          className="flex justify-center items-center
            min-w-[40px] min-h-[40px] rounded-full
            bg-white [.dark_&]:bg-black
            hover:bg-[#225588] [.dark_&]:hover:bg-white
            hover:text-white [.dark_&]:hover:text-[#225588]
            shadow-md shadow-black/20 [.dark_&]:shadow-white/20
            transition-background duration-100"
          onClick={() => scroll("right")}
        >
          <ChevronRight width={28} height={28} />
        </button>
      </div>
    </div>
  );
};

export default InfoHeader;
