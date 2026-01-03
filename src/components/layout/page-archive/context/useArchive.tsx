import { useArchiveContext } from "./ArchiveContext";

export function useArchive() {
  const {
    tlBarCollapsed,
    setTlBarCollapsed,
    item,
    setItem,
    imgSrc,
    setImgSrc,
    editing,
    setEditing,
  } = useArchiveContext();

  const onToggleTlBar = () => {
    () => item != null && setTlBarCollapsed((s) => !s);
  };

  return {
    tlBarCollapsed,
    toggleTlBar: onToggleTlBar,
    item,
    setItem,
    imgSrc,
    setImgSrc,
    editing,
    setEditing,
  };
}
