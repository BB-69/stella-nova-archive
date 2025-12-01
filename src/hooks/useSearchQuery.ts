import { useEffect } from "react";
import { useSearchContext } from "../components/layout/page-browse/SearchBrowser";

export function useSearchQuery(query: string) {
  const { setSearchQuery } = useSearchContext();

  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);
}