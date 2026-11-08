import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";

type Mode = "light" | "dark";

const STORAGE_KEY = "mode";

/** Hozirgi rejim: tanlangan bo'lsa o'sha, aks holda tizim sozlamasi. */
function currentMode(): Mode {
  const set = document.documentElement.dataset.mode;
  if (set === "dark" || set === "light") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Yorug' / qorong'u rejim almashtirgich. Tanlov localStorage'da saqlanadi. */
function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>(currentMode);

  // Foydalanuvchi hali tanlamagan bo'lsa, tizim rejimi o'zgarishini kuzatamiz
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!document.documentElement.dataset.mode) setMode(currentMode());
    };
    media.addEventListener("change", onChange);

    // Sahifadagi boshqa almashtirgich rejimni o'zgartirsa, belgi ham yangilanadi
    const observer = new MutationObserver(() => setMode(currentMode()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-mode"],
    });

    return () => {
      media.removeEventListener("change", onChange);
      observer.disconnect();
    };
  }, []);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // saqlash imkonsiz (maxfiy oyna) — rejim faqat shu sahifada amal qiladi
    }
    setMode(next);
  };

  const label = mode === "dark" ? t("nav.themeLight") : t("nav.themeDark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`grid size-11 shrink-0 place-items-center rounded-[var(--radius-pill)] border border-line text-ink transition-colors hover:border-ink ${className}`}
    >
      {mode === "dark" ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
    </button>
  );
}

export default ThemeToggle;
