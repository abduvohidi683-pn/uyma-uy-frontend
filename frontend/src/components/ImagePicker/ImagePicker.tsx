import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../../i18n/I18nContext";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

interface ImagePickerProps {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
}

/** Rasm tanlash: tur/hajm tekshiruvi va preview bilan. Backend: jpg/png/webp, 5 MB. */
function ImagePicker({ files, onChange, disabled }: ImagePickerProps) {
  const { t } = useI18n();
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
        problems.push(t("img.badType", { name: file.name }));
      } else if (file.size > MAX_SIZE) {
        problems.push(t("img.tooBig", { name: file.name }));
      } else {
        valid.push(file);
      }
    }

    setError(problems.join("; "));
    if (valid.length > 0) onChange([...files, ...valid]);
  };

  return (
    <div className="my-2">
      <button
        type="button"
        className="min-h-11 rounded-xl border border-dashed border-bronze px-4 text-sm font-medium transition hover:bg-bronze-soft disabled:opacity-60"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        {t("img.add")}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple
        hidden
        onChange={handleSelect}
      />

      {error && <p className="mt-2 text-sm text-bad">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2.5">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="relative size-24">
              <img
                src={previews[index]}
                alt={file.name}
                className="size-full rounded-xl bg-paper-2 object-contain"
              />
              <button
                type="button"
                aria-label={t("img.remove", { name: file.name })}
                className="absolute -right-2 -top-2 grid size-8 place-items-center rounded-full bg-bad text-base leading-none text-paper"
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
