import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Browser from "./Browser";

const BrowseLayout = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div
      className="flex flex-col w-full h-full
      bg-gradient-to-b from-[var(--bg-a2)] to-white
      [.dark_&]:from-[var(--bg-a2-dark)] [.dark_&]:to-black"
      data-collapsed={collapsed ? "true" : "false"}
    >
      <Header />

      <div
        className={
          `grid transition-[grid-template-columns] duration-200` +
          ` ${collapsed ? "grid-cols-[64px_1fr]" : "grid-cols-[260px_1fr]"}`
        }
        style={{ height: "calc(100vh - 64px)" }}
      >
        <Sidebar
          onToggleSidebar={() => setCollapsed((s) => !s)}
          collapsed={collapsed}
        />

        <Browser />
      </div>
    </div>
  );
};

export default BrowseLayout;
