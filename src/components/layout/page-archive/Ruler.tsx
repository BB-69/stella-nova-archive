const Ruler = ({
  orientation,
  cursorPos,
}: {
  orientation: "horizontal" | "vertical";
  cursorPos: number;
  label?: number;
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={`
        relative bg-gray-200 border-gray-400 select-none text-[10px] overflow-hidden
        ${isHorizontal ? "border-b" : "border-r"}
      `}
      style={{
        backgroundImage: isHorizontal
          ? `repeating-linear-gradient(to right, #000 0 1px, transparent 1px 10px)`
          : `repeating-linear-gradient(to bottom, #000 0 1px, transparent 1px 10px)`,
      }}
    >
      {/* --- Repeating ticks --- */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isHorizontal
            ? `
              repeating-linear-gradient(
                to right,
                #000 0 1px, transparent 1px 10px,
                #000 10px 2px, transparent 2px 50px
              )
            `
            : `
              repeating-linear-gradient(
                to bottom,
                #000 0 1px, transparent 1px 10px,
                #000 10px 2px, transparent 2px 50px
              )
            `,
        }}
      />

      {/* --- Cursor marker --- */}
      <div
        className={`
          absolute bg-red-500 pointer-events-none
          ${isHorizontal ? "top-0 bottom-0 w-[1px]" : "left-0 right-0 h-[1px]"}
        `}
        style={isHorizontal ? { left: cursorPos } : { top: cursorPos }}
      />
    </div>
  );
};

export default Ruler;
