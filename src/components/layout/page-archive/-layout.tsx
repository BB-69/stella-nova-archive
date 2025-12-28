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
import OverlayModal from "../../common/overlay-modal";
import HyperLink from "../../common/hyperlink";

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

    if (!res || res.length === 0) {
      if (urlEdit) setItem(defaultItemData());
      return;
    }

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
  const [editorPopup, setEditorPopup] = useState(false);

  useEffect(() => {
    resetOverlayData();
    loadData();
    if (urlEdit) {
      if (urlId == null) {
        navigate(`/archive?edit=true&id=${"new_item"}`);
        setItem(defaultItemData());
        setImgSrc("");
      }
      if (!(localStorage?.getItem("bypassEnterEditorPopup") === "true")) {
        setEditorPopup(true);
      }
    } else {
      setEditorPopup(false);
    }
  }, [urlId, urlEdit]);

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

      {/* EDITOR POPUP */}

      <div className="z-10">
        <OverlayModal
          onClose={() => setEditorPopup(false)}
          active={editorPopup}
          title="ENTER EDITOR MODE"
          canDismiss={false}
        >
          <div className="max-w-[460px] flex flex-col justify-center gap-4">
            <span className="text-center">
              The following session is the built-in translation editor intended
              for{" "}
              <span className="font-bold">Stella Nova Archive Database</span>{" "}
              contribution only. Follow the{" "}
              <span className="text-blue-600 [.dark_&]:text-blue-400">
                <HyperLink
                  link="https://github.com/BB-69/stella-nova-archive-db/blob/main/doc/contribution.md#translation-overlays"
                  text="link"
                />{" "}
              </span>
              to see more on how to use this editor and contribute.
            </span>
            <div
              className="group-unselectable p-[4px] my-1 w-full max-h-full
              flex flex-row max-[440px]:flex-col justify-evenly gap-2"
            >
              <div
                className="group relative flex justify-center items-center
                max-w-full max-h-full rounded-full border-1
                border-red-700/50 [.dark_&]:border-red-400/50
                hover:border-white [.dark_&]:hover:border-black
                hover:bg-[#CC2222]
                hover:text-white
                text-sm font-bold whitespace-nowrap
                transition duration-100"
                onClick={() => {
                  localStorage?.setItem("bypassEnterEditorPopup", "true");
                  setEditorPopup(false);
                }}
              >
                <span className="px-3 py-2">Proceed & Don't Show Again</span>
              </div>
              <div
                className="group relative flex justify-center items-center
                max-w-full max-h-full rounded-full border-1
                border-black/50 [.dark_&]:border-white/50
                hover:border-white [.dark_&]:hover:border-black
                hover:bg-[var(--bg-a1)] [.dark_&]:hover:bg-white
                hover:text-white [.dark_&]:hover:text-[var(--bg-a1-dark)]
                text-sm font-bold whitespace-nowrap
                transition duration-100"
                onClick={() => navigate("/browse")}
              >
                <span className="px-3 py-2">Back to Browsing</span>
              </div>
            </div>
          </div>
        </OverlayModal>
      </div>
    </div>
  );
};

export default ArchiveLayout;
