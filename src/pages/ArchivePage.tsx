import ArchiveLayout from "../components/layout/page-archive/-layout";
import { OverlayProvider } from "../components/layout/page-archive/OverlayContext";

function ArchivePage() {
  return (
    <OverlayProvider>
      <div className="min-h-screen w-full flex items-center justify-center">
        <ArchiveLayout />
      </div>
    </OverlayProvider>
  );
}

export default ArchivePage;
