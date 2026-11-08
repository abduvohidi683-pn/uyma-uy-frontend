import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import StatusPage from "../StatusPage/StatusPage";

function AdminGuard() {
  const { isLoggedIn, isAdmin } = useAuth();
  const { t } = useI18n();

  // `from` saqlanmaydi: chiqib ketgan admin keyin oddiy user sifatida kirsa,
  // eski /admin manzilga qaytib ketmasligi uchun.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Oddiy user admin sahifasiga kirsa — "Ruxsat yo'q" holati (Notion 8.1)
  if (!isAdmin) {
    return (
      <StatusPage
        code="403"
        title={t("page.403.title")}
        text={t("page.403.text")}
      />
    );
  }

  return <Outlet />;
}

export default AdminGuard;
