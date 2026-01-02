import { useEffect, useState } from "react";
import Header from "../Header";
import TranslationBar from "./TranslationBar/TranslationBar";
import Content from "./Content";
import {
  defaultItemData,
  isItemData,
} from "../../../scripts/structs/item-data";
import { useLocation, useNavigate } from "react-router-dom";
import { FetchFilesFromFolder } from "../../../scripts/database-loader";
import InfoHeader from "./InfoHeader";
import { useOverlayContext } from "./Overlay/context/OverlayContext";
import EditorDisclaimerModal from "./edit/EditorDisclaimerModal";
import { useArchiveContext } from "./context/ArchiveContext";

const ArchiveLayout = () => {
  const { tlBarCollapsed, setItem, setImgSrc, setEditing } =
    useArchiveContext();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const urlId = params.get("id");
  const urlEdit: boolean = params.get("edit") == "true";

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
    setEditing(urlEdit);
    if (urlEdit) {
      if (urlId == null) {
        const d = defaultItemData();
        navigate(`/archive?edit=true&id=${d.id}`);
        setItem(d);
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
      data-collapsed={tlBarCollapsed ? "true" : "false"}
    >
      <Header isBrowsing={false} />

      <div
        className={`grid transition-[grid-template-rows] md:grid-rows-none
          md:transition-[grid-template-columns] duration-200
          ${
            tlBarCollapsed
              ? "grid-rows-[1fr_84px] md:grid-cols-[1fr_72px]"
              : "grid-rows-[1fr_calc(48vh-16vw)] md:grid-cols-[1fr_260px]"
          }`}
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="grid grid-rows-[80px_1fr] min-w-full min-h-full">
          <InfoHeader />
          <Content />
        </div>

        <TranslationBar />
      </div>

      {/* EDITOR POPUP */}

      <div className="z-10">
        <EditorDisclaimerModal
          editorPopup={editorPopup}
          setEditorPopup={setEditorPopup}
        />
      </div>
    </div>
  );
};

export default ArchiveLayout;
