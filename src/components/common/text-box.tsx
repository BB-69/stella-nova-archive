import { useEffect, useState, type ChangeEvent } from "react";

const TextBox = ({
  text,
  edit,
}: {
  text: string | null;
  edit?: {
    placeholder: string;
    num?: { isInt: boolean; range?: { s: number; e: number } };
  };
}) => {
  const [query, setQuery] = useState("");

  function checkNum(s: string, isInt: boolean): boolean {
    const intRegex = /^[0-9\b\-]+$/;
    const numRegex = /^[0-9\b\.\-]+$/;

    return (
      s.substring(1).indexOf("-") == -1 &&
      (isInt ? intRegex.test(s) : s.split(".").length < 3 && numRegex.test(s))
    );
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value === "" || (edit?.num ? checkNum(value, edit.num.isInt) : true)) {
      setQuery(value);
    }
  };

  function finalNumber(s: string): string {
    const r = edit?.num?.range;
    const clamp = (n: number) => {
      if (!r) return n;
      return Math.max(r.s, Math.min(r.e, n));
    };

    let arr = s.split(".");
    if (arr.length > 1) {
      const half1 = clamp(Number(arr[0]));

      const dec = arr[1];
      const half2 =
        dec.length > 1
          ? Math.round(Number(dec.charAt(0) + dec.charAt(1)) / 10)
          : Number(dec);
      return `${half1}.${
        (half1 == r?.s || half1 == r?.e) && half2 > 0 ? "0" : half2
      }`;
    }

    return String(`${clamp(Number(arr[0]))}${!edit?.num?.isInt ? ".0" : ""}`);
  }

  const handleInputBlur = () => {
    if (query === "") {
      setQuery(edit?.placeholder ?? "");
      return;
    }

    setQuery(edit?.num ? finalNumber(query) : query);
  };

  useEffect(() => {
    handleInputBlur();
  }, []);

  return (
    <>
      {edit != null ? (
        <input
          className={`text-sm p-[4px_8px] w-full
          flex justify-center items-center
          bg-white [.dark_&]:bg-black border rounded-md
          border-black/50 [.dark_&]:border-white/50
          ${text == null && "italic"}`}
          type="text"
          maxLength={69}
          value={query}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={edit.placeholder}
        />
      ) : (
        <span
          className={`text-sm p-[4px_8px]
          flex justify-center items-center
          bg-white [.dark_&]:bg-black border rounded-md
          border-black/50 [.dark_&]:border-white/50
          ${text == null && "italic"}`}
        >
          <div>{text ?? "< null >"}</div>
        </span>
      )}
    </>
  );
};

export default TextBox;
