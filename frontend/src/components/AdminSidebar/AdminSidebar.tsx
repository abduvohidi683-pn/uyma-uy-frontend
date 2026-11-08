
import { Link } from "react-router-dom";
import "./AdminSidebar.css";
import LogoutButton from "../LogoutButton/LogoutButton";

interface AdminSidebarProps {
  active: "dashboard" | "properties" | "categories" | "users";
}

function AdminSidebar({ active }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <h2>UyJoy Admin</h2>

      <nav>
        <Link
          to="/admin"
          className={active === "dashboard" ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/properties"
          className={active === "properties" ? "active" : ""}
        >
          E'lonlar
        </Link>

        <Link
          to="/admin/categories"
          className={active === "categories" ? "active" : ""}
        >
          Kategoriyalar
        </Link>

        <Link
          to="/admin/users"
          className={active === "users" ? "active" : ""}
        >
          Foydalanuvchilar
        </Link>

        <LogoutButton />
      </nav>
    </aside>
  );
}

export default AdminSidebar;
