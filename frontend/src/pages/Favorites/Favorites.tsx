import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import { getFavorites } from "../../services/favorite";
import { useFavorites } from "../../context/FavoritesContext";

import type { Favorite } from "../../services/favorite";

import "./Favorites.css";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

function Favorites() {
  const { remove } = useFavorites();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFavorites();
      setFavorites(data);
    } catch {
      setError("Sevimli e'lonlarni yuklab bo'lmadi. Login qilganingizni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (propertyId: number) => {
    try {
      await remove(propertyId);

      setFavorites((previous) =>
        previous.filter((item) => item.propertyId !== propertyId)
      );
    } catch {
      setError("E'lonni sevimlilardan olib tashlashda xatolik.");
    }
  };

  return (
    <main className="favorites-page">
      <div className="favorites-heading">
        <h1>Sevimli e'lonlar</h1>
        <p>Siz saqlab qo‘ygan uylar ro‘yxati.</p>
      </div>

      {loading ? (
        <Loading text="Yuklanmoqda..." />
      ) : error ? (
        <div className="favorites-message">
          <p>{error}</p>
          <button onClick={fetchFavorites}>Qayta urinish</button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="favorites-empty">
          <h2>Hozircha sevimli e'lonlar yo‘q</h2>
          <p>Yoqtirgan uylaringizni sevimlilarga qo‘shing.</p>
          <Link to="/properties">Uylarni ko‘rish</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <div className="favorite-item" key={item.id}>
              <PropertyCard property={item.property} hideFavorite />

              <button
                className="remove-favorite"
                onClick={() => handleRemove(item.propertyId)}
              >
                ♥ Sevimlilardan olib tashlash
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Favorites;