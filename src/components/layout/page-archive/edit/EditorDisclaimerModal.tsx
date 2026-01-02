import { useNavigate } from "react-router-dom";
import HyperLink from "../../../common/hyperlink";
import OverlayModal from "../../../common/overlay-modal";
import type { Dispatch, SetStateAction } from "react";

const EditorDisclaimerModal = ({
  editorPopup,
  setEditorPopup,
}: {
  editorPopup: boolean;
  setEditorPopup: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  return (
    <OverlayModal
      onClose={() => setEditorPopup(false)}
      active={editorPopup}
      title="ENTER EDITOR MODE"
      canDismiss={false}
    >
      <div className="max-w-[460px] flex flex-col justify-center gap-4">
        <span className="text-center">
          The following session is the built-in translation editor intended for{" "}
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
  );
};

export default EditorDisclaimerModal;
