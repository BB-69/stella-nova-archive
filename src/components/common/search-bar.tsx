import { useState, type ChangeEvent } from "react";
import { useSearchQuery } from "../../hooks/useSearchQuery";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  useSearchQuery(query);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <input
      className="flex-1 min-w-[80px] px-3 py-2 mx-2 rounded-xl
			border border-black/20 [.dark_&]:border-white/20"
      type="text"
      maxLength={69}
      value={query}
      onChange={handleInputChange}
      placeholder="Search..."
    />
  );
};

export default SearchBar;
