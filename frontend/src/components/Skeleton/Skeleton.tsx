import { useI18n } from "../../i18n/I18nContext";

/** Property kartochkasi shaklidagi skeleton. */
export function PropertyCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col"
    >
      <div className="skeleton aspect-[4/3] rounded-xl" />
      <div className="flex flex-col gap-3 pt-4">
        <div className="skeleton h-6 w-2/5" />
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-3.5 w-[55%]" />
      </div>
    </div>
  );
}

/** Kartochkalar tarmog'i uchun yuklanish holati. */
export function PropertyGridSkeleton({
  count = 6,
  className = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <div
      className={`grid gap-x-8 gap-y-14 ${className}`}
      role="status"
      aria-label={t("common.loading")}
    >
      {Array.from({ length: count }, (_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Ro'yxat qatorlari uchun skeleton (jadval, murojaatlar). */
export function RowsSkeleton({ count = 4 }: { count?: number }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3.5" role="status" aria-label={t("common.loading")}>
      {Array.from({ length: count }, (_, i) => (
        <div className="skeleton h-[84px] rounded-2xl" key={i} />
      ))}
    </div>
  );
}
