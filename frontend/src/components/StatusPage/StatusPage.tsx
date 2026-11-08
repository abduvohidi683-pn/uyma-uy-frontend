import { Link } from "react-router-dom";
import { useI18n } from "../../i18n/I18nContext";

interface StatusPageProps {
  code: string;
  title: string;
  text: string;
  linkTo?: string;
  linkLabel?: string;
}

/** 403 / 404 kabi to'liq sahifa holatlari uchun umumiy ko'rinish. */
function StatusPage({ code, title, text, linkTo = "/", linkLabel }: StatusPageProps) {
  const { t } = useI18n();

  return (
    <main className="flex min-h-[62vh] flex-col items-center justify-center px-4 py-14 text-center">
      <span className="font-serif text-[clamp(72px,12vw,120px)] font-medium leading-none text-bronze-deep">
        {code}
      </span>
      <h1 className="mb-2.5 mt-4 text-[clamp(26px,4vw,38px)]">{title}</h1>
      <p className="mb-7 max-w-md text-muted">{text}</p>
      <Link to={linkTo} className="btn btn-dark hover:bg-bronze">
        {linkLabel ?? t("page.backHome")}
      </Link>
    </main>
  );
}

export default StatusPage;
