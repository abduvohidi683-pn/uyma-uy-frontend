import PageHeader from "../../components/PageHeader/PageHeader";
import { RowsSkeleton } from "../../components/Skeleton/Skeleton";
import { Clock, MessageSquare, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useI18n } from "../../i18n/I18nContext";
import { getImageUrl } from "../../utils/format";
import type { Inquiry } from "../../types/inquiry";
import { getMyInquiries } from "../../services/inquiry";

function MyInquiries() {
  const { t, n, d } = useI18n();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyInquiries();

        setInquiries(data);
      } catch {
        setError(t("inq.loadFail"));
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date: string) => d(date, true);

  return (
    <div>
      <PageHeader
        eyebrow={t("inq.eyebrow")}
        title={t("inq.title")}
        subtitle={t("inq.subtitle")}
      />

      {loading ? (
        <RowsSkeleton count={3} />
      ) : error ? (
        <div className="empty-state">
          <h3 className="text-2xl">{t("common.loadFailed")}</h3>
          <p className="text-muted">{error}</p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="empty-state">
          <MessageSquare size={34} className="text-bronze-deep" />
          <h3 className="text-2xl">{t("inq.empty.title")}</h3>
          <p className="text-muted">{t("inq.empty.text")}</p>
          <Link to="/properties" className="btn btn-dark">
            {t("inq.empty.cta")}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-[18px]">
          {inquiries.map((item) => (
            <article
              className="card grid gap-[18px] p-5 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)] md:gap-7 md:p-[22px]"
              key={item.id}
            >
              <Link
                to={`/properties/${item.property.id}`}
                className="group flex min-w-0 items-center gap-4"
              >
                {item.property.images?.[0]?.url ? (
                  <img
                    src={getImageUrl(item.property.images[0].url)}
                    alt={item.property.title}
                    loading="lazy"
                    className="h-[92px] w-[112px] shrink-0 rounded-2xl bg-paper-2 object-contain"
                  />
                ) : (
                  <div className="grid h-[92px] w-[112px] shrink-0 place-items-center rounded-2xl bg-paper-2 text-xs text-muted">
                    {t("common.noImageShort")}
                  </div>
                )}

                <div className="min-w-0">
                  <h2 className="truncate text-xl transition group-hover:text-bronze-deep">
                    {item.property.title}
                  </h2>
                  <p className="mb-1.5 mt-1 text-sm text-muted">
                    {item.property.city}
                  </p>
                  <strong className="font-serif text-lg">
                    {n(item.property.price)}{" "}
                    {item.property.currency}
                  </strong>
                </div>
              </Link>

              <div className="border-t border-line pt-[18px] md:border-l md:border-t-0 md:pl-7 md:pt-0">
                <span className="mb-2 block text-xs font-medium tracking-normal text-muted">
                  {t("inq.message")}
                </span>
                <p className="whitespace-pre-line break-words">{item.message}</p>

                <div className="mt-3.5 flex flex-wrap gap-[18px] text-[13px] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={14} /> {item.phone}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} /> {formatDate(item.createdAt)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyInquiries;
