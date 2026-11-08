import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import { getFavorites } from "../../services/favorite";
import { useFavorites } from "../../context/FavoritesContext";
import { useI18n } from "../../i18n/I18nContext";

import type { Favorite } from "../../services/favorite";

import PageHeader from "../../components/PageHeader/PageHeader";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { PropertyGridSkeleton } from "../../components/Skeleton/Skeleton";

function Favorites() {
  const { remove } = useFavorites();
  const { t } = useI18n();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFavorites();
      setFavorites(data);
    } catch {
      setError(t("fav.loadFail"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (propertyId: number) => {
    try {
      setActionError("");
      await remove(propertyId);

      setFavorites((previous) =>
        previous.filter((item) => item.propertyId !== propertyId)
      );
    } catch {
      setActionError(t("fav.removeFail"));
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("fav.eyebrow")}
        title={t("fav.title")}
        subtitle={t("fav.subtitle")}
      />

      {actionError && <p className="alert alert-error mb-5">{actionError}</p>}

      {loading ? (
        <PropertyGridSkeleton count={3} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" />
      ) : error ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("common.loadFailed")}</h3>
          <p className="text-muted">{error}</p>
          <button className="btn btn-dark" onClick={fetchFavorites}>
            {t("common.retry")}
          </button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="empty-state">
          <Heart size={34} className="text-bronze-deep" />
          <h3 className="text-2xl">{t("fav.empty.title")}</h3>
          <p className="text-muted">{t("fav.empty.text")}</p>
          <Link to="/properties" className="btn btn-dark">
            {t("fav.empty.cta")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((item) => (
            <div className="flex flex-col gap-3" key={item.id}>
              <PropertyCard property={item.property} hideFavorite />

              <button
                className="btn btn-outline btn-sm w-full !text-bad hover:!border-red-600"
                onClick={() => handleRemove(item.propertyId)}
              >
                <Heart size={15} fill="currentColor" />
                {t("fav.remove")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
