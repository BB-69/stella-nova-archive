import { useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar";
import Content from "./Content";

const BrowseLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  return (
    <div
      className="flex flex-col w-full h-full
      bg-gradient-to-b from-[var(--bg-a2)] to-white
      [.dark_&]:from-[var(--bg-a2-dark)] [.dark_&]:to-black"
      data-collapsed={sidebarCollapsed ? "true" : "false"}
    >
      <Header isBrowsing={false} />

      <div
        className={
          `grid transition-[grid-template-columns] duration-200` +
          ` ${
            sidebarCollapsed ? "grid-cols-[1fr_72px]" : "grid-cols-[1fr_260px]"
          }`
        }
        style={{ height: "calc(100vh - 64px)" }}
      >
        <Content />

        <Sidebar
          onToggleSidebar={() => setSidebarCollapsed((s) => !s)}
          sidebarCollapsed={sidebarCollapsed}
        />
      </div>
    </div>
  );
};

export default BrowseLayout;
