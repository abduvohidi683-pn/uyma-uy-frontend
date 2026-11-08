import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { getCategories } from "../../services/category";
import type { CreatePropertyData } from "../../services/property";
import type { Category } from "../../types/property";
import FieldError from "../FieldError";
import { useI18n } from "../../i18n/I18nContext";

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

/** Label + maydon + xato matni */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
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
  const { t, catName } = useI18n();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState<FormState>(
    initialValues ? toFormState(initialValues) : emptyForm
  );

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategoriesError(t("form.catFail")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      next.title = t("form.err.title");
    }
    if (form.description.trim().length < 20) {
      next.description = t("form.err.description");
    }
    if (!(price > 0)) next.price = t("form.err.price");
    if (!form.categoryId) next.categoryId = t("form.err.category");
    if (!form.city.trim()) next.city = t("form.err.city");
    if (!form.address.trim()) next.address = t("form.err.address");
    if (!(area > 0)) next.area = t("form.err.area");
    if (!Number.isInteger(rooms) || rooms < 1) {
      next.rooms = t("form.err.rooms");
    }
    if (!Number.isInteger(bathrooms) || bathrooms < 0) {
      next.bathrooms = t("form.err.baths");
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
    <form
      className="card flex flex-col p-5 sm:p-9"
      onSubmit={handleSubmit}
      noValidate
    >
      <Field id="pf-title" label={t("form.title")} error={fieldError("title")}>
        <input
          id="pf-title"
          name="title"
          className="input"
          placeholder={t("form.titlePh")}
          value={form.title}
          onChange={handleChange}
          maxLength={150}
        />
      </Field>

      <Field id="pf-description" label={t("form.description")} error={fieldError("description")}>
        <textarea
          id="pf-description"
          name="description"
          className="input resize-y"
          placeholder={t("form.descPh")}
          rows={5}
          value={form.description}
          onChange={handleChange}
        />
      </Field>

      <div className="grid gap-x-5 sm:grid-cols-2">
        <Field id="pf-price" label={t("form.price")} error={fieldError("price")}>
          <input
            id="pf-price"
            name="price"
            type="number"
            min="0"
            className="input"
            value={form.price}
            onChange={handleChange}
          />
        </Field>

        <Field id="pf-currency" label={t("form.currency")} error={fieldError("currency")}>
          <select
            id="pf-currency"
            name="currency"
            className="input"
            value={form.currency}
            onChange={handleChange}
          >
            <option value="USD">USD</option>
            <option value="UZS">UZS</option>
          </select>
        </Field>

        <Field id="pf-type" label={t("form.type")} error={fieldError("listingType")}>
          <select
            id="pf-type"
            name="listingType"
            className="input"
            value={form.listingType}
            onChange={handleChange}
          >
            <option value="SALE">{t("type.sale")}</option>
            <option value="RENT">{t("type.rent")}</option>
          </select>
        </Field>

        <Field id="pf-category" label={t("form.category")} error={fieldError("categoryId")}>
          <select
            id="pf-category"
            name="categoryId"
            className="input"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">{t("form.categoryPh")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {catName(category)}
              </option>
            ))}
          </select>
        </Field>

        <Field id="pf-city" label={t("form.city")} error={fieldError("city")}>
          <input
            id="pf-city"
            name="city"
            className="input"
            value={form.city}
            onChange={handleChange}
          />
        </Field>

        <Field id="pf-address" label={t("form.address")} error={fieldError("address")}>
          <input
            id="pf-address"
            name="address"
            className="input"
            value={form.address}
            onChange={handleChange}
          />
        </Field>
      </div>

      <div className="grid gap-x-5 sm:grid-cols-3">
        <Field id="pf-area" label={t("form.area")} error={fieldError("area")}>
          <input
            id="pf-area"
            name="area"
            type="number"
            min="0"
            className="input"
            value={form.area}
            onChange={handleChange}
          />
        </Field>

        <Field id="pf-rooms" label={t("form.rooms")} error={fieldError("rooms")}>
          <input
            id="pf-rooms"
            name="rooms"
            type="number"
            min="1"
            className="input"
            value={form.rooms}
            onChange={handleChange}
          />
        </Field>

        <Field id="pf-bathrooms" label={t("form.baths")} error={fieldError("bathrooms")}>
          <input
            id="pf-bathrooms"
            name="bathrooms"
            type="number"
            min="0"
            className="input"
            value={form.bathrooms}
            onChange={handleChange}
          />
        </Field>
      </div>

      {children}

      {shownError && <p className="alert alert-error mt-4">{shownError}</p>}

      <button
        type="submit"
        className="btn btn-dark mt-6 w-full py-4 text-[15px]"
        disabled={submitting}
      >
        {submitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}

export default PropertyForm;
