import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Footer.css";

const YEAR = new Date().getFullYear();

function Footer() {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <Home size={22} strokeWidth={1.7} />
            <span>Uyma-uy</span>
          </Link>
          <p>
            O‘zbekiston bo‘ylab ko‘chmas mulklarni oson toping, sotib oling
            yoki ijaraga bering.
          </p>
        </div>

        <nav className="footer-links">
          <h4>Sahifalar</h4>
          <Link to="/">Bosh sahifa</Link>
          <Link to="/properties">Uylar</Link>
          <Link to={isLoggedIn ? "/create-property" : "/register"}>
            E’lon joylash
          </Link>
        </nav>

        <nav className="footer-links">
          <h4>Hisob</h4>
          {isLoggedIn ? (
            <>
              <Link to="/profile">Profil</Link>
              <Link to="/favorites">Sevimlilar</Link>
              <Link to="/my-inquiries">Murojaatlarim</Link>
            </>
          ) : (
            <>
              <Link to="/login">Kirish</Link>
              <Link to="/register">Ro‘yxatdan o‘tish</Link>
            </>
          )}
        </nav>
      </div>

      <div className="footer-bottom">
        <span>UYMA-UY © {YEAR}</span>
        <span>Barcha huquqlar himoyalangan</span>
      </div>
    </footer>
  );
}

export default Footer;
