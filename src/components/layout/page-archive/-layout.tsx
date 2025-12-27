import { useEffect, useState } from "react";
import Header from "../Header";
import TranslationBar from "./TranslationBar";
import Content from "./Content";
import {
  defaultItemData,
  isItemData,
  type ItemData,
} from "../../../scripts/structs/item-data";
import { useLocation, useNavigate } from "react-router-dom";
import { FetchFilesFromFolder } from "../../../scripts/database-loader";
import { useDebugValue } from "../../../hooks/useDebugValue";
import InfoHeader from "./InfoHeader";
import { useOverlayContext } from "./OverlayContext";

const ArchiveLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [item, setItem] = useState<ItemData | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlId = params.get("id");
  const urlEdit: boolean = params.get("edit") == "true";

  {
    useDebugValue("itemId", item?.id ?? null, "/archive");
    useDebugValue("imgSrc", imgSrc, "/archive");
  }

  async function loadData() {
    const res = await FetchFilesFromFolder(`data/${urlId}.json`, "json");

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

  const { resetOverlayData } = useOverlayContext();
  const navigate = useNavigate();

  useEffect(() => {
    resetOverlayData();
    loadData();
    if (urlId == null && urlEdit)
      navigate(`/archive?edit=true&id=${"new_item"}`);
    if (urlEdit) {
      setItem(defaultItemData());
      setImgSrc("");
    }
  }, [urlId]);

  return (
    <div
      className="flex flex-col w-full h-full
      bg-gradient-to-b from-[var(--bg-a2)] to-white
      [.dark_&]:from-[var(--bg-a2-dark)] [.dark_&]:to-black"
      data-collapsed={sidebarCollapsed ? "true" : "false"}
    >
      <Header isBrowsing={false} />

      <div
        className={`grid transition-[grid-template-rows] md:grid-rows-none
          md:transition-[grid-template-columns] duration-200
          ${
            sidebarCollapsed
              ? "grid-rows-[1fr_84px] md:grid-cols-[1fr_72px]"
              : "grid-rows-[1fr_calc(48vh-16vw)] md:grid-cols-[1fr_260px]"
          }`}
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="grid grid-rows-[80px_1fr] min-w-full min-h-full">
          <InfoHeader item={item} />
          <Content item={item} imgSrc={imgSrc} editing={urlEdit} />
        </div>

        <TranslationBar
          onToggleTlBar={() => item != null && setSidebarCollapsed((s) => !s)}
          tlBarCollapsed={sidebarCollapsed}
          item={item}
          setItem={setItem}
          setImgSrc={setImgSrc}
          editing={urlEdit}
        />
      </div>
    </div>
  );
};

export default ArchiveLayout;
