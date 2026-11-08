import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



import { getImageUrl } from "../../utils/format";
import "./MyInquiries.css";
import type { Inquiry } from "../../types/inquiry";
import { getMyInquiries } from "../../services/inquiry";

function MyInquiries() {
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
        setError("Murojaatlarni yuklashda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("uz-UZ");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price);
  };

  return (
    <main className="my-inquiries-page">
      <div className="inquiries-heading">
        <h1>Mening murojaatlarim</h1>
        <p>Uy egalariga yuborgan xabarlaringiz.</p>
      </div>

      {loading ? (
        <Loading text="Yuklanmoqda..." />
      ) : error ? (
        <p className="inquiries-message error">{error}</p>
      ) : inquiries.length === 0 ? (
        <div className="inquiries-empty">
          <h2>Hozircha murojaatlar yo‘q</h2>

          <p>Siz hali hech qanday uy egasiga xabar yubormagansiz.</p>

          <Link to="/properties">Uylarni ko‘rish</Link>
        </div>
      ) : (
        <div className="inquiries-list">
          {inquiries.map((item) => (
            <article className="inquiry-card" key={item.id}>
              <div className="inquiry-property">
                {item.property.images?.[0]?.url ? (
                  <img
                    src={getImageUrl(item.property.images[0].url)}
                    alt={item.property.title}
                  />
                ) : (
                  <div className="inquiry-no-image">
                    Rasm yo‘q
                  </div>
                )}

                <div>
                  <h2>{item.property.title}</h2>

                  <p>{item.property.city}</p>

                  <strong>
                    {formatPrice(item.property.price)}{" "}
                    {item.property.currency}
                  </strong>

                  <Link to={`/properties/${item.property.id}`}>
                    E'lonni ko‘rish
                  </Link>
                </div>
              </div>

              <div className="inquiry-message">
                <h3>Yuborgan xabaringiz</h3>

                <p>{item.message}</p>

                <span>Telefon: {item.phone}</span>

                <small>
                  Yuborilgan vaqt: {formatDate(item.createdAt)}
                </small>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyInquiries;