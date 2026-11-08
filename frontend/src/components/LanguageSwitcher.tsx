import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";
import { LANGS, LANG_LABELS } from "../i18n/translations";

/** UZ / RU / EN tanlagich: tugma + ochiladigan ro'yxat (to'liq til nomlari bilan). */
function LanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const light = tone === "light";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.language")}
        className={`inline-flex h-11 items-center gap-1.5 rounded-[var(--radius-pill)] border px-3 text-xs transition-colors ${
          light
            ? "border-paper/20 text-canvas hover:border-paper/50"
            : "border-line bg-card text-ink hover:border-charcoal"
        }`}
      >
        <Globe size={15} aria-hidden="true" />
        {lang.toUpperCase()}
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("nav.language")}
          className="absolute right-0 top-[calc(100%+8px)] z-[70] min-w-[170px] card p-1.5 text-ink"
        >
          {LANGS.map((code) => (
            <li key={code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={code === lang}
                onClick={() => {
                  setLang(code);
                  setOpen(false);
                }}
                className={`flex min-h-10 w-full items-center justify-between gap-3 px-3 text-sm transition-colors hover:bg-paper-2 ${
                  code === lang ? "bg-bronze-soft text-bronze-deep" : ""
                }`}
              >
                <span>{LANG_LABELS[code]}</span>
                {code === lang && <Check size={15} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSwitcher;
