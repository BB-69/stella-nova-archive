import type { ChangeEvent } from "react";
import { useImageSearchQuery } from "../context/useImageSearchQuery";

const ImgSearchBar = () => {
  const search = useImageSearchQuery();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    search.setQuery(e.target.value);
  };

  return (
    <div className="relative flex-1 min-w-[80px] mx-2">
      <input
        className="w-full px-3 py-2 rounded-xl
			  border border-black/20 [.dark_&]:border-white/20"
        type="text"
        maxLength={69}
        value={search.query}
        onChange={handleInputChange}
        placeholder="Search..."
      />
    </div>
  );
};

export default ImgSearchBar;
