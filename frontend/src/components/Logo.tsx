import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  /** "light" — qorong'u fon ustida (ivory matn) */
  tone?: "dark" | "light";
  className?: string;
}

/** Uy-bozor belgisi: uy shaklidagi piktogramma + "Uy-bozor" yozuvi. */
function Logo({ tone = "dark", className = "" }: Props) {
  const { t } = useI18n();
  const light = tone === "light";

  return (
    <Link
      to="/"
      aria-label={t("brand.name")}
      className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}
    >
      <svg viewBox="0 0 40 40" className="size-8" aria-hidden="true">
        <rect
          width="40"
          height="40"
          rx="3"
          className={light ? "fill-paper" : "fill-ink"}
        />
        {/* tom */}
        <path
          d="M8.5 19.5 20 9l11.5 10.5"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={light ? "stroke-ink" : "stroke-bronze-light"}
        />
        {/* devor */}
        <path
          d="M12.5 17.5V30h15V17.5"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={light ? "stroke-ink" : "stroke-paper"}
        />
        {/* eshik */}
        <path
          d="M17.5 30v-6.5h5V30"
          fill="none"
          strokeWidth="2.4"
          strokeLinejoin="round"
          className={light ? "stroke-ink" : "stroke-bronze-light"}
        />
      </svg>
      <span
        className={`font-serif text-[26px] font-normal leading-none tracking-[var(--tracking-display)] ${
          light ? "text-paper" : "text-ink"
        }`}
      >
        Uy<span className={light ? "text-bronze-light" : "text-accent"}>-</span>bozor
      </span>
    </Link>
  );
}

export default Logo;
