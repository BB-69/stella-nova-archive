import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { DebugProvider } from "./components/_DebugTools/VariableContext";
import { ThemeProvider } from "./components/common/theme";
import { FilterProvider } from "./components/layout/page-browse/context/FilterContext";
import { SearchProvider } from "./components/layout/context/SearchContext";
import { SortProvider } from "./components/layout/page-browse/context/SortContext";
import { OverlayProvider } from "./components/layout/page-archive/Overlay/context/OverlayContext";
import { ArchiveProvider } from "./components/layout/page-archive/context/ArchiveContext";

const AppProviders = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const path = location.pathname;
  const params = new URLSearchParams(location.search);

  /*--- /archive ---*/
  const urlId = params.get("id");
  const urlEdit: boolean = params.get("edit") == "true";

  return (
    <DebugProvider>
      <ThemeProvider>
        {path == "/browse" ? (
          <SearchProvider>
            <FilterProvider>
              <SortProvider>{children}</SortProvider>
            </FilterProvider>
          </SearchProvider>
        ) : path == "/archive" ? (
          <SearchProvider>
            <OverlayProvider key={`${urlId}-${urlEdit}`}>
              <ArchiveProvider>{children}</ArchiveProvider>
            </OverlayProvider>
          </SearchProvider>
        ) : (
          children
        )}
      </ThemeProvider>
    </DebugProvider>
  );
};

export default AppProviders;
