import { useEffect, useState } from "react";
import { FetchFilesFromFolder } from "../../../scripts/database-loader";
import { isItemData } from "../../../scripts/structs/item-data";
import BrowseItem from "./BrowseItem";
import { useSearchContext } from "./SearchContext";
import { useDebugValue } from "../../../hooks/useDebugValue";
import { useFilterContext } from "./FilterContext";
import { useSortContext } from "./SortContext";

/* ---LOCAL_TEST--- */
// const test_items: FetchedFile[] = [
//   {
//     url: "",
//     item: {
//       id: "test-item1",
//       type: "image",
//       category: "other",
//       sub_category: null,
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
//       sub_category: null,
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

let data = await FetchFilesFromFolder("data/", "json");
// if (data != null) data = [...data, ...test_items];

const Browser = () => {
  const [images, setImages] = useState<{ [key: string]: string }>({});
  const { searchQuery } = useSearchContext();
  const { filterQuery } = useFilterContext();
  const { sortQuery } = useSortContext();

  useEffect(() => {
    if (!data) return;

    data.forEach(async (d) => {
      const item = d.item;
      if (!isItemData(item)) return;

      if (item.source.length > 0) {
        const img = await FetchFilesFromFolder(item.source[0], "webp");
        if (img && img.length > 0)
          setImages((prev) => ({ ...prev, [item.id]: img[0].url }));
      }
    });
  }, [data]);

  const items = data
    ?.map((d, idx) => {
      const item = d.item;
      const itemTag = isItemData(item)
        ? [
            // mapped as from <sub> to <main>-<sub>
            ...(item.sub_category?.map((t) => `${item.category}-${t}`) ?? []),
            item.category,
          ]
        : [];
      if (
        !isItemData(item) ||
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        // filter
        (filterQuery.length != 0
          ? filterQuery.some((t) => !itemTag.includes(t))
          : false)
      )
        return undefined;

      return {
        node: (
          <article key={`${idx}-${item.id}`} className="h-[220px]">
            <BrowseItem item={item} imgSrc={images[item.id]} />
          </article>
        ),
        data: item,
      };
    })
    .filter((i) => i !== undefined)
    // sort
    .sort((a, b) =>
      sortQuery != null
        ? sortQuery.type == "name"
          ? a.data.title.localeCompare(b.data.title) *
            (sortQuery.ascending ? 1 : -1)
          : a.data.meta.version.localeCompare(b.data.meta.version) *
            (sortQuery.ascending ? 1 : -1)
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
        <section
          className="grid gap-4 justify-items-center
          grid-cols-[repeat(auto-fill,minmax(220px,1fr))]"
        >
          {items}
        </section>
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
