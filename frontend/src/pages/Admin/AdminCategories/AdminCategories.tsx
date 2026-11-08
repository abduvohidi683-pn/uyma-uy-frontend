import { useEffect, useState, type FormEvent } from "react";

import Loading from "../../../components/Loading";
import AdminSidebar from "../../../components/AdminSidebar/AdminSidebar";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../../services/category";
import type { Category } from "../../../types/property";
import { getErrorMessage } from "../../../types/api";

import "../AdminUsers/AdminUsers.css";
import "./AdminCategories.css";

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
      setLoadError(getErrorMessage(err, "Kategoriyalarni yuklab bo'lmadi."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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
      setFormError("Kategoriya nomi bo'sh bo'lmasligi kerak.");
      return;
    }

    if (!SLUG_REGEX.test(cleanSlug)) {
      setFormError(
        "Slug faqat kichik harf (a-z), raqam va tiredan iborat bo'lsin."
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId === null) {
        await createCategory({ name: cleanName, slug: cleanSlug });
        setSuccess("Kategoriya qo'shildi.");
      } else {
        await updateCategory(editingId, { name: cleanName, slug: cleanSlug });
        setSuccess("Kategoriya yangilandi.");
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      // 409 (takror nom/slug) va 400 xabarlari serverdan keladi
      setFormError(getErrorMessage(err, "Saqlashda xatolik yuz berdi."));
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
      setSuccess(`"${deleteTarget.name}" o'chirildi.`);
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err) {
      // Masalan: kategoriyada e'lonlar bo'lsa backend 400 qaytaradi
      setDeleteError(getErrorMessage(err, "O'chirishda xatolik yuz berdi."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar active="categories" />

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Kategoriyalar</h1>
            <p>E'lon kategoriyalarini boshqarish</p>
          </div>
        </header>

        <form className="category-form" onSubmit={handleSubmit} noValidate>
          <h2>{editingId === null ? "Yangi kategoriya" : "Tahrirlash"}</h2>

          <div className="category-form-row">
            <div>
              <label htmlFor="category-name">Nomi</label>
              <input
                id="category-name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Masalan, Kvartiralar"
              />
            </div>

            <div>
              <label htmlFor="category-slug">Slug</label>
              <input
                id="category-slug"
                value={slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                placeholder="kvartira"
              />
            </div>
          </div>

          {formError && <p className="category-error">{formError}</p>}
          {success && <p className="category-success">{success}</p>}

          <div className="category-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saqlanmoqda..."
                : editingId === null
                  ? "Qo'shish"
                  : "Saqlash"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary"
                onClick={resetForm}
                disabled={saving}
              >
                Bekor qilish
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <Loading text="Yuklanmoqda..." />
        ) : loadError ? (
          <div>
            <p className="admin-error">{loadError}</p>
            <button onClick={fetchCategories}>Qayta urinish</button>
          </div>
        ) : categories.length === 0 ? (
          <p>Hozircha kategoriyalar yo'q.</p>
        ) : (
          <div className="admin-content">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nomi</th>
                  <th>Slug</th>
                  <th>Amallar</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                      <code>{category.slug}</code>
                    </td>
                    <td className="category-actions">
                      <button onClick={() => startEdit(category)}>
                        Tahrirlash
                      </button>
                      <button
                        className="danger"
                        onClick={() => {
                          setDeleteError("");
                          setDeleteTarget(category);
                        }}
                      >
                        O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {deleteTarget && (
        <div
          className="category-modal-backdrop"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="category-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Kategoriyani o'chirish</h3>
            <p>
              <strong>{deleteTarget.name}</strong> kategoriyasini
              o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </p>

            {deleteError && <p className="category-error">{deleteError}</p>}

            <div className="category-form-actions">
              <button
                className="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "O'chirilmoqda..." : "Ha, o'chirish"}
              </button>
              <button
                className="secondary"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategories;
