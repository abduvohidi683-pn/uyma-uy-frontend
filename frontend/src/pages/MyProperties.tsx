import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import ConfirmDialog from "../components/ConfirmDialog";
import PageHeader from "../components/PageHeader/PageHeader";
import PropertyCard from "../components/PropertyCard/PropertyCard";
import StatusBadge from "../components/StatusBadge/StatusBadge";
import { PropertyGridSkeleton } from "../components/Skeleton/Skeleton";
import { useI18n } from "../i18n/I18nContext";
import { deleteProperty, getMyProperties } from "../services/property";
import type { Property } from "../types/property";
import { parseApiError } from "../utils/apiErrors";

function MyProperties() {
  const { t } = useI18n();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

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
        setError(parseApiError(err, t("myp.loadFail")).general);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setActionError("");
      await deleteProperty(deleteTarget.id);
      setProperties((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    } catch (err) {
      setActionError(parseApiError(err, t("myp.delete.fail")).general);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("myp.eyebrow")}
        title={t("myp.title")}
        subtitle={t("myp.subtitle")}
        actions={
          <Link to="/create-property" className="btn btn-dark">
            <Plus size={16} />
            {t("myp.new")}
          </Link>
        }
      />

      {actionError && <p className="alert alert-error mb-5">{actionError}</p>}

      {loading ? (
        <PropertyGridSkeleton count={3} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" />
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
      ) : properties.length === 0 ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("myp.empty.title")}</h3>
          <p className="text-muted">{t("myp.empty.text")}</p>
          <Link to="/create-property" className="btn btn-dark">
            {t("myp.empty.cta")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {properties.map((property) => (
            <div className="flex flex-col gap-3" key={property.id}>
              <PropertyCard property={property} />

              <div>
                <StatusBadge status={property.status} />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  to={`/edit-property/${property.id}`}
                  className="btn btn-outline btn-sm"
                >
                  {t("common.edit")}
                </Link>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => setDeleteTarget(property)}
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={t("myp.delete.title")}
          confirmLabel={t("myp.delete.confirm")}
          busyLabel={t("myp.delete.busy")}
          busy={deleting}
          danger
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        >
          <p>{t("myp.delete.text", { title: deleteTarget.title })}</p>
        </ConfirmDialog>
      )}
    </div>
  );
}

export default MyProperties;
