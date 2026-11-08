import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { PropertyGridSkeleton } from "../../components/Skeleton/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import { getCategories } from "../../services/category";
import { getProperties } from "../../services/property";
import type { Category, Property } from "../../types/property";
import { parseApiError } from "../../utils/apiErrors";
import { getImageUrl } from "../../utils/format";

const FEATURES = ["1", "2", "3", "4"] as const;

function Home() {
  const { isLoggedIn } = useAuth();
  const { t, n, catName } = useI18n();

  // Real API ma'lumotlari
  const [categories, setCategories] = useState<Category[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getProperties({ page: 1, limit: 12, sort: "newest" }),
      getCategories(),
    ])
      .then(([result, categoryData]) => {
        if (cancelled) return;
        setProperties(result.data);
        setCategories(categoryData);
        setError("");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(parseApiError(err, t("home.featured.loadFail")).general);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // t: til almashganda qayta so'rov yuborilmasin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  // Ommabop shaharlar: faqat backenddan kelgan e'lonlardagi shaharlar
  const cities = useMemo(
    () => Array.from(new Set(properties.map((p) => p.city.trim()))).slice(0, 8),
    [properties]
  );

  const retry = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const postLink = isLoggedIn ? "/create-property" : "/register";

  // Imzo: eng yangi e'lon — paspartuga solingan surat va uning yorlig'i
  const lead = properties.find((p) => p.images?.[0]?.url);
  const leadImage = lead ? getImageUrl(lead.images[0].url) : "/hero.jpg";

  return (
    <main>
      {/* ===== HERO: matn chapda, o'ngda eng yangi e'lon surati ===== */}
      <section className="container-page grid items-center gap-x-[var(--gap-columns)] gap-y-10 pb-[var(--section-gap-s)] pt-10 md:pt-14 lg:min-h-[calc(100svh-88px)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:pb-16">
        <div className="reveal flex min-w-0 flex-col gap-7">
          <h1 className="max-w-[13ch] text-[length:var(--text-hero)] leading-[1.0] tracking-[var(--tracking-statement)]">
            {t("home.hero.title1")} {t("home.hero.title2")}
          </h1>

          <p className="max-w-[46ch] text-[length:var(--text-lg)] leading-[1.5] text-ink-2">
            {t("home.hero.text")}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/properties" className="btn btn-dark">
              {t("home.hero.browse")}
            </Link>
            <Link to={postLink} className="btn">
              {t("home.hero.post")}
            </Link>
          </div>
        </div>

        <figure className="m-0 min-w-0 lg:w-full lg:max-w-[500px] lg:justify-self-end">
          <Link
            to={lead ? `/properties/${lead.id}` : "/properties"}
            className="print block"
            aria-label={lead ? lead.title : t("home.hero.browse")}
          >
            <span
              className="print-window block aspect-[4/5] max-h-[min(60svh,580px)] w-full bg-paper-2"
              data-slot="hero"
            >
              <img src={leadImage} alt="" fetchPriority="high" />
            </span>
          </Link>
          <figcaption className="mt-4 flex items-baseline justify-between gap-4 text-sm">
            {lead ? (
              <>
                <span className="min-w-0">
                  <span className="block truncate text-ink">{lead.title}</span>
                  <span className="block truncate text-muted">{lead.city}</span>
                </span>
                <span className="shrink-0 font-serif text-[length:var(--text-lg)] text-ink">
                  {n(lead.price)} <span className="text-sm text-muted">{lead.currency}</span>
                </span>
              </>
            ) : (
              <span className="text-muted">
                {t("brand.name")}, {t("brand.tagline")}
              </span>
            )}
          </figcaption>
        </figure>
      </section>

      {/* ===== YANGI E'LONLAR ===== */}
      <section className="container-page pb-[var(--section-gap-s)]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-t border-ink pt-6">
          <h2 className="display">{t("home.featured.title")}</h2>
          <Link to="/properties" className="link-arrow">
            {t("common.viewAll")}
          </Link>
        </div>

        {loading ? (
          <PropertyGridSkeleton count={6} />
        ) : error ? (
          <div className="empty-state">
            <h3 className="text-2xl">{t("common.loadFailed")}</h3>
            <p className="text-muted">{error}</p>
            <button className="btn btn-dark" onClick={retry}>
              {t("common.retry")}
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <h3 className="text-2xl">{t("home.featured.emptyTitle")}</h3>
            <p className="text-muted">{t("home.featured.emptyText")}</p>
            <Link to={postLink} className="btn btn-dark">
              {t("home.hero.post")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-[var(--gap-columns)] gap-y-14 sm:grid-cols-[repeat(2,minmax(0,1fr))] lg:grid-cols-[repeat(3,minmax(0,1fr))]">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* ===== KATEGORIYALAR: chizilgan ro'yxat ===== */}
      {categories.length > 0 && (
        <section className="container-page grid gap-10 pb-[var(--section-gap-s)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <h2 className="display">{t("home.cat.title")}</h2>

          <ul className="ruled m-0 list-none p-0">
            {categories.map((item, index) => (
              <li key={item.id}>
                <Link
                  to={`/properties?category=${encodeURIComponent(item.slug)}`}
                  className="group grid min-h-[88px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-4 py-4 md:grid-cols-[64px_minmax(0,1fr)_auto]"
                >
                  <span className="index-num">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="text-[length:var(--text-sub)] font-light transition-colors duration-200 group-hover:text-accent">
                    {catName(item)}
                  </h3>
                  <span className="text-sm text-muted underline decoration-transparent underline-offset-4 transition-colors duration-200 group-hover:text-ink group-hover:decoration-accent">
                    {t("home.cat.view")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ===== OMMABOP JOYLAR ===== */}
      {cities.length > 0 && (
        <section className="container-page grid gap-8 pb-[var(--section-gap-s)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
          <h2 className="display">{t("home.cities.title")}</h2>
          <div className="flex flex-wrap content-start gap-3">
            {cities.map((name) => (
              <Link
                key={name}
                to={`/properties?city=${encodeURIComponent(name)}`}
                className="chip"
              >
                {name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== NEGA UY-BOZOR: to'rt qator, jadval kabi ===== */}
      <section className="container-page grid gap-10 pb-[var(--section-gap-s)] lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <h2 className="display max-w-[14ch]">{t("home.why.title")}</h2>

        <ol className="ruled m-0 list-none p-0">
          {FEATURES.map((key) => (
            <li
              key={key}
              className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 gap-y-2 py-6 md:grid-cols-[64px_minmax(0,5fr)_minmax(0,7fr)]"
            >
              <span className="index-num">0{key}</span>
              <h3 className="text-[length:var(--text-xl)]">
                {t(`home.why.${key}.title` as "home.why.1.title")}
              </h3>
              <p className="col-start-2 text-muted md:col-start-3">
                {t(`home.why.${key}.text` as "home.why.1.text")}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== CTA: bayonot va surat ===== */}
      <section className="container-page">
        <div className="grid items-center gap-[var(--gap-columns)] border-t border-ink pt-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="print order-2 lg:order-1">
            <div className="print-window aspect-[4/3] bg-paper-2" data-slot="cta">
              <img src="/cta.jpg" alt="" loading="lazy" />
            </div>
          </div>

          <div className="order-1 flex flex-col items-start gap-6 lg:order-2 lg:pl-8">
            <h2 className="display max-w-[16ch]">{t("home.cta.title")}</h2>
            <p className="dropcap max-w-[52ch] text-ink-2">{t("home.cta.text")}</p>
            <Link to={postLink} className="btn btn-dark">
              {isLoggedIn ? t("home.cta.add") : t("home.cta.start")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
