import { Layers2, ListChevronsUpDown, Workflow } from "lucide-react";
import ButtonToggle from "../../common/button-toggle";
import { useOverlay } from "./Overlay/context/useOverlay";

const useOverlayConfig = () => {
  const {
    overlayActive,
    toggleOverlayActive,
    connectorActive,
    toggleConnectorActive,
    infoAutoScroll,
    toggleInfoAutoScroll,
  } = useOverlay();

  return [
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
