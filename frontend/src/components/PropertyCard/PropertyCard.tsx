import { Link } from "react-router-dom";
import { MapPin, BedDouble, Maximize } from "lucide-react";

import FavoriteButton from "../FavoriteButton/FavoriteButton";
import { getImageUrl } from "../../utils/format";
import "./PropertyCard.css";
import type { Property } from "../../types/property";

interface Props {
  property: Property;
  /** Sevimlilar sahifasida alohida "olib tashlash" tugmasi bor */
  hideFavorite?: boolean;
}

function PropertyCard({ property, hideFavorite }: Props) {
  const imageUrl = getImageUrl(property.images?.[0]?.url);

  const price = new Intl.NumberFormat("uz-UZ").format(property.price);

  return (
    <div className="property-card">
      <div className="property-image">
        {imageUrl ? (
          <img src={imageUrl} alt={property.title} />
        ) : (
          <div className="no-image">Rasm mavjud emas</div>
        )}

        <span className="property-type">
          {property.listingType === "SALE" ? "Sotiladi" : "Ijaraga"}
        </span>

        {!hideFavorite && property.status === "APPROVED" && (
          <FavoriteButton propertyId={property.id} />
        )}
      </div>

      <div className="property-content">
        <h3>{property.title}</h3>

        <p className="property-location">
          <MapPin size={16} />
          {property.city}, {property.address}
        </p>

        <div className="property-info">
          <span>
            <BedDouble size={16} /> {property.rooms} xona
          </span>

          <span>
            <Maximize size={16} /> {property.area} m²
          </span>
        </div>

        <div className="property-bottom">
          <strong>
            {price} {property.currency}
          </strong>

          <Link to={`/properties/${property.id}`}>
            Batafsil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;