import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import StatusPage from "../StatusPage/StatusPage";

function AdminGuard() {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Oddiy user admin sahifasiga kirsa — "Ruxsat yo'q" holati (Notion 8.1)
  if (!isAdmin) {
    return (
      <StatusPage
        code="403"
        title="Ruxsat yo'q"
        text="Bu sahifa faqat administratorlar uchun. Sizda kirish huquqi yo'q."
      />
    );
  }

  return <Outlet />;
}

export default AdminGuard;
