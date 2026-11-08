import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Loading from "../components/Loading";
import PropertyCard from "../components/PropertyCard/PropertyCard";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import { deleteProperty, getMyProperties } from "../services/property";
import type { Property } from "../types/property";
import { parseApiError } from "../utils/apiErrors";

import "./MyProperties.css";

function MyProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getMyProperties()
      .then((data) => {
        if (cancelled) return;
        setProperties(data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(parseApiError(err, "E'lonlarni yuklashda xatolik yuz berdi.").general);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const handleDelete = async (property: Property) => {
    if (!window.confirm(`"${property.title}" e'lonini o'chirmoqchimisiz?`)) {
      return;
    }

    try {
      setActionError("");
      await deleteProperty(property.id);
      setProperties((prev) => prev.filter((item) => item.id !== property.id));
    } catch (err) {
      setActionError(
        parseApiError(err, "E'lonni o'chirishda xatolik yuz berdi.").general
      );
    }
  };

  if (loading) return <Loading text="Yuklanmoqda..." />;

  return (
    <div className="container my-properties-page">
      <div className="my-properties-top">
        <h1>Mening e'lonlarim</h1>

        <Link to="/create-property" className="my-properties-add">
          + Yangi e'lon qo'shish
        </Link>
      </div>

      {actionError && <p className="my-properties-error">{actionError}</p>}

      {error ? (
        <div className="my-properties-message">
          <p>{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setReloadKey((key) => key + 1);
            }}
          >
            Qayta urinish
          </button>
        </div>
      ) : properties.length === 0 ? (
        <div className="my-properties-message">
          <p>Siz hali e'lon joylamagansiz.</p>
          <Link to="/create-property">Birinchi e'loningizni qo'shing</Link>
        </div>
      ) : (
        <div className="my-properties-grid">
          {properties.map((property) => (
            <div className="my-property-item" key={property.id}>
              <PropertyCard property={property} />

              <div className="my-property-meta">
                <StatusBadge status={property.status} />
              </div>

              <div className="my-property-actions">
                <Link to={`/edit-property/${property.id}`}>Tahrirlash</Link>
                <button onClick={() => handleDelete(property)}>O'chirish</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProperties;
