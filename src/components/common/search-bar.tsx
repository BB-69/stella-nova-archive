import { useEffect, useState, type ChangeEvent } from "react";
import { useSearchQuery } from "../layout/context/useSearchQuery";
import { FetchFilesFromFolder } from "../../scripts/database-loader";
import { isItemData, type ItemData } from "../../scripts/structs/item-data";
import { useNavigate } from "react-router-dom";

async function searchItems(
  query: string,
  limit?: number
): Promise<{ id: string | null; item: ItemData }[]> {
  if (!query.trim()) return [];

  const res = await FetchFilesFromFolder("data/", "json");

  if (!res) return [];
  return res
    ?.filter(
      (d): d is { url: string; item: ItemData } =>
        isItemData(d.item) &&
        d.item.title.toLowerCase().includes(query.toLowerCase())
    )
    .map(({ url, item }) => {
      const startIdx = url.search("/data/");
      const endIdx = url.search(".json");
      const id =
        startIdx != -1 && endIdx != -1
          ? url.substring(startIdx + 6, endIdx)
          : null;

      return { id: id, item: item };
    })
    .slice(0, limit);
}

const SearchBar = ({ isBrowsing }: { isBrowsing: boolean }) => {
  const [query, setQuery] = useState("");
  useSearchQuery(query);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const [results, setResults] = useState<
    { id: string | null; item: ItemData }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isBrowsing) return;

    const id = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      const res = await searchItems(query, 3);
      if (res) setResults(res);
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(id);
  }, [query, isBrowsing]);

  return (
    <div className="relative flex-1 min-w-[80px] mx-2">
      <input
        className="w-full px-3 py-2 rounded-xl
			  border border-black/20 [.dark_&]:border-white/20"
        type="text"
        maxLength={69}
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
      />
      {!isBrowsing && query.length > 0 && (
        <div
          className="absolute w-full mt-2 bg-white [.dark_&]:bg-black
          rounded-xl border border-black/20 [.dark_&]:border-white/20
          overflow-hidden"
        >
          {isLoading && (
            <div className="p-3 text-sm opacity-50">Searching...</div>
          )}

          {!isLoading &&
            results.map(({ id, item }) => {
              return (
                <div
                  key={item.id}
                  className="h-[45px] flex items-center px-3
                  border-b last:border-b-0
                  border-black/30 [.dark_&]:border-white/30
                  hover:bg-black/5 [.dark_&]:hover:bg-white/10
                  whitespace-nowrap cursor-pointer"
                  onClick={() => navigate(`/archive?id=${id}`)}
                >
                  {item.title}
                </div>
              );
            })}

          {!isLoading && results.length === 0 && (
            <div className="p-3 text-sm opacity-40">No results found…</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
