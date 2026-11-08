import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../i18n/I18nContext";

function LogoutButton({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useI18n();

  const handleLogout = () => {
    logout();
    // state yo'q: aks holda login'dan keyin eski (masalan /admin) manzilga qaytib ketardi
    navigate("/login", { replace: true, state: null });
  };

  return (
    <button
      className={`min-h-11 rounded-[var(--radius-pill)] border border-line bg-transparent px-[18px] text-xs font-medium tracking-normal transition hover:border-bad hover:bg-bad hover:text-paper ${className}`}
      onClick={handleLogout}
    >
      {t("nav.logout")}
    </button>
  );
}

export default LogoutButton;
