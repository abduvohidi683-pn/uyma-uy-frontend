import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

import PageHeader from "../../../components/PageHeader/PageHeader";
import StatusBadge from "../../../components/StatusBadge/StatusBadge";
import { RowsSkeleton } from "../../../components/Skeleton/Skeleton";
import { useI18n } from "../../../i18n/I18nContext";
import {
  getAdminProperties,
  updatePropertyStatus,
} from "../../../services/admin";
import type { Property } from "../../../types/property";
import { getImageUrl } from "../../../utils/format";
import { parseApiError } from "../../../utils/apiErrors";

type AdminStatus = "PENDING" | "APPROVED" | "REJECTED";

const STATUSES: AdminStatus[] = ["PENDING", "APPROVED", "REJECTED"];

function AdminProperties() {
  const { t, n } = useI18n();
  const [properties, setProperties] = useState<Property[]>([]);
  const [status, setStatus] = useState<AdminStatus>("PENDING");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [busyId, setBusyId] = useState<number | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAdminProperties(status, page, 12);

      setProperties(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
    } catch (err) {
      setError(parseApiError(err, t("adm.mod.loadFail")).general);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const query = search.trim().toLowerCase();
  const filtered = query
    ? properties.filter(
        (property) =>
          property.title.toLowerCase().includes(query) ||
          property.city.toLowerCase().includes(query) ||
          property.owner?.fullName.toLowerCase().includes(query)
      )
    : properties;

  const handleStatus = async (id: number, newStatus: "APPROVED" | "REJECTED") => {
    try {
      setBusyId(id);
      setActionError("");
      await updatePropertyStatus(id, newStatus);

      // Ro'yxat joriy holat bo'yicha filtrlangan: o'zgargan e'lon bu ro'yxatdan chiqadi
      setProperties((prev) => prev.filter((property) => property.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      setActionError(parseApiError(err, t("adm.mod.statusFail")).general);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("adm.eyebrow")}
        title={t("adm.mod.title")}
        subtitle={t("adm.mod.subtitle")}
        actions={
          <button className="btn btn-outline btn-sm" onClick={fetchProperties}>
            {t("common.refresh")}
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          className="input !min-h-11 !w-auto min-w-[220px] max-w-[420px] flex-1 !rounded-[var(--radius-pill)] !py-2.5 !text-sm"
          placeholder={t("adm.mod.searchPh")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t("common.search")}
        />

        {!loading && !error && (
          <span className="text-sm text-muted">{t("adm.mod.total", { n: total })}</span>
        )}

        <div
          role="tablist"
          className="ml-auto inline-flex max-w-full gap-1 overflow-x-auto rounded-[var(--radius-pill)] border border-line bg-card p-1"
        >
          {STATUSES.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={status === value}
              className={`min-h-10 shrink-0 cursor-pointer rounded-[var(--radius-pill)] px-4 text-[13px] font-medium transition ${
                status === value
                  ? "bg-charcoal text-paper"
                  : "text-ink/70 hover:bg-charcoal/10 hover:text-ink"
              }`}
              onClick={() => {
                setStatus(value);
                setPage(1);
              }}
            >
              {t(`status.${value}`)}
            </button>
          ))}
        </div>
      </div>

      {actionError && <p className="alert alert-error mb-5">{actionError}</p>}

      {loading ? (
        <RowsSkeleton count={4} />
      ) : error ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("common.loadFailed")}</h3>
          <p className="text-muted">{error}</p>
          <button className="btn btn-dark" onClick={fetchProperties}>
            {t("common.retry")}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("adm.mod.emptyTitle")}</h3>
          <p className="text-muted">{t("adm.mod.emptyText")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((property) => (
            <article
              className="card flex flex-col gap-4 p-[18px] md:flex-row md:items-center md:gap-[22px]"
              key={property.id}
            >
              {property.images?.[0] ? (
                <img
                  className="h-[180px] w-full shrink-0 rounded-2xl bg-paper-2 object-contain md:h-[110px] md:w-[150px]"
                  src={getImageUrl(property.images[0].url)}
                  alt={property.title}
                  loading="lazy"
                />
              ) : (
                <div className="grid h-[180px] w-full shrink-0 place-items-center rounded-2xl bg-paper-2 text-sm text-muted md:h-[110px] md:w-[150px]">
                  {t("common.noImageShort")}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="mb-1.5 text-[22px]">{property.title}</h3>

                <p className="text-sm text-muted">
                  {property.city}, {property.address} ·{" "}
                  <strong className="text-ink">
                    {n(property.price)} {property.currency}
                  </strong>
                </p>

                {property.owner && (
                  <p className="text-sm text-muted">
                    {t("adm.mod.owner", {
                      name: property.owner.fullName,
                      email: property.owner.email,
                    })}
                  </p>
                )}

                <p className="my-1.5 mb-2.5 text-sm text-muted">
                  {property.description.length > 140
                    ? `${property.description.slice(0, 140)}…`
                    : property.description}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={property.status} />
                  <Link
                    to={`/properties/${property.id}`}
                    className="text-[13px] font-medium text-bronze-deep"
                  >
                    {t("adm.mod.view")}
                  </Link>
                </div>
              </div>

              <div className="flex shrink-0 gap-2.5 md:flex-col">
                {status !== "APPROVED" && (
                  <button
                    className="btn btn-sm flex-1 bg-ok text-paper hover:bg-ok"
                    onClick={() => handleStatus(property.id, "APPROVED")}
                    disabled={busyId === property.id}
                  >
                    <Check size={15} />
                    {t("adm.mod.approve")}
                  </button>
                )}
                {status !== "REJECTED" && (
                  <button
                    className="btn btn-danger btn-sm flex-1"
                    onClick={() => handleStatus(property.id, "REJECTED")}
                    disabled={busyId === property.id}
                  >
                    <X size={15} />
                    {t("adm.mod.reject")}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-4 text-sm text-muted">
          <button
            className="btn btn-outline btn-sm"
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            {t("common.prev")}
          </button>

          <span>
            {page} / {totalPages}
          </span>

          <button
            className="btn btn-outline btn-sm"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            {t("common.next")}
          </button>
        </nav>
      )}
    </div>
  );
}

export default AdminProperties;
