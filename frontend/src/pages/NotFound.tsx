import StatusPage from "../components/StatusPage/StatusPage";
import { useI18n } from "../i18n/I18nContext";

function NotFound() {
  const { t } = useI18n();

  return (
    <StatusPage
      code="404"
      title={t("page.404.title")}
      text={t("page.404.text")}
    />
  );
}

export default NotFound;
