import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useArchiveContext } from "./context/ArchiveContext";

const InfoHeader = () => {
  const { item } = useArchiveContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({
    atLeft: false,
    atRight: false,
  });

  const scroll = (direction: "left" | "right") => {
    containerRef.current?.scrollBy({
      left: direction == "left" ? -120 : 120,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const atLeft = el.scrollLeft === 0;
      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      setEdges({ atLeft: atLeft, atRight: atRight });
    };

    handleScroll();

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [containerRef.current?.scrollWidth]);

  return (
    <div
      className="group-selectable flex flex-row items-center
      w-full h-[80px] p-4 overflow-hidden
      bg-[#BBE5FF] [.dark_&]:bg-[#003366]
      shadow-md shadow-black/10
      text-md text-shadow-sm"
    >
      <div className="flex flex-row overflow-hidden items-center w-full h-full gap-4">
        <button
          className={`group-unselectable flex justify-center items-center
            min-w-[40px] min-h-[40px] rounded-full
            bg-white [.dark_&]:bg-black
            ${
              !edges.atLeft
                ? `hover:bg-[#225588] [.dark_&]:hover:bg-white
                hover:text-white [.dark_&]:hover:text-[#225588]`
                : "opacity-40"
            }
            shadow-md shadow-black/20 [.dark_&]:shadow-white/20
            transition-background duration-100`}
          onClick={() => (!edges.atLeft ? scroll("left") : {})}
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
                {item && item.sub_category.length > 0
                  ? item.sub_category.join(", ")
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
          className={`group-unselectable flex justify-center items-center
            min-w-[40px] min-h-[40px] rounded-full
            bg-white [.dark_&]:bg-black
            ${
              !edges.atRight
                ? `hover:bg-[#225588] [.dark_&]:hover:bg-white
                hover:text-white [.dark_&]:hover:text-[#225588]`
                : "opacity-40"
            }
            shadow-md shadow-black/20 [.dark_&]:shadow-white/20
            transition-background duration-100`}
          onClick={() => (!edges.atRight ? scroll("right") : {})}
        >
          <ChevronRight width={28} height={28} />
        </button>
      </div>
    </div>
  );
};

export default InfoHeader;
