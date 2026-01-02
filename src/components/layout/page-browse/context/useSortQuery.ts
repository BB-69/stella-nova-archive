import { useEffect } from "react";
import { useSortContext, type SortType } from "./SortContext";

export function useSortQuery(query: SortType | null) {
  const { setSortQuery } = useSortContext();

  useEffect(() => {
    setSortQuery(query);
  }, [query, setSortQuery]);
}
