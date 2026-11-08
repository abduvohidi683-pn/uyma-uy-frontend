import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";

import { getProperties } from "../../services/property";
import { getCategories } from "../../services/category";
import Filter from "../../components/Filter";
import PageHeader from "../../components/PageHeader/PageHeader";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { PropertyGridSkeleton } from "../../components/Skeleton/Skeleton";
import { useI18n } from "../../i18n/I18nContext";

import type {
  Property,
  PropertyMeta,
  Category,
} from "../../types/property";

function Properties() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [meta, setMeta] = useState<PropertyMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const city = searchParams.get("city") || "";
  const category = searchParams.get("category") || "";
  const type = searchParams.get("type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const rooms = searchParams.get("rooms") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = Number(searchParams.get("page") || 1);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError(t("list.catFail"));
      }
    };

    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drawer ochiq paytda orqa sahifa aylanmasin; Esc bilan yopiladi
  useEffect(() => {
    if (!filtersOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [filtersOpen]);

  const priceError =
    minPrice && maxPrice && Number(minPrice) > Number(maxPrice)
      ? t("list.priceError")
      : "";

  useEffect(() => {
    if (priceError) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getProperties({
          page,
          limit: 12,
          city,
          category,
          type: type as "SALE" | "RENT" | "",
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          rooms: rooms ? Number(rooms) : undefined,
          sort: sort as "newest" | "price_asc" | "price_desc",
        });

        // Tez-tez filter o'zgarganda eski javob yangisini bosib ketmasligi uchun
        if (cancelled) return;
        setProperties(result.data);
        setMeta(result.meta);
      } catch {
        if (!cancelled) setError(t("list.loadFail"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProperties();

    return () => {
      cancelled = true;
    };
    // t: til almashganda qayta so'rov yuborilmasin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    city,
    category,
    type,
    minPrice,
    maxPrice,
    rooms,
    sort,
    priceError,
    reloadKey,
  ]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    if (key !== "page") {
      params.set("page", "1");
    }

    setSearchParams(params);
  };

  const activeFilters = [city, category, type, minPrice, maxPrice, rooms].filter(
    Boolean
  ).length;

  const filterProps = {
    values: { city, category, type, minPrice, maxPrice, rooms },
    categories,
    onChange: updateFilter,
    onClear: () => setSearchParams({}),
    priceError,
  };

  return (
    <main className="container-page py-12 pb-20">
      <PageHeader
        eyebrow={t("list.eyebrow")}
        title={t("list.title")}
        subtitle={t("list.subtitle")}
      />

      <div className="grid items-start gap-9 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Kompyuter: chap ustundagi filter */}
        <aside className="sticky top-24 hidden rounded-2xl border border-line bg-panel p-6 shadow-soft lg:block">
          <h2 className="mb-2 text-2xl">{t("list.filters")}</h2>
          <Filter {...filterProps} />
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[28px]">{t("list.all")}</h2>
              <p className="mt-1 text-sm text-muted">
                {t("list.found", { n: meta.total })}
              </p>
            </div>

            <div className="flex w-full items-center gap-2.5 sm:w-auto">
              <button
                type="button"
                className="btn btn-outline btn-sm lg:hidden"
                onClick={() => setFiltersOpen(true)}
                aria-haspopup="dialog"
              >
                <SlidersHorizontal size={15} />
                {t("list.filters")}
                {activeFilters > 0 ? ` (${activeFilters})` : ""}
              </button>

              <select
                className="input !min-h-11 !w-auto min-w-0 flex-1 !rounded-[var(--radius-pill)] !py-2.5 !text-sm sm:min-w-[210px] sm:flex-none"
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                aria-label={t("list.sort")}
              >
                <option value="newest">{t("list.sort.newest")}</option>
                <option value="price_asc">{t("list.sort.priceAsc")}</option>
                <option value="price_desc">{t("list.sort.priceDesc")}</option>
              </select>
            </div>
          </div>

          {priceError ? (
            <div className="empty-state">
              <h3 className="text-2xl">{t("list.priceError.title")}</h3>
              <p className="text-muted">{priceError}</p>
            </div>
          ) : loading ? (
            <PropertyGridSkeleton count={6} className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" />
          ) : error ? (
            <div className="empty-state">
              <h3 className="text-2xl">{t("common.errorTitle")}</h3>
              <p className="text-muted">{error}</p>
              <button
                className="btn btn-dark"
                onClick={() => setReloadKey((key) => key + 1)}
              >
                {t("common.retry")}
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <h3 className="text-2xl">{t("list.empty.title")}</h3>
              <p className="text-muted">{t("list.empty.text")}</p>
              <button className="btn btn-dark" onClick={() => setSearchParams({})}>
                {t("filter.clear")}
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

          {!loading && !error && !priceError && meta.totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-4 text-sm text-muted"
              aria-label={t("list.pages")}
            >
              <button
                className="btn btn-outline btn-sm"
                disabled={page <= 1}
                onClick={() => updateFilter("page", String(page - 1))}
              >
                <ChevronLeft size={16} />
                {t("common.prev")}
              </button>

              <span>
                {meta.page} / {meta.totalPages}
              </span>

              <button
                className="btn btn-outline btn-sm"
                disabled={page >= meta.totalPages}
                onClick={() => updateFilter("page", String(page + 1))}
              >
                {t("common.next")}
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </section>
      </div>

      {/* Mobil: pastdan chiqadigan filter drawer (URL query bilan sinxron) */}
      {filtersOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-end bg-scrim/50 backdrop-blur-sm lg:hidden"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("list.filters")}
            className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-panel p-5 pb-8 shadow-lift"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-2xl">{t("list.filters")}</h2>
              <button
                type="button"
                className="grid size-11 place-items-center rounded-lg border border-line"
                onClick={() => setFiltersOpen(false)}
                aria-label={t("common.close")}
              >
                <X size={18} />
              </button>
            </div>

            <Filter {...filterProps} />

            <button
              type="button"
              className="btn btn-dark mt-4 w-full"
              onClick={() => setFiltersOpen(false)}
            >
              {t("filter.show")}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default Properties;
