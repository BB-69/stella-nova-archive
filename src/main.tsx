import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./components/common/theme.tsx";
import { DebugProvider } from "./components/_DebugTools/VariableContext.tsx";
import App from "./App.tsx";

/* css */
import "./css/main.css";
import "./css/floating-box.css";
import { SearchProvider } from "./components/layout/page-browse/SearchContext.tsx";
import { FilterProvider } from "./components/layout/page-browse/FilterContext.tsx";
import { SortProvider } from "./components/layout/page-browse/SortContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <DebugProvider>
        <ThemeProvider>
          <SearchProvider>
            <FilterProvider>
              <SortProvider>
                <App />
              </SortProvider>
            </FilterProvider>
          </SearchProvider>
        </ThemeProvider>
      </DebugProvider>
    </HashRouter>
  </StrictMode>
);
