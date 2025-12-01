import { useEffect, useState } from "react";
import { FetchFilesFromFolder } from "../../../scripts/database-loader";
import { isItemData } from "../../../scripts/structs/item-data";
import BrowseItem from "./BrowseItem";
import { useSearchContext } from "./SearchBrowser";
import { useDebugValue } from "../../../hooks/useDebugValue";

/* ---LOCAL_TEST--- */
// const items = [
//   {
//     id: "test-item1",
//     type: "image",
//     cat: "other",
//     sub_cat: null,
//     title: "Test Item 1",
//     desc: "Alienating",
//     src: "a/b",
//   },
//   {
//     id: "test-item2",
//     type: "image",
//     cat: "other",
//     sub_cat: null,
//     title: "Test Item 2",
//     desc: "Alienating",
//     src: "assets/nova-alphabet-table.jpg",
//   },
//   {
//     id: "test-item3",
//     type: "image",
//     cat: "other",
//     sub_cat: null,
//     title: "Test Item 3",
//     desc: "Alienating",
//     src: "",
//   },
// ];

const data = await FetchFilesFromFolder("data/", "json");

const Browser = ({ collapsed }: { collapsed: boolean }) => {
  const [images, setImages] = useState<{ [key: string]: string }>({});
  const { searchQuery } = useSearchContext();

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
      if (
        !isItemData(item) ||
        !item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return undefined;

      return (
        <article key={`${idx}-${item.id}`} className="h-[220px]">
          <BrowseItem item={item} imgSrc={images[item.id]} />
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
    <div
      className={`border-1 p-5 overflow-auto
      ${collapsed ? "w-[calc(100vw-72px)]" : "w-[calc(100vw-260px)]"}`}
    >
      {items != undefined && items?.length > 0 ? (
        <section
          className="grid gap-4 justify-items-start
          grid-cols-[repeat(auto-fit,minmax(220px,1fr))]"
        >
          {items}

          {/* ---LOCAL_TEST--- */}

          {/* {items.map((it) => (
            <article key={"test-" + it.id} className="h-[220px]">
              <div
                className="flex flex-col bg-white [.dark_&]:bg-black p-4 h-full w-[220px]
                rounded-xl shadow-lg shadow-black/20 [.dark_&]:shadow-white/20"
              >
                <h3
                  className="font-semibold text-lg
                  pb-1 border-b border-black/30 [.dark_&]:border-white/30"
                >
                  {it.title}
                </h3>
                <div
                  className="mt-2 flex w-full h-[150px]
                  border-x-2 border-black/30 [.dark_&]:border-white/30 rounded-lg"
                >
                  <img
                    src={` ${it.src}`}
                    onError={(e) => {
                      const img = e.currentTarget;
                      img.onerror = null;
                      img.src = QMark;
                      img.classList.add("[.dark_&]:invert");
                    }}
                    className="p-1 w-auto h-auto object-contain"
                    alt={it.title}
                  />
                </div>
              </div>
            </article>
          ))} */}
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
