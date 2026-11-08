import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import PageHeader from "../../components/PageHeader/PageHeader";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { PropertyGridSkeleton } from "../../components/Skeleton/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import { getFavorites } from "../../services/favorite";
import { getMyInquiries } from "../../services/inquiry";
import { getMyProperties } from "../../services/property";
import type { Property } from "../../types/property";
import { parseApiError } from "../../utils/apiErrors";

interface Data {
  properties: Property[];
  favorites: number;
  inquiries: number;
}

/** "Boshqaruv": faqat mavjud endpointlardan (GET /properties/my, /favorites, /inquiries/my) hisoblangan statistika. */
function Dashboard() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [properties, favorites, inquiries] = await Promise.all([
        getMyProperties(),
        getFavorites(),
        getMyInquiries(),
      ]);

      setData({
        properties,
        favorites: favorites.length,
        inquiries: inquiries.length,
      });
    } catch (err) {
      setError(parseApiError(err, t("dash.loadFail")).general);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const count = (status: Property["status"]) =>
    data?.properties.filter((p) => p.status === status).length ?? 0;

  const stats = data
    ? [
        { label: t("dash.stat.listings"), value: data.properties.length, tone: "", to: "/my-properties" },
        { label: t("dash.stat.pending"), value: count("PENDING"), tone: "text-warn", to: "/my-properties" },
        { label: t("dash.stat.approved"), value: count("APPROVED"), tone: "text-ok", to: "/my-properties" },
        { label: t("dash.stat.rejected"), value: count("REJECTED"), tone: "text-bad", to: "/my-properties" },
        { label: t("dash.stat.favorites"), value: data.favorites, tone: "", to: "/favorites" },
        { label: t("dash.stat.inquiries"), value: data.inquiries, tone: "", to: "/my-inquiries" },
      ]
    : [];

  return (
    <div>
      <PageHeader
        eyebrow={t("dash.eyebrow")}
        title={t("dash.hello", { name: user?.fullName.split(" ")[0] ?? "" })}
        subtitle={t("dash.subtitle")}
        actions={
          <Link to="/create-property" className="btn btn-dark">
            <Plus size={16} />
            {t("myp.new")}
          </Link>
        }
      />

      {error && (
        <div className="empty-state">
          <h3 className="text-2xl">{t("common.loadFailed")}</h3>
          <p className="text-muted">{error}</p>
          <button className="btn btn-dark" onClick={load}>
            {t("common.retry")}
          </button>
        </div>
      )}

      {loading && !data && !error && (
        <PropertyGridSkeleton count={3} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" />
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                to={stat.to}
                className="card flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-soft sm:p-6"
              >
                <span className="text-[13px] font-medium text-muted">{stat.label}</span>
                <strong className={`font-serif text-4xl font-medium leading-none ${stat.tone}`}>
                  {stat.value}
                </strong>
              </Link>
            ))}
          </div>

          <section className="mt-10">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl">{t("dash.recent")}</h2>
              <Link to="/my-properties" className="text-[13px] font-medium text-bronze-deep">
                {t("common.viewAll")}
              </Link>
            </div>

            {data.properties.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">{t("dash.noListings")}</p>
                <Link to="/create-property" className="btn btn-dark">
                  {t("myp.empty.cta")}
                </Link>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.properties.slice(0, 3).map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;
