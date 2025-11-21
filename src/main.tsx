import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/common/theme.tsx";
import { DebugProvider } from "./components/_DebugTools/VariableContext.tsx";
import App from "./App.tsx";

/* css */
import "./css/main.css";
import "./css/debug.css";
import "./css/themeToggle.css";
import "./css/collapsible.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/nova-archive/">
      <DebugProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </DebugProvider>
    </BrowserRouter>
  </StrictMode>
);
