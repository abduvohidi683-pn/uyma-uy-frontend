import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { getCategories } from "../../services/category";
import type { CreatePropertyData } from "../../services/property";
import type { Category } from "../../types/property";
import FieldError from "../FieldError";
import "./PropertyForm.css";

interface FormState {
  title: string;
  description: string;
  price: string;
  currency: "USD" | "UZS";
  listingType: "SALE" | "RENT";
  categoryId: string;
  address: string;
  city: string;
  area: string;
  rooms: string;
  bathrooms: string;
}

type FieldName = keyof FormState;
type FieldErrors = Partial<Record<FieldName, string>>;

const emptyForm: FormState = {
  title: "",
  description: "",
  price: "",
  currency: "USD",
  listingType: "SALE",
  categoryId: "",
  address: "",
  city: "",
  area: "",
  rooms: "1",
  bathrooms: "0",
};

const toFormState = (data: CreatePropertyData): FormState => ({
  title: data.title,
  description: data.description,
  price: String(data.price),
  currency: data.currency,
  listingType: data.listingType,
  categoryId: String(data.categoryId),
  address: data.address,
  city: data.city,
  area: String(data.area),
  rooms: String(data.rooms),
  bathrooms: String(data.bathrooms),
});

interface Props {
  initialValues?: CreatePropertyData;
  submitLabel: string;
  submittingLabel: string;
  submitting: boolean;
  /** Maydonga bog'lanmagan umumiy xato (forma tagida chiqadi) */
  error?: string;
  /** Backend (400) qaytargan maydon xatolari: maydon nomi -> xabar */
  serverFieldErrors?: Record<string, string>;
  onSubmit: (data: CreatePropertyData) => void | Promise<void>;
  /** Forma ichida, tugmadan oldin chiqadigan qo'shimcha maydonlar (masalan, rasmlar) */
  children?: ReactNode;
}

function PropertyForm({
  initialValues,
  submitLabel,
  submittingLabel,
  submitting,
  error,
  serverFieldErrors,
  onSubmit,
  children,
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<FormState>(
    initialValues ? toFormState(initialValues) : emptyForm
  );

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategoriesError("Kategoriyalarni yuklab bo'lmadi."));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Mijoz tekshiruvi xatosi serverniki bilan birga ko'rsatiladi
  const fieldError = (name: FieldName) =>
    errors[name] ?? serverFieldErrors?.[name];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const price = Number(form.price);
    const area = Number(form.area);
    const rooms = Number(form.rooms);
    const bathrooms = Number(form.bathrooms);

    const next: FieldErrors = {};

    const title = form.title.trim();
    if (title.length < 5 || title.length > 150) {
      next.title = "5 dan 150 tagacha belgi bo'lishi kerak";
    }
    if (form.description.trim().length < 20) {
      next.description = "Kamida 20 ta belgi bo'lishi kerak";
    }
    if (!(price > 0)) next.price = "0 dan katta bo'lishi kerak";
    if (!form.categoryId) next.categoryId = "Kategoriyani tanlang";
    if (!form.city.trim()) next.city = "Shaharni kiriting";
    if (!form.address.trim()) next.address = "Manzilni kiriting";
    if (!(area > 0)) next.area = "0 dan katta bo'lishi kerak";
    if (!Number.isInteger(rooms) || rooms < 1) {
      next.rooms = "Kamida 1 ta butun son";
    }
    if (!Number.isInteger(bathrooms) || bathrooms < 0) {
      next.bathrooms = "0 yoki undan katta butun son";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSubmit({
      title,
      description: form.description.trim(),
      price,
      currency: form.currency,
      listingType: form.listingType,
      categoryId: Number(form.categoryId),
      address: form.address.trim(),
      city: form.city.trim(),
      area,
      rooms,
      bathrooms,
    });
  };

  const shownError = error || categoriesError;

  return (
    <form className="property-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="pf-title">E'lon nomi</label>
      <input
        id="pf-title"
        name="title"
        placeholder="Masalan: Chilonzorda 3 xonali kvartira"
        value={form.title}
        onChange={handleChange}
        maxLength={150}
      />
      <FieldError message={fieldError("title")} />

      <label htmlFor="pf-description">Tavsif</label>
      <textarea
        id="pf-description"
        name="description"
        placeholder="Uy haqida batafsil ma'lumot (kamida 20 ta belgi)"
        rows={5}
        value={form.description}
        onChange={handleChange}
      />
      <FieldError message={fieldError("description")} />

      <div className="form-row">
        <div>
          <label htmlFor="pf-price">Narxi</label>
          <input
            id="pf-price"
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
          />
          <FieldError message={fieldError("price")} />
        </div>

        <div>
          <label htmlFor="pf-currency">Valyuta</label>
          <select
            id="pf-currency"
            name="currency"
            value={form.currency}
            onChange={handleChange}
          >
            <option value="USD">USD</option>
            <option value="UZS">UZS</option>
          </select>
          <FieldError message={fieldError("currency")} />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="pf-type">E'lon turi</label>
          <select
            id="pf-type"
            name="listingType"
            value={form.listingType}
            onChange={handleChange}
          >
            <option value="SALE">Sotiladi</option>
            <option value="RENT">Ijaraga</option>
          </select>
          <FieldError message={fieldError("listingType")} />
        </div>

        <div>
          <label htmlFor="pf-category">Kategoriya</label>
          <select
            id="pf-category"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">Kategoriyani tanlang</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <FieldError message={fieldError("categoryId")} />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="pf-city">Shahar</label>
          <input
            id="pf-city"
            name="city"
            value={form.city}
            onChange={handleChange}
          />
          <FieldError message={fieldError("city")} />
        </div>

        <div>
          <label htmlFor="pf-address">Manzil</label>
          <input
            id="pf-address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
          <FieldError message={fieldError("address")} />
        </div>
      </div>

      <div className="form-row three">
        <div>
          <label htmlFor="pf-area">Maydon (m²)</label>
          <input
            id="pf-area"
            name="area"
            type="number"
            min="0"
            value={form.area}
            onChange={handleChange}
          />
          <FieldError message={fieldError("area")} />
        </div>

        <div>
          <label htmlFor="pf-rooms">Xonalar</label>
          <input
            id="pf-rooms"
            name="rooms"
            type="number"
            min="1"
            value={form.rooms}
            onChange={handleChange}
          />
          <FieldError message={fieldError("rooms")} />
        </div>

        <div>
          <label htmlFor="pf-bathrooms">Hammomlar</label>
          <input
            id="pf-bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            value={form.bathrooms}
            onChange={handleChange}
          />
          <FieldError message={fieldError("bathrooms")} />
        </div>
      </div>

      {children}

      {shownError && <p className="form-error">{shownError}</p>}

      <button type="submit" className="form-submit" disabled={submitting}>
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}

export default PropertyForm;
