import { Check, LayoutGrid, Upload, X } from "lucide-react";
import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import ButtonInput from "../../../common/button-input";
import { getImageDimensions } from "../../../../scripts/image";
import type {
  ItemData,
  ItemDataFraction,
} from "../../../../scripts/structs/item-data";
import QMark from "/assets/fallback/question-mark.svg";
import ButtonToggle from "../../../common/button-toggle";
import OverlayModal from "../../../common/overlay-modal";
import ImgBrowser from "./ImgBrowser";

const ChangeImage = ({
  item,
  applyItem,
  setImgSrc,
}: {
  item: ItemData | null;
  applyItem: (newI: ItemDataFraction) => void;
  setImgSrc: Dispatch<SetStateAction<string>>;
}) => {
  const [imgData, setImgData] = useState<{
    name: string;
    src: string;
  } | null>(null);
  const [uploadRemount, setUploadRemount] = useState(false);
  const [imgBrowserActive, setImgBrowserActive] = useState(false);

  const applyImageData = async (name: string, imgSrc: string) => {
    if (!item || !applyItem) return;

    const imgDim = await getImageDimensions(imgSrc);
    applyItem({
      id: name.substring(0, name.lastIndexOf(".")),
      meta: {
        ...item.meta,
        width: imgDim.width,
        height: imgDim.height,
      },
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;

    const imgUrl: string = URL.createObjectURL(file);
    setImgData({ name: file.name, src: imgUrl });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file: File | null = item.getAsFile();
        if (!file) return;
        const imgUrl: string = URL.createObjectURL(file);
        setImgData({ name: file.name, src: imgUrl });
        setUploadRemount((prev) => !prev);
        return;
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <span
        className="selectable group-selectable text-sm
        flex flex-row items-center gap-2 overflow-hidden"
      >
        Current Image:
        <div
          className="text-sm p-[4px_8px] max-w-full
          bg-white/60 [.dark_&]:bg-black/60 border rounded-md
          border-black/20 [.dark_&]:border-white/20"
        >
          {imgData ? imgData.name : <span className="italic">null</span>}
        </div>
      </span>

      <div
        className="flex flex-row items-center justify-center
        w-full h-[40px] gap-2"
      >
        <div className="max-w-full h-full">
          <ButtonToggle
            toggle={!imgBrowserActive}
            onToggle={() => setImgBrowserActive((prev) => !prev)}
            fullSize={true}
            alwaysBorder={true}
          >
            <div
              className="flex flex-row items-center gap-2
              text-sm px-2 opacity-70"
            >
              <LayoutGrid />
              {"Image Browser"}
            </div>
          </ButtonToggle>
        </div>

        <div>
          <ButtonInput
            key={`${uploadRemount}`}
            label="Upload Image"
            icon={<Upload />}
            htmlInput={
              <input
                className="absolute inset-0 opacity-0"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            }
          />
        </div>
      </div>

      <div
        className={`
          flex justify-center items-center
          rounded-[8px] max-w-full max-h-full
          ${imgData ? "border-[4px]" : "border-[2px]"}
          border-dashed border-gray-500
          focus:border-solid focus:border-green-500
          duration-200
        `}
        tabIndex={0}
        onPaste={handlePaste}
      >
        {!imgData ? (
          <span className="p-[20px]">
            Click & Paste image from clipboard here
          </span>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <img
              src={` ${imgData?.src || ""}`}
              onError={(e) => {
                const img = e.currentTarget;
                img.onerror = null;
                if (!img.src.includes(QMark)) {
                  img.src = QMark;
                  img.classList.add("[.dark_&]:invert");
                }
              }}
              onLoad={(e) => {
                const img = e.currentTarget;
                if (!img.src.includes(QMark)) {
                  img.classList.remove("[.dark_&]:invert");
                }
              }}
              className="img-selectable max-w-full max-h-full
              rounded-md outline-4 outline-black/30 [.dark_]:outline-white/30"
              alt={item != null && imgData.src ? item.title : "< null >"}
            />
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4 justify-center mt-2">
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
            setImgData(null);
            setUploadRemount((prev) => !prev);
          }}
        >
          <span className="px-3 py-2 flex flex-row items-center gap-1">
            <X /> Clear
          </span>
        </div>
        <div
          className="group relative flex justify-center items-center
          max-w-full max-h-full rounded-full border-1
          border-green-700/50 [.dark_&]:border-green-400/50
          hover:border-white [.dark_&]:hover:border-black
          hover:bg-[#22AA22]
          hover:text-white
          text-sm font-bold whitespace-nowrap
          transition duration-100"
          onClick={() => {
            if (!imgData) return;
            setImgSrc(imgData?.src);
            applyImageData(imgData.name, imgData.src);
          }}
        >
          <span className="px-3 py-2 flex flex-row items-center gap-1">
            Apply <Check />
          </span>
        </div>
      </div>

      {/* Image Browser */}

      <OverlayModal
        onClose={() => setImgBrowserActive(false)}
        active={imgBrowserActive}
        title="Image Browser"
      >
        <div className="w-[460px] h-[360px] overflow-hidden">
          <ImgBrowser />
        </div>
      </OverlayModal>
    </div>
  );
};

export default ChangeImage;
