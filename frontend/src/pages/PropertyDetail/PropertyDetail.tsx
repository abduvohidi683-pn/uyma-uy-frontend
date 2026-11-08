import StatusPage from "../../components/StatusPage/StatusPage";
import StatusBadge from "../../components/StatusBadge/StatusBadge";
import FieldError from "../../components/FieldError";
import { parseApiError } from "../../utils/apiErrors";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Expand,
  Bath,
  Check,
  Maximize,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Tag,
  X,
} from "lucide-react";

import { getPropertyById } from "../../services/property";
import type { PropertyDetail } from "../../services/property";
import { updatePropertyStatus } from "../../services/admin";
import { getImageUrl } from "../../utils/format";
import { createInquiry } from "../../services/inquiry";
import { useAuth } from "../../context/AuthContext";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";
import FitImage from "../../components/FitImage";
import Lightbox from "../../components/Lightbox";
import { useI18n } from "../../i18n/I18nContext";

function PropertyDetailPage() {
  const { id } = useParams();

  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [activeImage, setActiveImage] = useState(0);

  const [favoriteError, setFavoriteError] = useState("");

  const { user: currentUser, isAdmin } = useAuth();
  const { t, n, catName } = useI18n();
  const [lightbox, setLightbox] = useState(false);

  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");

  const [sending, setSending] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState("");
  const [inquiryError, setInquiryError] = useState("");
  const [inquiryFieldErrors, setInquiryFieldErrors] = useState<
    Record<string, string>
  >({});

  // Admin uchun qo'shimcha amal: moderatsiya
  const [moderating, setModerating] = useState(false);
  const [moderationError, setModerationError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError("");
        setNotFound(false);
        setActiveImage(0);

        if (!id) {
          setError(t("detail.notFound.text"));
          return;
        }

        const data = await getPropertyById(id);
        if (!cancelled) setProperty(data);
      } catch (err) {
        if (cancelled) return;
        const status = (err as { response?: { status?: number } })?.response
          ?.status;

        setNotFound(status === 404);
        setError(
          status === 404
            ? t("detail.notFound.text")
            : t("detail.loadFail")
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProperty();

    return () => {
      cancelled = true;
    };
    // t: til almashganda qayta so'rov yuborilmasin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <main className="container-page py-12 pb-20" aria-busy="true">
        <div className="skeleton mb-7 h-[22px] w-40" />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="skeleton h-[460px] rounded-3xl" />
            <div className="skeleton mt-7 h-6 w-3/5" />
            <div className="skeleton mt-4 h-[120px]" />
          </div>
          <div className="skeleton h-[360px] rounded-3xl" />
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <StatusPage
        code="404"
        title={t("detail.notFound.title")}
        text={error}
        linkTo="/properties"
        linkLabel={t("detail.backToList")}
      />
    );
  }

  if (error || !property) {
    return (
      <StatusPage
        code="!"
        title={t("common.errorTitle")}
        text={error || t("detail.notFound.text")}
        linkTo="/properties"
        linkLabel={t("detail.backToList")}
      />
    );
  }

  const isOwner = Number(currentUser?.id) === property.owner.id;

  const handleModerate = async (status: "APPROVED" | "REJECTED") => {
    try {
      setModerating(true);
      setModerationError("");
      await updatePropertyStatus(property.id, status);
      setProperty({ ...property, status });
    } catch (err) {
      setModerationError(
        parseApiError(err, t("detail.admin.fail")).general
      );
    } finally {
      setModerating(false);
    }
  };

  const handleInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setInquiryError("");
    setInquirySuccess("");
    setInquiryFieldErrors({});

    const clientErrors: Record<string, string> = {};

    if (message.trim().length < 10 || message.trim().length > 1000) {
      clientErrors.message = t("detail.inquiry.errMessage");
    }

    if (!/^(?:\+998\d{9}|\d{9})$/.test(phone.replace(/[\s-]/g, ""))) {
      clientErrors.phone = t("detail.inquiry.errPhone");
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

      setInquirySuccess(t("detail.inquiry.success"));
      setMessage("");
      setPhone("");
    } catch (err) {
      const parsed = parseApiError(err, t("detail.inquiry.fail"));
      setInquiryFieldErrors(parsed.fields);
      setInquiryError(parsed.general);
    } finally {
      setSending(false);
    }
  };

  const sideCard = "rounded-3xl border border-line bg-panel p-6 sm:p-[26px]";
  const sideLabel =
    "mb-2.5 block text-xs font-medium tracking-normal text-muted";

  return (
    <main className="container-page py-12 pb-20">
      <Link
        to="/properties"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-bronze-deep"
      >
        <ArrowLeft size={16} />
        {t("detail.back")}
      </Link>

      <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        {/* ===== Chap ustun: galereya va tavsif ===== */}
        <div className="min-w-0">
          {property.images.length > 0 ? (
            <>
              <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl bg-paper-2">
                <button
                  type="button"
                  className="size-full cursor-zoom-in"
                  onClick={() => setLightbox(true)}
                  aria-label={t("gallery.open")}
                >
                  <FitImage
                    src={getImageUrl(property.images[activeImage].url)}
                    alt={property.title}
                    eager
                  />
                </button>

                <span className="pointer-events-none absolute right-3.5 top-3.5 grid size-10 place-items-center rounded-lg bg-canvas/95 text-charcoal">
                  <Expand size={16} />
                </span>

                {property.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg bg-canvas/95 text-charcoal shadow-sm transition hover:bg-card"
                      onClick={() =>
                        setActiveImage(
                          (activeImage - 1 + property.images.length) %
                            property.images.length
                        )
                      }
                      aria-label={t("gallery.prev")}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-lg bg-canvas/95 text-charcoal shadow-sm transition hover:bg-card"
                      onClick={() =>
                        setActiveImage((activeImage + 1) % property.images.length)
                      }
                      aria-label={t("gallery.next")}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {property.images.length > 1 && (
                <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                  {property.images.map((image, index) => (
                    <button
                      type="button"
                      key={image.id}
                      className={`h-20 w-[110px] shrink-0 overflow-hidden rounded-2xl border-2 p-0 transition ${
                        activeImage === index
                          ? "border-bronze opacity-100"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      onClick={() => setActiveImage(index)}
                      aria-label={t("gallery.imageN", { n: index + 1 })}
                    >
                      <img
                        src={getImageUrl(image.url)}
                        alt={`${property.title} ${index + 1}`}
                        loading="lazy"
                        className="size-full object-contain bg-paper-2"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="grid aspect-[16/10] place-items-center rounded-3xl bg-gradient-to-br from-paper-2 to-paper-3 text-muted">
              {t("common.noImage")}
            </div>
          )}

          <div className="mt-8">
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <span className="rounded-md bg-charcoal px-3 py-1.5 text-[13px] font-medium tracking-normal text-bronze-light">
                {property.listingType === "SALE" ? t("type.sale") : t("type.rent")}
              </span>
              {property.category && (
                <span className="inline-flex items-center gap-1.5 rounded-md border border-line bg-card px-3 py-1.5 text-[13px] font-medium">
                  <Tag size={13} />
                  {catName(property.category)}
                </span>
              )}
              {property.status !== "APPROVED" && (
                <StatusBadge status={property.status} />
              )}
            </div>

            <h1 className="display">{property.title}</h1>

            <p className="mt-3.5 flex items-center gap-2 text-muted">
              <MapPin size={17} className="text-bronze-deep" />
              {property.city}, {property.address}
            </p>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {[
              { icon: BedDouble, value: property.rooms, label: t("unit.room") },
              { icon: Maximize, value: `${property.area} m²`, label: t("unit.area") },
              { icon: Bath, value: property.bathrooms, label: t("unit.bath") },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex items-center gap-3.5 rounded-3xl border border-line bg-panel p-5 sm:flex-col sm:items-start sm:gap-1"
              >
                <Icon size={22} className="text-bronze-deep sm:mb-2" />
                <strong className="font-serif text-2xl font-medium">{value}</strong>
                <span className="text-[13px] text-muted">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <h2 className="mb-3.5 text-[28px]">{t("detail.about")}</h2>
            <p className="whitespace-pre-line text-muted">
              {property.description}
            </p>
          </div>
        </div>

        {/* ===== O'ng ustun: narx, sotuvchi, murojaat ===== */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
          {/* Admin uchun qo'shimcha tugmalar */}
          {isAdmin && (
            <div className="rounded-3xl border border-charcoal bg-charcoal p-6 text-paper">
              <span className="mb-2.5 flex items-center gap-2 text-xs font-medium tracking-normal text-bronze-light">
                <ShieldCheck size={15} />
                {t("detail.admin.title")}
              </span>
              <p className="mb-4 text-sm text-paper/70">
                {t("detail.admin.current")} <StatusBadge status={property.status} />
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  className="btn btn-sm bg-ok text-paper hover:bg-ok"
                  onClick={() => handleModerate("APPROVED")}
                  disabled={moderating || property.status === "APPROVED"}
                >
                  <Check size={15} />
                  {t("detail.admin.approve")}
                </button>
                <button
                  className="btn btn-sm border-paper/25 text-paper hover:bg-card/10"
                  onClick={() => handleModerate("REJECTED")}
                  disabled={moderating || property.status === "REJECTED"}
                >
                  <X size={15} />
                  {t("detail.admin.reject")}
                </button>
              </div>
              {moderationError && (
                <p className="alert alert-error mt-3">{moderationError}</p>
              )}
            </div>
          )}

          <div className={sideCard}>
            <span className={sideLabel}>{t("detail.price")}</span>
            <h2 className="mb-4 text-[44px]">
              {n(property.price)}{" "}
              <small className="font-sans text-base font-medium text-muted">
                {property.currency}
              </small>
            </h2>

            <FavoriteButton
              propertyId={property.id}
              variant="text"
              onError={setFavoriteError}
            />

            {favoriteError && (
              <p className="mt-2 text-[13px] text-bad">{favoriteError}</p>
            )}
          </div>

          <div className={sideCard}>
            <span className={sideLabel}>{t("detail.owner")}</span>

            <div className="mb-3.5 flex items-center gap-3.5">
              <span className="grid size-[46px] shrink-0 place-items-center rounded-full bg-charcoal font-serif text-xl font-medium text-bronze-light">
                {property.owner.fullName.charAt(0).toUpperCase()}
              </span>
              <h3 className="text-xl">{property.owner.fullName}</h3>
            </div>

            <p className="mt-2 flex items-center gap-2.5 break-all text-sm text-muted">
              <Mail size={15} className="shrink-0 text-bronze-deep" />
              {property.owner.email}
            </p>

            {property.owner.phone && (
              <>
                <p className="mt-2 flex items-center gap-2.5 text-sm text-muted">
                  <Phone size={15} className="shrink-0 text-bronze-deep" />
                  {property.owner.phone}
                </p>

                <a
                  href={`tel:${property.owner.phone}`}
                  className="btn btn-outline btn-sm mt-4 w-full"
                >
                  {t("detail.call")}
                </a>
              </>
            )}
          </div>

          <div className={sideCard}>
            <h2 className="mb-4 text-2xl">{t("detail.inquiry.title")}</h2>

            {!currentUser ? (
              <p className="text-sm text-muted">
                {t("detail.inquiry.loginPre")}{" "}
                <Link
                  to="/login"
                  state={{ from: `/properties/${property.id}` }}
                  className="font-medium text-bronze-deep underline"
                >
                  {t("detail.inquiry.loginLink")}
                </Link>
                .
              </p>
            ) : isOwner ? (
              <p className="text-sm text-muted">
                {t("detail.inquiry.own")}
              </p>
            ) : (
              <form onSubmit={handleInquiry} noValidate>
                <label className="field-label !mt-0" htmlFor="inquiry-phone">
                  {t("detail.inquiry.phone")}
                </label>
                <input
                  id="inquiry-phone"
                  className="input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998901234567"
                  required
                />
                <FieldError message={inquiryFieldErrors.phone} />

                <label className="field-label" htmlFor="inquiry-message">
                  {t("detail.inquiry.message")}
                </label>
                <textarea
                  id="inquiry-message"
                  className="input resize-y"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t("detail.inquiry.messagePh")}
                  maxLength={1000}
                  rows={5}
                  required
                />
                <FieldError message={inquiryFieldErrors.message} />

                <button
                  type="submit"
                  className="btn btn-dark mt-4 w-full"
                  disabled={sending}
                >
                  {sending ? t("detail.inquiry.sending") : t("detail.inquiry.send")}
                </button>
              </form>
            )}

            {inquirySuccess && (
              <p className="alert alert-success mt-3.5">{inquirySuccess}</p>
            )}

            {inquiryError && (
              <p className="alert alert-error mt-3.5">{inquiryError}</p>
            )}
          </div>
        </aside>
      </div>

      {lightbox && property.images.length > 0 && (
        <Lightbox
          images={property.images.map((image) => ({
            id: image.id,
            url: getImageUrl(image.url),
          }))}
          index={activeImage}
          alt={property.title}
          onChange={setActiveImage}
          onClose={() => setLightbox(false)}
        />
      )}
    </main>
  );
}

export default PropertyDetailPage;
