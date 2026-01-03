import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

/* css */
import "./css/main.css";
import "./css/tailwind-utils.css";
import "./css/floating-box.css";
import AppProviders from "./AppProviders.tsx";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </HashRouter>
  </StrictMode>
);
