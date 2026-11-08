import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  images: Array<{ id: number; url: string }>;
  index: number;
  alt: string;
  onChange: (index: number) => void;
  onClose: () => void;
}

/** Rasmni to'liq ekranda ko'rsatish: oldingi/keyingi tugmalari va klaviatura (←, →, Esc). */
function Lightbox({ images, index, alt, onChange, onClose }: Props) {
  const { t } = useI18n();
  const count = images.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onChange((index - 1 + count) % count);
      if (e.key === "ArrowRight") onChange((index + 1) % count);
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [index, count, onChange, onClose]);

  const btn =
    "absolute grid size-12 place-items-center rounded-lg bg-on-scrim/15 text-on-scrim backdrop-blur transition hover:bg-on-scrim/30";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-scrim/90 p-4"
      onClick={onClose}
    >
      <img
        src={images[index].url}
        alt={alt}
        className="max-h-[88vh] max-w-full rounded-xl object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        type="button"
        className={`${btn} right-4 top-4`}
        onClick={onClose}
        aria-label={t("gallery.close")}
      >
        <X size={22} />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            className={`${btn} left-3 top-1/2 -translate-y-1/2`}
            onClick={(e) => {
              e.stopPropagation();
              onChange((index - 1 + count) % count);
            }}
            aria-label={t("gallery.prev")}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            className={`${btn} right-3 top-1/2 -translate-y-1/2`}
            onClick={(e) => {
              e.stopPropagation();
              onChange((index + 1) % count);
            }}
            aria-label={t("gallery.next")}
          >
            <ChevronRight size={24} />
          </button>

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-[var(--radius-pill)] bg-on-scrim/15 px-4 py-1.5 text-sm text-on-scrim backdrop-blur">
            {t("gallery.counter", { i: index + 1, n: count })}
          </span>
        </>
      )}
    </div>
  );
}

export default Lightbox;
