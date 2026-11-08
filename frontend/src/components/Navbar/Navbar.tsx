import { Link, NavLink, useLocation } from "react-router-dom";
import { Home, Heart, User, Plus, ShieldCheck } from "lucide-react";
import "./Navbar.css";
import LogoutButton from "../LogoutButton/LogoutButton";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { isLoggedIn, isAdmin, user } = useAuth();
  const { pathname } = useLocation();

  // Admin sahifalarida o'zining AdminSidebar menyusi bor
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <Home size={27} strokeWidth={1.7} />
        <span>Uyma-uy</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" end>
          Bosh sahifa
        </NavLink>
        <NavLink to="/properties">Uylar</NavLink>

        {isLoggedIn && (
          <>
            <NavLink to="/favorites">
              <Heart size={17} />
              Sevimlilar
            </NavLink>
            <NavLink to="/my-inquiries">Murojaatlarim</NavLink>
            <NavLink to="/my-properties">Mening e'lonlarim</NavLink>
          </>
        )}

        {isAdmin && (
          <NavLink to="/admin" className="nav-admin">
            <ShieldCheck size={17} />
            Admin panel
          </NavLink>
        )}
      </nav>

      <div className="nav-actions">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="nav-user" title={user?.email}>
              <span className="nav-avatar">
                {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
              </span>
              <span className="nav-user-name">{user?.fullName}</span>
            </Link>

            <Link to="/create-property" className="register-btn">
              <Plus size={15} />
              E'lon qo'shish
            </Link>

            <LogoutButton />
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">
              <User size={17} />
              Kirish
            </Link>

            <Link to="/register" className="register-btn">
              E’lon joylash
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
