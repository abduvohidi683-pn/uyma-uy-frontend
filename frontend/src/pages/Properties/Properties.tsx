import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getProperties } from "../../services/property";
import { getCategories } from "../../services/category";
import Filter from "../../components/Filter";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

import type {
  Property,
  PropertyMeta,
  Category,
} from "../../types/property";

import "./Properties.css";


function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [meta, setMeta] = useState<PropertyMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const city = searchParams.get("city") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const rooms = searchParams.get("rooms") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Kategoriyalarni yuklashda xatolik.");
      }
    };

    fetchCategories();
  }, []);

  const priceError =
    minPrice && maxPrice && Number(minPrice) > Number(maxPrice)
      ? "Minimal narx maksimal narxdan katta bo'lmasligi kerak."
      : "";

  useEffect(() => {
    if (priceError) {
      setLoading(false);
      return;
    }

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getProperties({
          page,
          limit: 12,
          city,
          category,
          type: type as "SALE" | "RENT" | "",
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          rooms: rooms ? Number(rooms) : undefined,
          sort: sort as "newest" | "price_asc" | "price_desc",
        });

        setProperties(result.data);
        setMeta(result.meta);
      } catch {
        setError("Uylarni yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [page, city, category, type, minPrice, maxPrice, rooms, sort, priceError]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.set("page", "1");
    }

    setSearchParams(params);
  };

  return (
    <main className="properties-page">
      <div className="properties-heading">
        <h1>Ko‘chmas mulklar</h1>
        <p>O‘zingizga mos uy yoki kvartirani toping.</p>
      </div>

      <div className="properties-layout">
        <Filter
          values={{ city, category, type, minPrice, maxPrice, rooms }}
          categories={categories}
          onChange={updateFilter}
          onClear={() => setSearchParams({})}
          priceError={priceError}
        />

        <section className="properties-results">
          <div className="results-top">
            <div>
              <h2>Barcha e’lonlar</h2>
              <p>{meta.total} ta e’lon topildi</p>
            </div>

            <select
              value={sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              <option value="newest">Eng yangilari</option>
              <option value="price_asc">Arzonidan qimmatiga</option>
              <option value="price_desc">Qimmatidan arzoniga</option>
            </select>
          </div>

          {priceError ? (
            <p className="page-message error-message">{priceError}</p>
          ) : loading ? (
            <Loading text="Uylar yuklanmoqda..." />
          ) : error ? (
            <p className="page-message error-message">{error}</p>
          ) : properties.length === 0 ? (
            <p className="page-message">Hozircha e’lonlar topilmadi.</p>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                />
              ))}
            </div>
          )}

          {!loading && !error && meta.totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={page <= 1}
                onClick={() => updateFilter("page", String(page - 1))}
              >
                Oldingi
              </button>

              <span>
                {meta.page} / {meta.totalPages}
              </span>

              <button
                disabled={page >= meta.totalPages}
                onClick={() => updateFilter("page", String(page + 1))}
              >
                Keyingi
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Properties;