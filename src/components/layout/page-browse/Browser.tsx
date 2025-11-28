import { useEffect, useState } from "react";
import { FetchFilesFromFolder } from "../../../scripts/database-loader";
import QMark from "/assets/fallback/question-mark.svg";
import { isItemData } from "../../../scripts/structs/item-data";

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

const Browser = () => {
  const [images, setImages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!data) return;

    data.forEach(async (d) => {
      const item = d.item;
      if (!isItemData(item)) return;

      if (item.source.length > 0) {
        const img = await FetchFilesFromFolder(item.source[0], "webp");
        setImages((prev) => ({ ...prev, [item.id]: img[0].url }));
      }
    });
  }, [data]);

  return (
    <div className="p-5 overflow-auto">
      <section
        className="grid gap-4 justify-items-start
        grid-cols-[repeat(auto-fit,minmax(220px,1fr))]"
      >
        {data != null &&
          data.map((d, idx) => {
            const item = d.item;
            if (!isItemData(item)) return;

            return (
              <article key={`${idx}-${item.id}`} className="h-[220px]">
                <div
                  className="flex flex-col bg-white [.dark_&]:bg-black p-4 h-full w-[220px]
              rounded-xl shadow-lg shadow-black/20 [.dark_&]:shadow-white/20"
                >
                  <h3
                    className="font-semibold text-lg
                pb-1 border-b border-black/30 [.dark_&]:border-white/30"
                  >
                    {item.title || "< Untitled >"}
                  </h3>
                  <div
                    className="mt-2 flex w-full h-[150px]
                border-x-2 border-black/30 [.dark_&]:border-white/30 rounded-lg"
                  >
                    <img
                      src={` ${images[item.id] || ""}`}
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = QMark;
                        img.classList.add("[.dark_&]:invert");
                      }}
                      className="p-1 w-auto h-auto object-contain"
                      alt={item.title}
                    />
                  </div>
                </div>
              </article>
            );
          })}

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
    </div>
  );
};

export default Browser;
