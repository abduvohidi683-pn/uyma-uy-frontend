import { memo } from "react";
import { Link } from "react-router-dom";

import FitImage from "../FitImage";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { useI18n } from "../../i18n/I18nContext";
import { getImageUrl } from "../../utils/format";
import type { Property } from "../../types/property";

interface Props {
  property: Property;
  /** Sevimlilar sahifasida alohida "olib tashlash" tugmasi bor */
  hideFavorite?: boolean;
}

/** E'lon: devorga osilgan surat va uning ostidagi yorliq. */
function PropertyCard({ property, hideFavorite }: Props) {
  const { t, n } = useI18n();
  const imageUrl = getImageUrl(property.images?.[0]?.url);

  return (
    <article className="group flex min-w-0 flex-col">
      <div className="relative">
        <Link
          to={`/properties/${property.id}`}
          className="block aspect-[4/3] overflow-hidden bg-paper-2 shadow-[inset_0_0_0_1px_var(--color-card-edge)]"
          aria-label={property.title}
        >
          <span className="block size-full transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.02]">
            <FitImage src={imageUrl} alt={property.title} />
          </span>
        </Link>

        <span className="absolute left-3 top-3 z-[2] rounded-[var(--radius-pill)] bg-paper px-2.5 py-1 text-xs text-ink">
          {property.listingType === "SALE" ? t("type.sale") : t("type.rent")}
        </span>

        {!hideFavorite && property.status === "APPROVED" && (
          <FavoriteButton propertyId={property.id} />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 border-b border-line pb-4 pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="min-w-0 truncate text-[length:var(--text-lg)]">
            <Link
              to={`/properties/${property.id}`}
              className="underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-accent"
            >
              {property.title}
            </Link>
          </h3>
          <span className="shrink-0 font-serif text-[length:var(--text-lg)] text-ink">
            {n(property.price)} <span className="text-sm text-muted">{property.currency}</span>
          </span>
        </div>

        <p className="truncate text-sm text-muted">
          {property.city}, {property.address}
        </p>

        <p className="mt-2 flex flex-wrap gap-x-5 text-sm text-ink-2">
          <span>{t("unit.rooms", { n: property.rooms })}</span>
          <span>{t("unit.baths", { n: property.bathrooms })}</span>
          <span>{property.area} m²</span>
        </p>
      </div>
    </article>
  );
}

export default memo(PropertyCard);
