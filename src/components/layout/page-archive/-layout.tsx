import { useEffect, useState } from "react";
import Header from "../Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import { isItemData, type ItemData } from "../../../scripts/structs/item-data";
import { useLocation } from "react-router-dom";
import { FetchFilesFromFolder } from "../../../scripts/database-loader";
import { useDebugValue } from "../../../hooks/useDebugValue";

const ArchiveLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [item, setItem] = useState<ItemData | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  {
    useDebugValue("itemId", item?.id ?? null, "/archive");
    useDebugValue("imgSrc", imgSrc, "/archive");
  }

  async function loadData() {
    const res = await FetchFilesFromFolder(`data/${id}.json`, "json");

    if (!res || res.length === 0) return;

    const data = res[0];
    if (isItemData(data.item)) {
      const item = data.item;
      setItem(item);

      if (item.source.length > 0) {
        const img = await FetchFilesFromFolder(item.source[0], "webp");
        if (img && img.length > 0) setImgSrc(img[0].url);
      }
    }
  }

  useEffect(() => {
    loadData();

    const timeOutId = setTimeout(() => {
      if (item == null) setSidebarCollapsed(false);
    }, 1000);

    return () => clearTimeout(timeOutId);
  }, []);

  useEffect(() => {
    setSidebarCollapsed(item == null);
  }, [item]);

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
        <Content item={item} imgSrc={imgSrc} />

        <Sidebar
          onToggleSidebar={() => item != null && setSidebarCollapsed((s) => !s)}
          sidebarCollapsed={sidebarCollapsed}
          item={item}
        />
      </div>
    </div>
  );
};

export default ArchiveLayout;
