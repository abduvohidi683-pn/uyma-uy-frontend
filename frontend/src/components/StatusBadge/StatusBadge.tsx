import type { PropertyStatus } from "../../types/property";
import { useI18n } from "../../i18n/I18nContext";

const TONES: Record<PropertyStatus, string> = {
  PENDING: "bg-warn-bg text-warn",
  APPROVED: "bg-ok-bg text-ok",
  REJECTED: "bg-bad-bg text-bad",
};

/** PENDING — sariq, APPROVED — yashil, REJECTED — qizil (Notion 4-bo'lim). */
function StatusBadge({ status }: { status: PropertyStatus }) {
  const { t } = useI18n();

  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-1 text-xs ${TONES[status]}`}
    >
      {t(`status.${status}`)}
    </span>
  );
}

export default StatusBadge;
