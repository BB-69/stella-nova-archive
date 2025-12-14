const Ruler = ({
  orientation,
  cursorPos,

  imageResolution, // full image size (px)
  displaySize, // rendered size (px)
}: {
  orientation: "horizontal" | "vertical";
  cursorPos: number;

  imageResolution: number;
  displaySize: number;
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={`
        relative bg-gray-200 border-gray-400 shadow-lg shadow-black/40
        select-none text-[10px] overflow-hidden
        ${isHorizontal ? "border-b" : "border-r"}
      `}
      style={isHorizontal ? { width: displaySize } : { height: displaySize }}
    >
      {/* --- Cursor marker --- */}
      <div
        className={`
          absolute bg-red-500 pointer-events-none
          ${isHorizontal ? "top-0 bottom-0 w-[2px]" : "left-0 right-0 h-[2px]"}
        `}
        style={isHorizontal ? { left: cursorPos } : { top: cursorPos }}
      />
    </div>
  );
};

export default Ruler;
