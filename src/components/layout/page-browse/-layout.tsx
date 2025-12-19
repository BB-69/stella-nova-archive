import { useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar";
import Browser from "./Browser";
import FilterSelector from "./FilterSelector";

const BrowseLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [filterbarCollapsed, setFilterbarCollapsed] = useState(true);

  return (
    <div
      className="flex flex-col w-full h-full
      bg-gradient-to-b from-[var(--bg-a2)] to-white
      [.dark_&]:from-[var(--bg-a2-dark)] [.dark_&]:to-black"
      data-collapsed={sidebarCollapsed ? "true" : "false"}
    >
      <Header
        onToggleFilterbar={() => setFilterbarCollapsed((s) => !s)}
        collapsed={filterbarCollapsed}
        isBrowsing={true}
      />

      <div
        className={`md:grid md:transition-[grid-template-columns] duration-200
          ${
            sidebarCollapsed ? "grid-cols-[72px_1fr]" : "grid-cols-[260px_1fr]"
          }`}
        style={{ height: "calc(100vh - 64px)" }}
      >
        <Sidebar
          onToggleSidebar={() => setSidebarCollapsed((s) => !s)}
          collapsed={sidebarCollapsed}
        />

        <div
          className={`fixed inset-0 md:hidden duration-200
              ${
                sidebarCollapsed
                  ? `pointer-events-none bg-black/0`
                  : `pointer-events-auto bg-black/40`
              }`}
          onClick={() => setSidebarCollapsed(true)}
        />

        <div className="ml-[72px] md:ml-0 flex flex-col h-full overflow-hidden">
          <FilterSelector collapsed={filterbarCollapsed} />
          <div className="flex-1 overflow-auto">
            <Browser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseLayout;
