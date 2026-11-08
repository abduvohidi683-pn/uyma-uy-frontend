import { useState } from "react";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  /** Rasm asl nisbatini saqlab, to'liq ko'rinadi (kesilmaydi) */
  fit?: "contain" | "cover";
}

/**
 * Rasm kesilmasdan to'liq ko'rinadi: orqada xiralashtirilgan nusxa fon bo'lib,
 * old tomonda asl rasm aniq chiqadi. Yuklanmasa — matnli placeholder.
 */
function FitImage({ src, alt, className = "", eager, fit = "contain" }: Props) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`grid size-full place-items-center bg-gradient-to-br from-paper-2 to-paper-3 text-sm text-muted ${className}`}
      >
        {t("common.noImage")}
      </div>
    );
  }

  return (
    <div className={`relative size-full overflow-hidden bg-paper-2 ${className}`}>
      {fit === "contain" && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full scale-110 object-cover opacity-70 blur-2xl"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={`relative size-full ${
          fit === "contain" ? "object-contain" : "object-cover"
        }`}
      />
    </div>
  );
}

export default FitImage;
