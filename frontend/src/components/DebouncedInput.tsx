import { useEffect, useState, type InputHTMLAttributes } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface Props
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: string;
  onCommit: (value: string) => void;
  delay?: number;
}

/** Yozish to'xtagandan keyin (delay ms) qiymatni yuboradi — har harfda so'rov ketmaydi. */
function DebouncedInput({ value, onCommit, delay = 500, ...rest }: Props) {
  const [draft, setDraft] = useState(value);
  const debounced = useDebounce(draft, delay);

  // Tashqaridan o'zgarsa (masalan "Filterlarni tozalash") — maydonni yangilaymiz
  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (debounced !== value) onCommit(debounced);
    // faqat yozilgan qiymat o'zgarganda ishlasin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <input {...rest} value={draft} onChange={(e) => setDraft(e.target.value)} />
  );
}

export default DebouncedInput;
