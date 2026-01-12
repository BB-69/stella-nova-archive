import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useArchive } from "./context/useArchive";
import ButtonDropdown from "../../common/button-dropdown";
import { useHorizontalScroll } from "../../../hooks/useHorizontalScroll";
import useOverlayConfig from "./useOverlayConfig";

const InfoHeader = () => {
  const { item } = useArchive();
  const configOptions = useOverlayConfig();

  const containerRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({
    atLeft: true,
    atRight: true,
  });

  const [holdScrolling, setHoldScrolling] = useState<-1 | 0 | 1>(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf: number;
    const SCROLL_SPEED = 6;

    const handleScroll = () => {
      if (holdScrolling === 0) return;
      containerRef.current?.scrollBy({
        left: holdScrolling * SCROLL_SPEED,
      });
      if (
        !(holdScrolling === -1 && edges.atLeft) &&
        !(holdScrolling === 1 && edges.atRight)
      )
        raf = requestAnimationFrame(handleScroll);
    };

    const handlePointerUp = () => {
      setHoldScrolling(0);
      cancelAnimationFrame(raf);
    };

    raf = requestAnimationFrame(handleScroll);

    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", () => handlePointerUp);
  }, [holdScrolling]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleEdges = () => {
      const atLeft = el.scrollLeft === 0;
      const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

      setEdges({ atLeft: atLeft, atRight: atRight });
    };

    handleEdges();

    el.addEventListener("scroll", handleEdges);
    return () => el.removeEventListener("scroll", handleEdges);
  }, [containerRef.current?.scrollWidth]);

  useHorizontalScroll(containerRef);

  return (
    <div
      className="group-selectable flex flex-row items-center
      w-full h-[60px] overflow-hidden
      bg-[#BBE5FF] [.dark_&]:bg-[#003366]
      shadow-md shadow-black/10
      text-md text-shadow-sm"
    >
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-row overflow-hidden items-center w-full h-full relative">
          <button
            className={`absolute left-0
            group-unselectable flex justify-center items-center
            bg-white [.dark_&]:bg-black
            hover:bg-[#225588] [.dark_&]:hover:bg-white
            hover:text-white [.dark_&]:hover:text-[#225588]
            transition-color duration-200`}
            onPointerDown={(e) => {
              e.stopPropagation();
              setHoldScrolling(-1);
            }}
          >
            <ChevronLeft
              style={{
                width: edges.atLeft ? 0 : 48,
                height: 60,
                transition: "width .2s ease",
              }}
            />
          </button>
          <div className="w-full h-full px-4">
            <div
              ref={containerRef}
              className="flex w-full h-full overflow-x-auto overflow-y-hidden no-scrollbar"
            >
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
          </div>
          <button
            className="absolute right-0
            group-unselectable flex justify-center items-center
            bg-white [.dark_&]:bg-black
            hover:bg-[#225588] [.dark_&]:hover:bg-white
            hover:text-white [.dark_&]:hover:text-[#225588]
            transition-color duration-200"
            onPointerDown={(e) => {
              e.stopPropagation();
              setHoldScrolling(1);
            }}
          >
            <ChevronRight
              style={{
                width: edges.atRight ? 0 : 48,
                height: 60,
                transition: "width .2s ease",
              }}
            />
          </button>
        </div>
        <ButtonDropdown
          icon={<Wrench width={28} height={28} />}
          divs={configOptions}
        />
      </div>
    </div>
  );
};

export default InfoHeader;
