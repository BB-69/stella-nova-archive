import { useState, type ChangeEvent } from "react";
import { useSearchQuery } from "../../hooks/useSearchQuery";

const SearchBar = ({ isBrowsing }: { isBrowsing: boolean }) => {
  const [query, setQuery] = useState("");
  useSearchQuery(query);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

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
      {!isBrowsing && (
        <div
          className="absolute w-full min-h-[80px]
          px-3 py-2 bg-white [.dark_&]:bg-black
          rounded-xl border border-black/20 [.dark_&]:border-white/20"
        ></div>
      )}
    </div>
  );
};

export default SearchBar;
