import ImageMetadata from "../ImageData";
import HyperLink from "../../../common/hyperlink";
import ItemJson from "../ItemJson";
import {
  type ChangeEvent,
  type Dispatch,
  type JSX,
  type SetStateAction,
} from "react";
import {
  getFileName,
  type ItemData,
  type ItemDataFraction,
} from "../../../../scripts/structs/item-data";
import {
  CircleQuestionMark,
  CodeXml,
  FileCog,
  Images,
  PenLine,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getImageDimensions } from "../../../../scripts/image";
import ButtonInput from "../../../common/button-input";
import { useIsMd } from "../../../../hooks/useIsMd";

export interface TlOptionProps {
  id: string;
  label: string;
  icon: JSX.Element;
  appearOn: { md?: boolean; edit?: boolean };
  alwaysShowContentOnFull: boolean;
  content?: JSX.Element;
  method?: () => void;
}

const useTlOptions = ({
  item,
  setItem,
  applyItem,
  setImgSrc,
}: {
  item: ItemData | null;
  setItem: Dispatch<SetStateAction<ItemData | null>>;
  applyItem: (newI: ItemDataFraction) => void;
  setImgSrc: Dispatch<SetStateAction<string>>;
}): TlOptionProps[] => {
  const navigate = useNavigate();
  const isMd = useIsMd();

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
    setImgSrc(imgUrl);
    applyImageData(file.name, imgUrl);
  };

  const handleNavigate = () => {
    navigate?.(
      `/archive?edit=true${
        item ? `&id=${getFileName(item).split(".")[0]}` : ""
      }`
    );
  };

  return [
    {
      id: "about",
      label: "About Translation Editor",
      icon: <CircleQuestionMark />,
      appearOn: { edit: true },
      alwaysShowContentOnFull: false,
      content: (
        <div className="max-w-[400px] flex flex-col gap-2">
          <span>
            This session is the built-in translation editor intended for{" "}
            <span className="font-bold">Stella Nova Archive Database</span>{" "}
            contribution.
          </span>
          <span>
            <span className="text-blue-600 [.dark_&]:text-blue-400">
              <HyperLink
                link="https://github.com/BB-69/stella-nova-archive-db/blob/main/doc/contribution.md#translation-overlays"
                text="Click this link"
              />
            </span>{" "}
            to see the guide on how to use this editor and contribute.
          </span>
        </div>
      ),
    },
    {
      id: "edit_mode",
      label: "Edit Mode",
      icon: <PenLine />,
      appearOn: { md: false, edit: false },
      alwaysShowContentOnFull: false,
      method: handleNavigate,
    },
    {
      id: "change_image",
      label: "Change Image",
      icon: <Images />,
      appearOn: { md: false, edit: true },
      alwaysShowContentOnFull: true,
      content: (
        <ButtonInput
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
      ),
    },
    {
      id: "json",
      label: "JSON",
      icon: <CodeXml />,
      appearOn: { md: false, edit: true },
      alwaysShowContentOnFull: false,
      content: item ? <ItemJson item={item} onItemChange={setItem} /> : <></>,
    },
    {
      id: "config",
      label: "Config",
      icon: <FileCog />,
      appearOn: { md: false, edit: true },
      alwaysShowContentOnFull: true,
      content: item ? (
        <ImageMetadata item={item} applyItem={applyItem} canCollapse={!isMd} />
      ) : (
        <></>
      ),
    },
  ];
};

export default useTlOptions;
