import { Layers2, Workflow } from "lucide-react";
import ButtonToggle from "../../common/button-toggle";
import { useOverlay } from "./Overlay/context/useOverlay";

const useOverlayConfig = () => {
  const {
    overlayActive,
    toggleOverlayActive,
    connectorActive,
    toggleConnectorActive,
  } = useOverlay();

  return [
    <ButtonToggle
      toggle={!overlayActive}
      onToggle={toggleOverlayActive ?? (() => {})}
      fullSize={true}
    >
      <Layers2 width={28} height={28} />
    </ButtonToggle>,
    <ButtonToggle
      toggle={!connectorActive}
      onToggle={toggleConnectorActive ?? (() => {})}
      fullSize={true}
    >
      <Workflow width={28} height={28} rotate={135} />
    </ButtonToggle>,
  ];
};

export default useOverlayConfig;
