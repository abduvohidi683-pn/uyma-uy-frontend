import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";

import PageHeader from "../../../components/PageHeader/PageHeader";
import { RowsSkeleton } from "../../../components/Skeleton/Skeleton";
import { useI18n } from "../../../i18n/I18nContext";
import {
  getAdminProperties,
  getAdminUsers,
  updatePropertyStatus,
  type AdminUser,
} from "../../../services/admin";
import { getCategories } from "../../../services/category";
import type { Property } from "../../../types/property";
import { getImageUrl } from "../../../utils/format";
import { parseApiError } from "../../../utils/apiErrors";

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  users: number;
  categories: number;
}

function AdminDashboard() {
  const { t, n } = useI18n();
  const [stats, setStats] = useState<Stats | null>(null);
  const [queue, setQueue] = useState<Property[]>([]);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Hammasi Notion'dagi mavjud endpointlar: /admin/properties, /admin/users, /categories
      const [pending, approved, rejected, users, categories] =
        await Promise.all([
          getAdminProperties("PENDING", 1, 5),
          getAdminProperties("APPROVED", 1, 1),
          getAdminProperties("REJECTED", 1, 1),
          getAdminUsers(),
          getCategories(),
        ]);

      setStats({
        pending: pending.meta.total,
        approved: approved.meta.total,
        rejected: rejected.meta.total,
        users: users.length,
        categories: categories.length,
      });
      setQueue(pending.data);
      setRecentUsers(users.slice(0, 5));
    } catch (err) {
      setError(parseApiError(err, t("adm.dash.loadFail")).general);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const moderate = async (id: number, status: "APPROVED" | "REJECTED") => {
    try {
      setBusyId(id);
      setActionError("");
      await updatePropertyStatus(id, status);
      await load();
    } catch (err) {
      setActionError(parseApiError(err, t("adm.mod.statusFail")).general);
    } finally {
      setBusyId(null);
    }
  };

  const total = stats ? stats.pending + stats.approved + stats.rejected : 0;

  const cards: Array<{ label: string; value: number; tone: string; to: string }> =
    stats
      ? [
          { label: t("adm.stat.total"), value: total, tone: "", to: "/admin/properties" },
          { label: t("status.PENDING"), value: stats.pending, tone: "text-warn", to: "/admin/properties" },
          { label: t("status.APPROVED"), value: stats.approved, tone: "text-ok", to: "/admin/properties" },
          { label: t("status.REJECTED"), value: stats.rejected, tone: "text-bad", to: "/admin/properties" },
          { label: t("adm.stat.users"), value: stats.users, tone: "", to: "/admin/users" },
          { label: t("adm.stat.categories"), value: stats.categories, tone: "", to: "/admin/categories" },
        ]
      : [];

  return (
    <div>
      <PageHeader
        eyebrow={t("adm.eyebrow")}
        title={t("adm.dash.title")}
        subtitle={t("adm.dash.subtitle")}
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

      {loading && !stats && !error && <RowsSkeleton count={3} />}

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {cards.map((card) => (
              <Link
                key={card.label}
                to={card.to}
                className="card flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-soft sm:p-6"
              >
                <span className="text-[13px] font-medium text-muted">{card.label}</span>
                <strong className={`font-serif text-[40px] font-medium leading-none ${card.tone}`}>
                  {card.value}
                </strong>
              </Link>
            ))}
          </div>

          {actionError && <p className="alert alert-error mt-6">{actionError}</p>}

          <div className="mt-10 grid items-start gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            {/* Moderatsiya navbati */}
            <section className="card p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-2xl">{t("adm.queue.title")}</h2>
                <Link
                  to="/admin/properties"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-bronze-deep"
                >
                  {t("adm.all")} <ArrowRight size={14} />
                </Link>
              </div>

              {queue.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted">
                  {t("adm.queue.empty")}
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {queue.map((property) => (
                    <li
                      key={property.id}
                      className="flex flex-wrap items-center gap-3.5 rounded-2xl border border-line p-3"
                    >
                      {property.images?.[0] ? (
                        <img
                          src={getImageUrl(property.images[0].url)}
                          alt=""
                          loading="lazy"
                          className="size-16 shrink-0 rounded-xl bg-paper-2 object-contain"
                        />
                      ) : (
                        <div className="size-16 shrink-0 rounded-xl bg-paper-2" />
                      )}

                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/properties/${property.id}`}
                          className="block truncate font-medium hover:text-bronze-deep"
                        >
                          {property.title}
                        </Link>
                        <p className="truncate text-[13px] text-muted">
                          {property.city} · {n(property.price)} {property.currency}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="btn btn-sm bg-ok text-paper hover:bg-ok"
                          onClick={() => moderate(property.id, "APPROVED")}
                          disabled={busyId === property.id}
                          aria-label={t("adm.mod.approve")}
                        >
                          <Check size={15} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => moderate(property.id, "REJECTED")}
                          disabled={busyId === property.id}
                          aria-label={t("adm.mod.reject")}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Yangi foydalanuvchilar */}
            <section className="card p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-2xl">{t("adm.newUsers")}</h2>
                <Link
                  to="/admin/users"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-bronze-deep"
                >
                  {t("adm.all")} <ArrowRight size={14} />
                </Link>
              </div>

              <ul className="flex flex-col gap-3">
                {recentUsers.map((user) => (
                  <li key={user.id} className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-charcoal font-serif font-medium text-bronze-light">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{user.fullName}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                    {user.role === "ADMIN" && (
                      <span className="rounded-[var(--radius-pill)] bg-charcoal px-2.5 py-0.5 text-xs font-medium text-paper">
                        Admin
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
