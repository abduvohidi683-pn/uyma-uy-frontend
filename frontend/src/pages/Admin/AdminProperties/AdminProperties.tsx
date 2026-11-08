
import Loading from "../../../components/Loading";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../../utils/format";
import {
  getAdminProperties,
  updatePropertyStatus,
} from "../../../services/admin";
import type { Property } from "../../../types/property";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import "./AdminProperties.css";

type AdminStatus = "PENDING" | "APPROVED" | "REJECTED";

function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [status, setStatus] = useState<AdminStatus>("PENDING");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminProperties(status, page, 12);

      setProperties(response.data);
      setTotalPages(response.meta.totalPages);
    } catch {
      setError("E'lonlarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [status, page]);

  const filteredProperties = properties.filter((property) =>
    property.title.toLowerCase().includes(search.toLowerCase()) ||
    property.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatus = async (
    id: number,
    newStatus: "APPROVED" | "REJECTED"
  ) => {
    try {
      await updatePropertyStatus(id, newStatus);

      setProperties((prev) =>
        prev.filter((property) => property.id !== id)
      );
    } catch {
      setError("E'lon holatini o'zgartirishda xatolik.");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar active="properties" />

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>E'lonlarni boshqarish</h1>
            <p>UyJoy platformasidagi barcha e'lonlar</p>
          </div>

          <button onClick={fetchProperties}>
            Yangilash
          </button>
        </header>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="E'lon nomi yoki shahar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as AdminStatus);
              setPage(1);
            }}
          >
            <option value="PENDING">Kutilayotgan</option>
            <option value="APPROVED">Tasdiqlangan</option>
            <option value="REJECTED">Rad etilgan</option>
          </select>
        </div>

        {loading ? (
          <Loading text="Yuklanmoqda..." />
        ) : error ? (
          <p className="admin-error">{error}</p>
        ) : filteredProperties.length === 0 ? (
          <p>E'lonlar topilmadi.</p>
        ) : (
          <div className="admin-property-list">
            {filteredProperties.map((property) => (
              <article
                className="admin-property-card"
                key={property.id}
              >
                {property.images?.[0] && (
                  <img
                    className="admin-property-thumb"
                    src={getImageUrl(property.images[0].url)}
                    alt={property.title}
                  />
                )}

                <div className="admin-property-info">
                  <h3>{property.title}</h3>

                  <p>
                    {property.city}, {property.address}
                  </p>

                  <p>
                    {property.price.toLocaleString("en-US")}{" "}
                    {property.currency}
                  </p>

                  {property.owner && (
                    <p>
                      Egasi: {property.owner.fullName} ({property.owner.email})
                    </p>
                  )}

                  <p className="admin-property-desc">
                    {property.description.length > 140
                      ? `${property.description.slice(0, 140)}…`
                      : property.description}
                  </p>

                  <StatusBadge status={property.status} />{" "}
                  <Link to={`/properties/${property.id}`}>Batafsil ko'rish</Link>
                </div>

                {status === "PENDING" && (
                  <div className="admin-actions">
                    <button
                      className="approve-btn"
                      onClick={() =>
                        handleStatus(
                          property.id,
                          "APPROVED"
                        )
                      }
                    >
                      Tasdiqlash
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleStatus(
                          property.id,
                          "REJECTED"
                        )
                      }
                    >
                      Rad etish
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="admin-pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Oldingi
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Keyingi
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default AdminProperties;
