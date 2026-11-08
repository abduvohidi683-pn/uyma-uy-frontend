import { useEffect, useMemo, useState } from "react";

import PageHeader from "../../../components/PageHeader/PageHeader";
import { RowsSkeleton } from "../../../components/Skeleton/Skeleton";
import { useI18n } from "../../../i18n/I18nContext";
import { getAdminUsers } from "../../../services/admin";
import type { AdminUser } from "../../../services/admin";
import { parseApiError } from "../../../utils/apiErrors";

type RoleFilter = "ALL" | "USER" | "ADMIN";

const ROLES: RoleFilter[] = ["ALL", "USER", "ADMIN"];

function AdminUsers() {
  const { t, d } = useI18n();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleFilter>("ALL");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    getAdminUsers()
      .then((data) => {
        if (cancelled) return;
        setUsers(data);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(parseApiError(err, t("adm.users.loadFail")).general);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      if (role !== "ALL" && user.role !== role) return false;
      if (!query) return true;
      return (
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    });
  }, [users, search, role]);


  const roleLabel = (value: RoleFilter) =>
    value === "ALL"
      ? t("common.all")
      : value === "USER"
        ? t("role.USER")
        : t("adm.users.admins");

  return (
    <div>
      <PageHeader
        eyebrow={t("adm.eyebrow")}
        title={t("adm.users.title")}
        subtitle={t("adm.users.subtitle")}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="text"
          className="input !min-h-11 !w-auto min-w-[220px] max-w-[420px] flex-1 !rounded-[var(--radius-pill)] !py-2.5 !text-sm"
          placeholder={t("adm.users.searchPh")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label={t("common.search")}
        />

        {!loading && !error && (
          <span className="text-sm text-muted">
            {t("adm.users.count", { a: filtered.length, b: users.length })}
          </span>
        )}

        <div
          role="tablist"
          className="ml-auto inline-flex max-w-full gap-1 overflow-x-auto rounded-[var(--radius-pill)] border border-line bg-card p-1"
        >
          {ROLES.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={role === value}
              className={`min-h-10 shrink-0 cursor-pointer rounded-[var(--radius-pill)] px-4 text-[13px] font-medium transition ${
                role === value
                  ? "bg-charcoal text-paper"
                  : "text-ink/70 hover:bg-charcoal/10 hover:text-ink"
              }`}
              onClick={() => setRole(value)}
            >
              {roleLabel(value)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <RowsSkeleton count={5} />
      ) : error ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("common.loadFailed")}</h3>
          <p className="text-muted">{error}</p>
          <button
            className="btn btn-dark"
            onClick={() => {
              setLoading(true);
              setReloadKey((key) => key + 1);
            }}
          >
            {t("common.retry")}
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("adm.users.none")}</h3>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("adm.users.noMatch")}</h3>
          <p className="text-muted">{t("adm.users.noMatchText")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-line bg-card">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="bg-paper-2 text-left text-xs font-medium tracking-normal text-muted">
                <th className="px-5 py-4">{t("adm.col.id")}</th>
                <th className="px-5 py-4">{t("adm.col.user")}</th>
                <th className="px-5 py-4">{t("adm.col.phone")}</th>
                <th className="px-5 py-4">{t("adm.col.role")}</th>
                <th className="px-5 py-4">{t("adm.col.listings")}</th>
                <th className="px-5 py-4">{t("adm.col.registered")}</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-line text-sm transition hover:bg-paper-2"
                >
                  <td className="px-5 py-4 text-muted">{user.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-charcoal font-serif font-medium text-bronze-light">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{user.fullName}</p>
                        <p className="truncate text-xs text-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">{user.phone || "—"}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-[var(--radius-pill)] px-3 py-1 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-charcoal text-paper"
                          : "bg-bronze-soft text-bronze-deep"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">{user._count?.properties ?? 0}</td>
                  <td className="px-5 py-4">
                    {d(user.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
