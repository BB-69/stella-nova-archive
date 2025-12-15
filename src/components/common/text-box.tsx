const TextBox = ({ text }: { text: string | null }) => {
  return (
    <span
      className={`text-sm p-[4px_8px]
      flex justify-center items-center
      bg-white [.dark_&]:bg-black border rounded-md
      border-black/50 [.dark_&]:border-white/50
      ${text == null && "italic"}`}
    >
      <div>{text ?? "< null >"}</div>
    </span>
  );
};

export default TextBox;
