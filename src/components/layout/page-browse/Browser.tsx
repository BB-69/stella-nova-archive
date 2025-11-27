import QMark from "@/assets/fallback/question-mark.svg";

const items = [
  {
    id: "item1",
    type: "image",
    cat: "other",
    sub_cat: null,
    title: "Item 1",
    desc: "Alienating",
    src: "a/b",
  },
  {
    id: "item2",
    type: "image",
    cat: "other",
    sub_cat: null,
    title: "Item 2",
    desc: "Alienating",
    src: "",
  },
  {
    id: "item3",
    type: "image",
    cat: "other",
    sub_cat: null,
    title: "Item 3",
    desc: "Alienating",
    src: "",
  },
  {
    id: "item4",
    type: "image",
    cat: "other",
    sub_cat: null,
    title: "Item 4",
    desc: "Alienating",
    src: "",
  },
];

const Browser = () => {
  return (
    <div className="p-5 overflow-auto">
      <h1 className="text-3xl font-bold">Browser</h1>
      <p className="mt-2">This is the main browsing area...</p>

      <section
        className="grid mt-4 gap-4 justify-items-center
        grid-cols-[repeat(auto-fit,minmax(220px,1fr))]"
      >
        {items.map((it) => (
          <article key={it.id} className="h-[220px]">
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
              <img
                src={it.src}
                onError={(e) => {
                  const img = e.currentTarget;
                  img.onerror = null;
                  img.src = QMark;
                  img.classList.add("opacity-20");
                }}
                className="p-2 mt-2 max-w-full max-h-[150px] object-contain"
              />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Browser;
