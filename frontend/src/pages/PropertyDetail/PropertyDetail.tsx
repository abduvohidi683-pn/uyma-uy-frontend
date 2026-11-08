import Loading from "../../components/Loading";
import StatusPage from "../../components/StatusPage/StatusPage";
import FieldError from "../../components/FieldError";
import { parseApiError } from "../../utils/apiErrors";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getPropertyById } from "../../services/property";
import type { PropertyDetail } from "../../services/property";


import "./PropertyDetail.css";
import { getImageUrl } from "../../utils/format";
import { createInquiry } from "../../services/inquiry";
import { useAuth } from "../../context/AuthContext";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";

function PropertyDetailPage() {
  const { id } = useParams();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [activeImage, setActiveImage] = useState(0);

  const [favoriteError, setFavoriteError] = useState("");

  const { user: currentUser } = useAuth();

  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const [sending, setSending] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState("");
  const [inquiryError, setInquiryError] = useState("");
  const [inquiryFieldErrors, setInquiryFieldErrors] = useState<
    Record<string, string>
  >({});


  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);

        if (!id) {
          setError("E'lon ID topilmadi.");
          return;
        }

        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;

        setNotFound(status === 404);
        setError(
          status === 404
            ? "E'lon topilmadi yoki hali tasdiqlanmagan."
            : "E'lonni yuklashda xatolik yuz berdi. Qayta urinib ko'ring."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);


  if (loading) {
    return <Loading text="Ma'lumotlar yuklanmoqda..." />;
  }

  if (notFound) {
    return (
      <StatusPage
        code="404"
        title="E'lon topilmadi"
        text={error}
        linkTo="/properties"
        linkLabel="E'lonlarga qaytish"
      />
    );
  }

  if (error || !property) {
    return (
      <div className="detail-message">
        <p>{error || "E'lon topilmadi."}</p>
        <Link to="/properties">E'lonlarga qaytish</Link>
      </div>
    );
  }

  const formatPrice = new Intl.NumberFormat("uz-UZ").format(
    property.price
  );


  const handleInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInquiryError("");
    setInquirySuccess("");
    setInquiryFieldErrors({});

    const clientErrors: Record<string, string> = {};

    if (message.trim().length < 10 || message.trim().length > 1000) {
      clientErrors.message = "Xabar 10–1000 ta belgidan iborat bo‘lishi kerak.";
    }

    if (!/^(?:\+998\d{9}|\d{9})$/.test(phone.replace(/[\s-]/g, ""))) {
      clientErrors.phone = "Telefon raqamini to‘g‘ri kiriting (+998901234567).";
    }

    if (Object.keys(clientErrors).length > 0) {
      setInquiryFieldErrors(clientErrors);
      return;
    }

    try {
      setSending(true);

      await createInquiry(property.id, {
        message: message.trim(),
        phone: phone.replace(/[\s-]/g, ""),
      });

      setInquirySuccess("Murojaatingiz muvaffaqiyatli yuborildi!");
      setMessage("");
      setPhone("");
    } catch (err) {
      const parsed = parseApiError(
        err,
        "Murojaat yuborilmadi. Qayta urinib ko‘ring."
      );
      setInquiryFieldErrors(parsed.fields);
      setInquiryError(parsed.general);
    } finally {
      setSending(false);
    }
  };


  return (
    <main className="detail-page">
      <Link to="/properties" className="back-link">
        ← Barcha e'lonlar
      </Link>

      <div className="detail-container">
        <div className="detail-gallery">
          {property.images.length > 0 ? (
            <>
              <img
                className="main-image"
                src={getImageUrl(property.images[activeImage].url)}
                alt={property.title}
              />

              <div className="thumbnail-list">
                {property.images.map((image, index) => (
                  <img
                    key={image.id}
                    src={getImageUrl(image.url)}
                    alt={`${property.title} ${index + 1}`}
                    className={activeImage === index ? "active" : ""}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-image">
              Rasm mavjud emas
            </div>
          )}
        </div>

        <section className="detail-info">
          <span className="property-type">
            {property.listingType === "SALE" ? "Sotuv" : "Ijara"}
          </span>

          <h1>{property.title}</h1>

          <h2 className="detail-price">
            {formatPrice} {property.currency}
          </h2>

          <FavoriteButton
            propertyId={property.id}
            variant="text"
            onError={setFavoriteError}
          />

          {favoriteError && (
            <p className="favorite-error">{favoriteError}</p>
          )}

          <p className="detail-address">
            <strong>Manzil:</strong> {property.city}, {property.address}
          </p>

          <div className="detail-features">
            <div>
              <strong>{property.rooms}</strong>
              <span>Xona</span>
            </div>

            <div>
              <strong>{property.area} m²</strong>
              <span>Maydon</span>
            </div>

            <div>
              <strong>{property.bathrooms}</strong>
              <span>Hammom</span>
            </div>
          </div>

          <div className="detail-description">
            <h2>Uy haqida</h2>
            <p>{property.description}</p>
          </div>

          <div className="seller-card">
            <h2>E'lon egasi</h2>

            <h3>{property.owner.fullName}</h3>

            <p>Email: {property.owner.email}</p>

            {property.owner.phone && (
              <p>Telefon: {property.owner.phone}</p>
            )}

            {property.owner.phone && (
              <a
                href={`tel:${property.owner.phone}`}
                className="contact-button"
              >
                Qo'ng'iroq qilish
              </a>
            )}
          </div>
        </section>

        <div className="inquiry-card">
          <h2>Uy egasiga murojaat</h2>

          {!currentUser ? (
            <p>
              Murojaat yuborish uchun{" "}
              <Link to="/login">tizimga kiring</Link>.
            </p>
          ) : Number(currentUser.id) === property.owner.id ? (
            <p>Bu sizning e'loningiz. O‘z e'loningizga murojaat yubora olmaysiz.</p>
          ) : (
            <form onSubmit={handleInquiry}>
              <label htmlFor="inquiry-phone">Telefon raqamingiz</label>

              <input
                id="inquiry-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998901234567"
                required
              />
              <FieldError message={inquiryFieldErrors.phone} />

              <label htmlFor="inquiry-message">Xabaringiz</label>

              <textarea
                id="inquiry-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Assalomu alaykum, uy haqida ma'lumot bersangiz..."
                minLength={10}
                maxLength={1000}
                rows={5}
                required
              />
              <FieldError message={inquiryFieldErrors.message} />

              <button type="submit" disabled={sending}>
                {sending ? "Yuborilmoqda..." : "Murojaat yuborish"}
              </button>
            </form>
          )}

          {inquirySuccess && (
            <p className="inquiry-success">{inquirySuccess}</p>
          )}

          {inquiryError && (
            <p className="inquiry-error">{inquiryError}</p>
          )}
        </div>

      </div>
    </main>
  );
}

export default PropertyDetailPage;
