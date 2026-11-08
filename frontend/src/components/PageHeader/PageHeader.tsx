import { useEffect, type ReactNode } from "react";

interface Props {
  /** Bo'lim nomi: ekranda yorliq sifatida emas, brauzer sarlavhasida ko'rinadi */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

/** Barcha ichki sahifalar uchun yagona sarlavha: serif sarlavha + tavsif, ostida siyoh chiziq. */
function PageHeader({ eyebrow, title, subtitle, actions }: Props) {
  useEffect(() => {
    const previous = document.title;
    document.title = [title, eyebrow, "Uy-bozor"].filter(Boolean).join(" — ");
    return () => {
      document.title = previous;
    };
  }, [eyebrow, title]);

  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-ink pb-7">
      <div className="min-w-0">
        <h1 className="display">{title}</h1>
        {subtitle && <p className="mt-3 max-w-xl text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export default PageHeader;
