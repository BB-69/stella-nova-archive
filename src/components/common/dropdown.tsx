import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

const Dropdown = ({
  options,
  select,
  setSelect,
}: {
  options: string[];
  select?: string;
  setSelect?: Dispatch<SetStateAction<string>>;
}) => {
  const [selected, setSelected] = useState(
    select ?? options[0] ?? "< select >"
  );

  const updateSelect = (s: string) => {
    setSelected(s);
    setSelect?.(s);
  };

  useEffect(() => {
    if (select) updateSelect(select);
  }, [select]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSelect(e.target.value);
  };

  return (
    <div
      className="text-sm
      flex justify-center items-center
      bg-white [.dark_&]:bg-black border rounded-md
      border-black/20 [.dark_&]:border-white/20"
    >
      <select
        className="w-full h-full px-1 flex items-center
        rounded-md bg-white [.dark_&]:bg-black"
        value={selected}
        onChange={handleChange}
      >
        {(options.length > 0 ? options : ["< select >"]).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
