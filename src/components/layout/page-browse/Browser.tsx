import { useEffect, useRef, useState } from "react";
import {
  FetchFilesFromFolder,
  type FetchedFile,
} from "../../../scripts/database-loader";
import { isItemData } from "../../../scripts/structs/item-data";
import BrowseItem from "./BrowseItem";
import { useDebugValue } from "../../_DebugTools/useDebugValue";
import { useSearchQuery } from "../context/useSearchQuery";
import { useFilterQuery } from "./context/useFilterQuery";
import { useSortQuery } from "./context/useSortQuery";

/* ---LOCAL_TEST--- */
// const test_items: FetchedFile[] = [
//   {
//     url: "",
//     item: {
//       id: "test-item1",
//       type: "image",
//       category: "illustration",
//       sub_category: ["background", "character", "disc"],
//       title: "Test Item 1",
//       description: "Alienating",
//       source: ["a/b"],

//       meta: {
//         width: 0,
//         height: 0,
//         frames: null,
//         version: "0.0.2",
//       },

//       overlays: [],
//     },
//   },
//   {
//     url: "",
//     item: {
//       id: "test-item2",
//       type: "image",
//       category: "other",
//       sub_category: [],
//       title: "Test Item 2",
//       description: "Alienating",
//       source: ["assets/nova-alphabet-table.jpg"],

//       meta: {
//         width: 0,
//         height: 0,
//         frames: null,
//         version: "0.0.1",
//       },

//       overlays: [],
//     },
//   },
//   {
//     url: "",
//     item: {
//       id: "test-item3",
//       type: "image",
//       category: "illustration",
//       sub_category: ["disc"],
//       title: "Test Item 3",
//       description: "Alienating",
//       source: [""],

//       meta: {
//         width: 0,
//         height: 0,
//         frames: null,
//         version: "0.0.3",
//       },

//       overlays: [],
//     },
//   },
// ];

const Browser = () => {
  const [data, setData] = useState<FetchedFile[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);

  const BATCH_SIZE = 5;
  const batchIndex = useRef(0);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useSearchQuery();
  const filter = useFilterQuery();
  const sort = useSortQuery();

  const [images, setImages] = useState<{ [key: string]: string }>({});

  /* --- FETCH BATCH --- */
  async function loadBatch() {
    if (isLoadingMore || noMoreData) return;

    setIsLoadingMore(true);

    const res = await FetchFilesFromFolder(
      "data/",
      "json",
      batchIndex.current,
      BATCH_SIZE
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
    // if (data != null) setData((prev) => [...prev, ...test_items]);
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

  /* --- FETCH IMAGES --- */
  useEffect(() => {
    if (!data) return;

    data.forEach(async ({ item }) => {
      if (!isItemData(item)) return;

      if (item.source.length > 0) {
        let img = await FetchFilesFromFolder(item.source[0], "webp");
        if (!img) img = await FetchFilesFromFolder(item.source[0], "png");
        if (img && img.length > 0)
          setImages((prev) => ({ ...prev, [item.id]: img[0].url }));
      }
    });
  }, [data]);

  /* --- FILTER / SORT / MAP --- */
  const items = data
    ?.map(({ item, url }, idx) => {
      const itemTag = isItemData(item)
        ? [
            // mapped as from <sub> to <main>-<sub>
            ...(item.sub_category.map((t) => `${item.category}-${t}`) ?? []),
            item.category,
          ]
        : [];
      if (
        !isItemData(item) ||
        !item.title.toLowerCase().includes(search.query.toLowerCase()) ||
        // filter
        (filter.query.length != 0
          ? filter.query.some((t) => !itemTag.includes(t))
          : false)
      )
        return undefined;

      return {
        node: (
          <article key={`${idx}-${item.id}`} className="h-[220px]">
            <BrowseItem item={item} url={url} imgSrc={images[item.id]} />
          </article>
        ),
        data: item,
      };
    })
    .filter((i) => i !== undefined)
    // sort
    .sort((a, b) =>
      sort.query != null
        ? sort.query.type == "name"
          ? a.data.title.localeCompare(b.data.title) *
            (sort.query.ascending ? 1 : -1)
          : a.data.meta.version.localeCompare(b.data.meta.version) *
            (sort.query.ascending ? 1 : -1)
        : 0
    )
    .map((i) => i.node);

  {
    const [itemsCount, setItemsCount] = useState(0);

    useEffect(() => {
      setItemsCount(items ? items.length : 0);
    }, [items]);

    useDebugValue("itemsCount", itemsCount, "/browse");
  }

  return (
    <div className={`p-5 overflow-auto w-full`}>
      {items != undefined && items?.length > 0 ? (
        <>
          <section
            className="grid gap-4 justify-items-center
            grid-cols-[repeat(auto-fill,minmax(220px,1fr))]"
          >
            {items}

            {!noMoreData && (
              <div
                ref={loadMoreRef}
                className="h-[220px] w-[220px] flex justify-center items-center"
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

export default Browser;
