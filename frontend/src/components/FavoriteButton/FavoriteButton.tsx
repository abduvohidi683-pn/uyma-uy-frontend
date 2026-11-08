import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useI18n } from "../../i18n/I18nContext";
import { parseApiError } from "../../utils/apiErrors";

interface Props {
  propertyId: number;
  /** "text" — detail sahifadagi yozuvli tugma, "icon" — kartochkadagi yurakcha */
  variant?: "icon" | "text";
  onError?: (message: string) => void;
}

function FavoriteButton({ propertyId, variant = "icon", onError }: Props) {
  const { isLoggedIn } = useAuth();
  const { isFavorite, toggle } = useFavorites();
  const { t } = useI18n();
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
      onError?.(parseApiError(err, t("detail.fav.fail")).general);
    } finally {
      setBusy(false);
    }
  };

  const label = active ? t("detail.fav.remove") : t("detail.fav.add");

  if (variant === "text") {
    return (
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] border border-ink bg-transparent px-5 text-sm transition-colors hover:bg-card disabled:cursor-wait disabled:opacity-60"
        onClick={handleClick}
        disabled={busy}
      >
        <Heart
          size={16}
          fill={active ? "currentColor" : "none"}
          className={active ? "text-bad" : ""}
        />
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`absolute right-3 top-3 z-[2] grid size-11 place-items-center rounded-[var(--radius-pill)] bg-paper transition-colors hover:bg-card disabled:cursor-wait disabled:opacity-60 ${
        active ? "text-bad" : "text-charcoal"
      }`}
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
