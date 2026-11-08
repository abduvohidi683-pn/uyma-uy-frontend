import { useI18n } from "../i18n/I18nContext";

interface LoadingProps {
  text?: string;
}

function Loading({ text }: LoadingProps) {
  const { t } = useI18n();

  return (
    <div
      className="flex min-h-[40vh] flex-col items-center justify-center gap-3.5 px-4 py-10 text-muted"
      role="status"
      aria-live="polite"
    >
      <span className="size-9 animate-spin rounded-full border-[3px] border-line border-t-bronze" />
      <span className="text-sm">{text ?? t("common.loading")}</span>
    </div>
  );
}

export default Loading;
