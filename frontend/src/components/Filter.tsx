import type { Category } from "../types/property";
import { useI18n } from "../i18n/I18nContext";
import DebouncedInput from "./DebouncedInput";

export interface FilterValues {
  city: string;
  category: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  rooms: string;
}

interface FilterProps {
  values: FilterValues;
  categories: Category[];
  onChange: (key: keyof FilterValues, value: string) => void;
  onClear: () => void;
  priceError?: string;
}

const fieldClass =
  "min-h-11 w-full rounded-[var(--radius-pill)] border border-line bg-card px-3.5 py-3 text-sm outline-none transition focus:border-bronze focus:ring-4 focus:ring-bronze/15";
const labelClass = "mt-4 text-[13px] font-medium tracking-normal";

/** Filter paneli: kompyuterda chap ustun, mobilda pastdan chiqadigan drawer ichida. */
function Filter({
  values,
  categories,
  onChange,
  onClear,
  priceError,
}: FilterProps) {
  const { t, catName } = useI18n();

  return (
    <div className="flex flex-col gap-1.5">
      <label className={labelClass} htmlFor="flt-city">
        {t("filter.city")}
      </label>
      <DebouncedInput
        id="flt-city"
        className={fieldClass}
        value={values.city}
        onCommit={(v) => onChange("city", v)}
        placeholder={t("filter.cityPh")}
      />

      <label className={labelClass} htmlFor="flt-category">
        {t("filter.category")}
      </label>
      <select
        id="flt-category"
        className={fieldClass}
        value={values.category}
        onChange={(e) => onChange("category", e.target.value)}
      >
        <option value="">{t("filter.allCategories")}</option>
        {categories.map((item) => (
          <option key={item.id} value={item.slug}>
            {catName(item)}
          </option>
        ))}
      </select>

      <label className={labelClass} htmlFor="flt-type">
        {t("filter.type")}
      </label>
      <select
        id="flt-type"
        className={fieldClass}
        value={values.type}
        onChange={(e) => onChange("type", e.target.value)}
      >
        <option value="">{t("common.all")}</option>
        <option value="SALE">{t("type.sale")}</option>
        <option value="RENT">{t("type.rent")}</option>
      </select>

      <span className={labelClass}>{t("filter.price")}</span>
      <div className="grid grid-cols-2 gap-2.5">
        <DebouncedInput
          className={fieldClass}
          type="number"
          min="0"
          aria-label={t("filter.minLabel")}
          value={values.minPrice}
          onCommit={(v) => onChange("minPrice", v)}
          placeholder={t("filter.min")}
        />
        <DebouncedInput
          className={fieldClass}
          type="number"
          min="0"
          aria-label={t("filter.maxLabel")}
          value={values.maxPrice}
          onCommit={(v) => onChange("maxPrice", v)}
          placeholder={t("filter.max")}
        />
      </div>

      {priceError && <p className="text-[13px] text-bad">{priceError}</p>}

      <label className={labelClass} htmlFor="flt-rooms">
        {t("filter.rooms")}
      </label>
      <select
        id="flt-rooms"
        className={fieldClass}
        value={values.rooms}
        onChange={(e) => onChange("rooms", e.target.value)}
      >
        <option value="">{t("common.all")}</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {t("filter.roomsN", { n })}
          </option>
        ))}
      </select>

      <button type="button" className="btn btn-outline mt-5" onClick={onClear}>
        {t("filter.clear")}
      </button>
    </div>
  );
}

export default Filter;
