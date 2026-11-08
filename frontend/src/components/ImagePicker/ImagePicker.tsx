import { useEffect, useMemo, useRef, useState } from "react";
import "./ImagePicker.css";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

interface ImagePickerProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

/** Rasm tanlash: tur/hajm tekshiruvi va preview bilan. Backend: jpg/png/webp, 5 MB. */
function ImagePicker({ files, onChange, disabled }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";

    const valid: File[] = [];
    const problems: string[] = [];

    for (const file of selected) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        problems.push(`${file.name}: faqat jpg, png yoki webp`);
      } else if (file.size > MAX_SIZE) {
        problems.push(`${file.name}: 5 MB dan katta`);
      } else {
        valid.push(file);
      }
    }

    setError(problems.join("; "));
    if (valid.length > 0) onChange([...files, ...valid]);
  };

  return (
    <div className="image-picker">
      <button
        type="button"
        className="image-picker-add"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        + Rasm qo'shish
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple
        hidden
        onChange={handleSelect}
      />

      {error && <p className="image-picker-error">{error}</p>}

      {files.length > 0 && (
        <ul className="image-picker-list">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`}>
              <img src={previews[index]} alt={file.name} />
              <button
                type="button"
                aria-label={`${file.name} ni olib tashlash`}
                onClick={() => onChange(files.filter((_, i) => i !== index))}
                disabled={disabled}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ImagePicker;
