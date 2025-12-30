import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { DebugProvider } from "./components/_DebugTools/VariableContext";
import { ThemeProvider } from "./components/common/theme";
import { FilterProvider } from "./components/layout/page-browse/FilterContext";
import { SearchProvider } from "./components/layout/page-browse/SearchContext";
import { SortProvider } from "./components/layout/page-browse/SortContext";
import { OverlayProvider } from "./components/layout/page-archive/OverlayContext";

const AppProviders = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const path = location.pathname;

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
            <OverlayProvider>{children}</OverlayProvider>
          </SearchProvider>
        ) : (
          children
        )}
      </ThemeProvider>
    </DebugProvider>
  );
};

export default AppProviders;
