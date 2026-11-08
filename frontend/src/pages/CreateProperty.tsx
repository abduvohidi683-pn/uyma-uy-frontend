import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty, type CreatePropertyData } from "../services/property";
import { uploadPropertyImage } from "../services/image";
import ImagePicker from "../components/ImagePicker/ImagePicker";
import PropertyForm from "../components/PropertyForm/PropertyForm";
import { parseApiError } from "../utils/apiErrors";

function CreateProperty() {
  const navigate = useNavigate();

  const [images, setImages] = useState<File[]>([]);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: CreatePropertyData) => {
    setError("");
    setFieldErrors({});

    if (images.length === 0) {
      setError("Kamida 1 ta rasm yuklang.");
      return;
    }

    try {
      setLoading(true);

      // E'lon allaqachon yaratilgan bo'lsa (rasm xatosidan keyin qayta urinish),
      // dublikat yaratmaymiz — faqat qolgan rasmlarni yuklaymiz.
      let propertyId = createdId;

      if (propertyId === null) {
        const created = await createProperty(data);
        propertyId = created.id as number;
        setCreatedId(propertyId);
      }

      let remaining = [...images];

      while (remaining.length > 0) {
        try {
          await uploadPropertyImage(propertyId, remaining[0]);
        } catch (uploadErr) {
          setImages(remaining);
          setError(
            `E'lon yaratildi, lekin rasm yuklanmadi: ${
              parseApiError(uploadErr, "noma'lum xato").general
            }. Rasmlarni tekshirib qayta yuboring yoki "Mening e'lonlarim"dan tahrirlang.`
          );
          return;
        }

        remaining = remaining.slice(1);
      }

      navigate("/my-properties");
    } catch (err) {
      const parsed = parseApiError(err, "E'lon yaratishda xatolik yuz berdi.");
      setFieldErrors(parsed.fields);
      setError(parsed.general);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Yangi uy e'loni</h1>

      <PropertyForm
        submitLabel="E'lonni joylashtirish"
        submittingLabel="Yuborilmoqda..."
        submitting={loading}
        error={error}
        serverFieldErrors={fieldErrors}
        onSubmit={handleSubmit}
      >
        <label>Uy rasmlari (kamida 1 ta, jpg/png/webp, 5 MB gacha)</label>

        <ImagePicker files={images} onChange={setImages} disabled={loading} />
      </PropertyForm>
    </div>
  );
}

export default CreateProperty;
