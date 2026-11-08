import { useEffect, useState, type FormEvent } from "react";

import ConfirmDialog from "../../../components/ConfirmDialog";
import PageHeader from "../../../components/PageHeader/PageHeader";
import { RowsSkeleton } from "../../../components/Skeleton/Skeleton";
import { useI18n } from "../../../i18n/I18nContext";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../services/category";
import type { Category } from "../../../types/property";
import { parseApiError } from "../../../utils/apiErrors";

// Backend bilan bir xil qoida: kichik harf, raqam va tire
const SLUG_REGEX = /^[a-z0-9-]+$/;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['‘’`ʻ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function AdminCategories() {
  const { t } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setLoadError("");
      setCategories(await getCategories());
    } catch (err) {
      setLoadError(parseApiError(err, t("adm.cat.loadFail")).general);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setSlugTouched(false);
    setFormError("");
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setSlugTouched(true);
    setFormError("");
    setSuccess("");
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Slug'ni qo'lda o'zgartirmagan bo'lsa, nomdan avtomatik yasaymiz
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanSlug = slug.trim();

    if (!cleanName) {
      setFormError(t("adm.cat.nameEmpty"));
      return;
    }

    if (!SLUG_REGEX.test(cleanSlug)) {
      setFormError(t("adm.cat.slugInvalid"));
      return;
    }

    try {
      setSaving(true);

      if (editingId === null) {
        await createCategory({ name: cleanName, slug: cleanSlug });
        setSuccess(t("adm.cat.added"));
      } else {
        await updateCategory(editingId, { name: cleanName, slug: cleanSlug });
        setSuccess(t("adm.cat.updated"));
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      // 409 (takror nom/slug) va 400 xabarlari serverdan keladi
      const parsed = parseApiError(err, t("adm.cat.saveFail"));
      setFormError(parsed.general || Object.values(parsed.fields).join(", "));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setDeleteError("");

      await deleteCategory(deleteTarget.id);

      if (editingId === deleteTarget.id) resetForm();
      setSuccess(t("adm.cat.deleted", { name: deleteTarget.name }));
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err) {
      // Masalan: kategoriyada e'lonlar bo'lsa backend 400 qaytaradi
      setDeleteError(parseApiError(err, t("adm.cat.deleteFail")).general);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow={t("adm.eyebrow")}
        title={t("adm.cat.title")}
        subtitle={t("adm.cat.subtitle")}
      />

      <form
        className="card mb-7 max-w-[780px] p-5 sm:p-7"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="mb-4 text-2xl">
          {editingId === null ? t("adm.cat.newTitle") : t("adm.cat.editTitle")}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label !mt-0" htmlFor="category-name">
              {t("adm.col.name")}
            </label>
            <input
              id="category-name"
              className="input"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={t("adm.cat.namePh")}
            />
          </div>

          <div>
            <label className="field-label !mt-0" htmlFor="category-slug">
              {t("adm.col.slug")}
            </label>
            <input
              id="category-slug"
              className="input"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder={t("adm.cat.slugPh")}
            />
          </div>
        </div>

        {formError && <p className="alert alert-error mt-3.5">{formError}</p>}
        {success && <p className="alert alert-success mt-3.5">{success}</p>}

        <div className="mt-[18px] flex gap-2.5">
          <button type="submit" className="btn btn-dark btn-sm" disabled={saving}>
            {saving
              ? t("common.saving")
              : editingId === null
                ? t("common.add")
                : t("common.save")}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={resetForm}
              disabled={saving}
            >
              {t("common.cancel")}
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <RowsSkeleton count={4} />
      ) : loadError ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("common.loadFailed")}</h3>
          <p className="text-muted">{loadError}</p>
          <button className="btn btn-dark" onClick={fetchCategories}>
            {t("common.retry")}
          </button>
        </div>
      ) : categories.length === 0 ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("adm.cat.empty")}</h3>
          <p className="text-muted">{t("adm.cat.emptyText")}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-line bg-card">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="bg-paper-2 text-left text-xs font-medium tracking-normal text-muted">
                <th className="px-5 py-4">{t("adm.col.id")}</th>
                <th className="px-5 py-4">{t("adm.col.name")}</th>
                <th className="px-5 py-4">{t("adm.col.slug")}</th>
                <th className="px-5 py-4">{t("adm.col.actions")}</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-line text-sm transition hover:bg-paper-2"
                >
                  <td className="px-5 py-4 text-muted">{category.id}</td>
                  <td className="px-5 py-4 font-medium">{category.name}</td>
                  <td className="px-5 py-4">
                    <code className="rounded-md bg-canvas px-2 py-1 text-xs">
                      {category.slug}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => startEdit(category)}
                      >
                        {t("common.edit")}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setDeleteError("");
                          setDeleteTarget(category);
                        }}
                      >
                        {t("common.delete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title={t("adm.cat.deleteTitle")}
          confirmLabel={t("myp.delete.confirm")}
          busyLabel={t("myp.delete.busy")}
          busy={deleting}
          danger
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        >
          <p>{t("adm.cat.deleteText", { name: deleteTarget.name })}</p>
        </ConfirmDialog>
      )}
    </div>
  );
}

export default AdminCategories;
