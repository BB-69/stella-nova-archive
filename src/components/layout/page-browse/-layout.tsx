import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Browser from "./Browser";
import "../../../css/style.css";

const BrowseLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="app-root w-full h-full"
      data-collapsed={collapsed ? "true" : "false"}
    >
      <Header
        onToggleSidebar={() => setCollapsed((s) => !s)}
        collapsed={collapsed}
      />
      <div className="layout">
        <Sidebar
          onToggleSidebar={() => setCollapsed((s) => !s)}
          collapsed={collapsed}
        />
        <main className="main-content">
          <Browser />
        </main>
      </div>
    </div>
  );
};

export default BrowseLayout;
