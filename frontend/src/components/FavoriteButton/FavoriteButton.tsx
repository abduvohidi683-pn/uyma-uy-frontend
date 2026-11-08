import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { parseApiError } from "../../utils/apiErrors";
import "./FavoriteButton.css";

interface Props {
  propertyId: number;
  /** "text" — detail sahifadagi yozuvli tugma, "icon" — kartochkadagi yurakcha */
  variant?: "icon" | "text";
  onError?: (message: string) => void;
}

function FavoriteButton({ propertyId, variant = "icon", onError }: Props) {
  const { isLoggedIn } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);

  const active = isLoggedIn && isFavorite(propertyId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Guest bo'lsa: login'ga, kirgach shu sahifaga qaytadi
    if (!isLoggedIn) {
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }

    try {
      setBusy(true);
      onError?.("");
      await toggle(propertyId);
    } catch (err) {
      onError?.(parseApiError(err, "Amal bajarilmadi.").general);
    } finally {
      setBusy(false);
    }
  };

  const label = active ? "Sevimlilardan olib tashlash" : "Sevimlilarga qo'shish";

  if (variant === "text") {
    return (
      <button
        type="button"
        className="favorite-button"
        onClick={handleClick}
        disabled={busy}
      >
        {active ? "♥ Sevimlilardan olib tashlash" : "♡ Sevimlilarga qo'shish"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`favorite-icon ${active ? "active" : ""}`}
      onClick={handleClick}
      disabled={busy}
      aria-label={label}
      aria-pressed={active}
      title={label}
    >
      <Heart size={18} fill={active ? "currentColor" : "none"} />
    </button>
  );
}

export default FavoriteButton;
