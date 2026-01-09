import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";

const TextBox = ({
  text,
  foldOnInactive,
  edit,
  setText,
}: {
  text: string | null;
  foldOnInactive?: boolean;
  edit?: {
    initText?: string;
    placeholder: string;
    applyPlaceholder?: boolean;
    convert?: (s: string) => string;
    check?: (s: string) => boolean;
    checkFinal?: (s: string) => string;
    num?: { isInt: boolean; range?: { s: number; e: number } };
  };
  setText?: Dispatch<SetStateAction<string>>;
}) => {
  const [query, setQuery] = useState("");

  const updateQuery = (s: string) => {
    setQuery(edit?.convert?.(s) ?? s);
    setText?.(edit?.convert?.(s) ?? s);
  };

  useEffect(() => {
    if (text) updateQuery(text);
  }, [text]);

  function checkNum(s: string, isInt: boolean): boolean {
    const intRegex = /^[0-9\b\-]+$/;
    const numRegex = /^[0-9\b\.\-]+$/;

    return (
      s.substring(1).indexOf("-") == -1 &&
      (isInt ? intRegex.test(s) : s.split(".").length < 3 && numRegex.test(s))
    );
  }

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (
      value === "" ||
      (edit?.check
        ? edit.check(value)
        : edit?.num
        ? checkNum(value, edit.num.isInt)
        : true)
    ) {
      setQuery(edit?.convert?.(value) ?? value);
    }
  };

  const handleInputBlur = () => {
    if (query === "") {
      updateQuery(
        edit && (edit.applyPlaceholder ?? true) ? edit.placeholder : ""
      );
      return;
    }

    if (edit?.checkFinal) {
      updateQuery(edit.checkFinal(query));
      return;
    }

    updateQuery(edit?.num ? finalNumber(query) : query);
  };

  useEffect(() => {
    if (edit?.initText) updateQuery(edit.initText);
    handleInputBlur();
  }, [edit?.placeholder]);

  return (
    <>
      {edit != null ? (
        <input
          className={`text-sm p-[4px_8px] w-full
          flex justify-center items-center
          bg-white/60 [.dark_&]:bg-black/60 border rounded-md
          border-black/20 [.dark_&]:border-white/20
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
          border-black/70 [.dark_&]:border-white/70
          ${text == null && "italic"}
          ${
            foldOnInactive &&
            "justify-start overflow-hidden whitespace-nowrap hover:whitespace-normal"
          }`}
        >
          <div>{text ?? "< null >"}</div>
        </span>
      )}
    </>
  );
};

export default TextBox;
