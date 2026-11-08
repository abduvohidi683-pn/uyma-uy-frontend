import { useEffect, type ReactNode } from "react";
import { useI18n } from "../i18n/I18nContext";

interface Props {
  title: string;
  children: ReactNode;
  confirmLabel: string;
  busyLabel?: string;
  busy?: boolean;
  danger?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Tasdiqlash oynasi (o'chirish va shunga o'xshash qaytarib bo'lmas amallar uchun). */
function ConfirmDialog({
  title,
  children,
  confirmLabel,
  busyLabel,
  busy,
  danger,
  error,
  onConfirm,
  onCancel,
}: Props) {
  const { t } = useI18n();

  // Esc bilan yopish (klaviatura qulayligi)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-scrim/50 p-4 backdrop-blur-sm"
      onClick={() => !busy && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-[440px] rounded-3xl bg-card p-7 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2.5 text-[26px]">{title}</h3>
        <div className="text-muted">
          {children}
          <p className="mt-1">{t("common.confirmIrreversible")}</p>
        </div>

        {error && <p className="alert alert-error mt-4">{error}</p>}

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            className="btn btn-outline btn-sm"
            onClick={onCancel}
            disabled={busy}
          >
            {t("common.cancel")}
          </button>
          <button
            className={`btn btn-sm ${
              danger ? "bg-red-600 text-paper hover:bg-red-700" : "btn-dark"
            }`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? (busyLabel ?? t("common.loading")) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
