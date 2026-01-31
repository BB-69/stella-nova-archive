import {
  Layers2,
  ListChevronsUpDown,
  PanelLeftDashed,
  PanelTopDashed,
  Workflow,
} from "lucide-react";
import ButtonToggle from "../../common/button-toggle";
import { useOverlay } from "./Overlay/context/useOverlay";

const useOverlayConfig = () => {
  const {
    cursorGuideMode,
    toggleCursorGuideMode,
    overlayActive,
    toggleOverlayActive,
    connectorActive,
    toggleConnectorActive,
    infoAutoScroll,
    toggleInfoAutoScroll,
  } = useOverlay();

  return [
    <ButtonToggle
      toggle={cursorGuideMode === "none"}
      onToggle={toggleCursorGuideMode}
      fullSize={true}
    >
      <div
        className="relative w-full h-full"
        style={
          cursorGuideMode === "onMove"
            ? {
                animation: "blink 1.2s infinite ease-in-out",
              }
            : {}
        }
      >
        <style>
          {`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
        </style>

        <div className="absolute inset-0">
          <div className="w-full h-full flex justify-center items-center">
            <PanelTopDashed width={28} height={28} />
          </div>
        </div>
        <div className="absolute inset-0">
          <div className="w-full h-full flex justify-center items-center">
            <PanelLeftDashed width={28} height={28} />
          </div>
        </div>
      </div>
    </ButtonToggle>,
    <ButtonToggle
      toggle={!overlayActive}
      onToggle={toggleOverlayActive}
      fullSize={true}
    >
      <Layers2 width={28} height={28} />
    </ButtonToggle>,
    <ButtonToggle
      toggle={!connectorActive}
      onToggle={toggleConnectorActive}
      fullSize={true}
    >
      <div className="w-full h-full flex justify-center items-center rotate-135">
        <Workflow width={28} height={28} />
      </div>
    </ButtonToggle>,
    <ButtonToggle
      toggle={!infoAutoScroll}
      onToggle={toggleInfoAutoScroll}
      fullSize={true}
    >
      <ListChevronsUpDown width={28} height={28} />
    </ButtonToggle>,
  ];
};

export default useOverlayConfig;
