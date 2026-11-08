import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LogoutButton.css";

function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <span>Chiqish</span>
    </button>
  );
}

export default LogoutButton;
