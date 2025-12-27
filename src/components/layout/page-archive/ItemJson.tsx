import { Check, Copy, Download } from "lucide-react";
import {
  getFileName,
  processItemData,
  type ItemData,
} from "../../../scripts/structs/item-data";
import ButtonToggle from "../../common/button-toggle";
import { useState } from "react";

const ItemJson = ({ item }: { item: ItemData }) => {
  const itemJson = JSON.stringify(processItemData(item), null, 2);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(itemJson);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDownload = async () => {
    const blob = new Blob([itemJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = getFileName(item);
    link.click();

    URL.revokeObjectURL(url);

    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 w-full h-full">
      <div
        className="selectable p-4 bg-white [.dark_&]:bg-black
        min-w-[80vw] md:min-w-[60vw] max-w-[70vw] max-h-[60vh] overflow-y-auto
        border-2 border-black [.dark_&]:border-white"
      >
        {item ? (
          <pre>{itemJson}</pre>
        ) : (
          <span className="w-full flex justify-center opacity-50">
            ! item not found !
          </span>
        )}
      </div>
      <div className="flex flex-row justify-end">
        <div className="relative">
          <div
            className={`pointer-events-none
            absolute z-1 inset-0 bg-[#55CC55] rounded-md
            flex justify-center items-center p-1
            transition-opacity duration-100
            ${isCopied ? "opacity-100" : "opacity-0"}
          `}
          >
            <Check color="white" strokeWidth={3} />
          </div>
          <div
            className={isCopied ? "pointer-events-none" : "pointer-events-auto"}
          >
            <ButtonToggle onToggle={handleCopy}>
              <Copy />
            </ButtonToggle>
          </div>
        </div>
        <div className="relative">
          <div
            className={`pointer-events-none
            absolute z-1 inset-0 bg-[#55CC55] rounded-md
            flex justify-center items-center p-1
            transition-opacity duration-100
            ${isCopied ? "opacity-100" : "opacity-0"}
          `}
          >
            <Check color="white" strokeWidth={3} />
          </div>
          <div
            className={
              isDownloaded ? "pointer-events-none" : "pointer-events-auto"
            }
          >
            <ButtonToggle onToggle={handleDownload}>
              <Download />
            </ButtonToggle>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemJson;
