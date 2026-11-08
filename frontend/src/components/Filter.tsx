import type { Category } from "../types/property";
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

/** Uylar sahifasidagi chap filter paneli. Stillari Properties.css da. */
function Filter({
  values,
  categories,
  onChange,
  onClear,
  priceError,
}: FilterProps) {
  return (
    <aside className="filter-panel">
      <h2>Filterlar</h2>

      <label>Shahar</label>
      <DebouncedInput
        value={values.city}
        onCommit={(v) => onChange("city", v)}
        placeholder="Masalan, Toshkent"
      />

      <label>Kategoriya</label>
      <select
        value={values.category}
        onChange={(e) => onChange("category", e.target.value)}
      >
        <option value="">Barcha kategoriyalar</option>
        {categories.map((item) => (
          <option key={item.id} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>

      <label>E’lon turi</label>
      <select
        value={values.type}
        onChange={(e) => onChange("type", e.target.value)}
      >
        <option value="">Barchasi</option>
        <option value="SALE">Sotuv</option>
        <option value="RENT">Ijara</option>
      </select>

      <label>Minimal narx</label>
      <DebouncedInput
        type="number"
        min="0"
        value={values.minPrice}
        onCommit={(v) => onChange("minPrice", v)}
        placeholder="Minimal narx"
      />

      <label>Maksimal narx</label>
      <DebouncedInput
        type="number"
        min="0"
        value={values.maxPrice}
        onCommit={(v) => onChange("maxPrice", v)}
        placeholder="Maksimal narx"
      />

      {priceError && (
        <p style={{ color: "#dc2626", fontSize: 13 }}>{priceError}</p>
      )}

      <label>Xonalar soni</label>
      <select
        value={values.rooms}
        onChange={(e) => onChange("rooms", e.target.value)}
      >
        <option value="">Barchasi</option>
        {[1, 2, 3, 4, 5].map((n) => (
          <option key={n} value={n}>
            {n} xona
          </option>
        ))}
      </select>

      <button type="button" className="clear-filter" onClick={onClear}>
        Filterlarni tozalash
      </button>
    </aside>
  );
}

export default Filter;
