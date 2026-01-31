import { useState, useRef, useEffect } from "react";
import {
  type FetchedFile,
  FetchFilesFromFolder,
} from "../../../../scripts/database-loader";
import { isItemData } from "../../../../scripts/structs/item-data";
import { useDebugValue } from "../../../_DebugTools/useDebugValue";
import { useImageSearchQuery } from "../context/useImageSearchQuery";
import BrowseImg from "./BrowseImg";

const ImgBrowser = ({
  handleImageSelect,
}: {
  handleImageSelect: (name: string, src: string) => void;
}) => {
  const [data, setData] = useState<FetchedFile[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);

  const BATCH_SIZE = 5;
  const batchIndex = useRef(0);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useImageSearchQuery();

  /* --- FETCH BATCH --- */
  async function loadBatch() {
    if (isLoadingMore || noMoreData) return;

    setIsLoadingMore(true);

    const res = await FetchFilesFromFolder(
      "assets/",
      "webp",
      batchIndex.current,
      BATCH_SIZE,
    );

    if (!res || res.length === 0) {
      setNoMoreData(true);
      setIsLoadingMore(false);
      return;
    }

    setData((prev) => [...prev, ...res]);
    batchIndex.current += BATCH_SIZE;

    if (res.length < BATCH_SIZE) {
      setNoMoreData(true);
    }

    setIsLoadingMore(false);
  }

  /* --- AUTO FILL IF NOT SCROLLABLE --- */
  useEffect(() => {
    const div = containerRef.current;
    if (!div) return;

    const id = setTimeout(() => {
      const canScroll = div.scrollHeight > div.clientHeight;

      if (!canScroll) {
        loadBatch();
      }
    }, 50);

    return () => clearTimeout(id);
  }, [data]);

  /* kick starter */
  useEffect(() => {
    loadBatch();
  }, []);

  /* --- INTERSECTION OBSERVER --- */
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoadingMore) {
        loadBatch();
      }
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [isLoadingMore]);

  /* --- FILTER / SORT / MAP --- */
  const items = data
    ?.map(({ item, url }, idx) => {
      if (isItemData(item) || item === null) return undefined;
      const path = item.substring(
        item.lastIndexOf("assets/") + 7,
        item.lastIndexOf("."),
      );
      if (!path.toLowerCase().includes(search.query.toLowerCase()))
        return undefined;
      const title = path.substring(path.lastIndexOf("/") + 1);

      return (
        <article key={`${idx}-${title}`} className="h-[160px]">
          <BrowseImg
            name={title}
            imgSrc={url}
            handleImageSelect={handleImageSelect}
          />
        </article>
      );
    })
    .filter((i) => i !== undefined);

  {
    const [itemsCount, setItemsCount] = useState(0);

    useEffect(() => {
      setItemsCount(items ? items.length : 0);
    }, [items]);

    useDebugValue("itemsCount", itemsCount, "/browse");
  }

  return (
    <div className={`px-5 overflow-y-auto w-full h-full`}>
      {items != undefined && items?.length > 0 ? (
        <>
          <section
            className="grid gap-2 justify-items-center
            grid-cols-[repeat(auto-fill,minmax(160px,1fr))]"
          >
            {items}

            {!noMoreData && (
              <div
                ref={loadMoreRef}
                className="h-[160px] w-[160px] flex justify-center items-center"
              >
                {isLoadingMore && (
                  <div className="animate-spin h-10 w-10 border-5 border-gray-400 border-t-transparent rounded-full"></div>
                )}
              </div>
            )}
          </section>
          {noMoreData && (
            <div
              className="mt-6 h-[48px] flex justify-center items-center
              border-b-1 text-sm overflow-hidden whitespace-nowrap opacity-30"
            >
              This is the end...
            </div>
          )}
        </>
      ) : (
        <div
          className="flex w-full h-full justify-center items-center
          text-center font-semibold text-xl opacity-50"
        >
          {data === null || items === undefined ? (
            <p>! Failed to fetch items !</p>
          ) : (
            <p>No items matched...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImgBrowser;
