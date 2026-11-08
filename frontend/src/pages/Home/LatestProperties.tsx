import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../../components/Loading";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { getProperties } from "../../services/property";
import { getCategories } from "../../services/category";
import type { Category, Property } from "../../types/property";
import { parseApiError } from "../../utils/apiErrors";

import "./LatestProperties.css";

/** Bosh sahifa: kategoriyalar (filter havolalari) va eng yangi e'lonlar. */
function LatestProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getProperties({ page: 1, limit: 6, sort: "newest" }),
      getCategories(),
    ])
      .then(([result, categoryData]) => {
        if (cancelled) return;
        setProperties(result.data);
        setCategories(categoryData);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(parseApiError(err, "E'lonlarni yuklab bo'lmadi.").general);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  return (
    <section className="latest-section">
      <div className="latest-heading">
        <h2>Yangi e'lonlar</h2>
        <Link to="/properties">Hammasini ko'rish →</Link>
      </div>

      {categories.length > 0 && (
        <div className="latest-categories">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/properties?category=${encodeURIComponent(category.slug)}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      {loading ? (
        <Loading text="E'lonlar yuklanmoqda..." />
      ) : error ? (
        <div className="latest-message">
          <p>{error}</p>
          <button onClick={retry}>Qayta urinish</button>
        </div>
      ) : properties.length === 0 ? (
        <p className="latest-message">Hozircha e'lonlar yo'q.</p>
      ) : (
        <div className="latest-grid">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </section>
  );
}

export default LatestProperties;
