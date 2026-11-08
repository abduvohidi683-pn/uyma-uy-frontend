import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty, type CreatePropertyData } from "../services/property";
import { uploadPropertyImage } from "../services/image";
import ImagePicker from "../components/ImagePicker/ImagePicker";
import PropertyForm from "../components/PropertyForm/PropertyForm";
import PageHeader from "../components/PageHeader/PageHeader";
import { useI18n } from "../i18n/I18nContext";
import { parseApiError } from "../utils/apiErrors";

function CreateProperty() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [images, setImages] = useState<File[]>([]);
  const [createdId, setCreatedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: CreatePropertyData) => {
    setError("");
    setFieldErrors({});

    if (images.length === 0) {
      setError(t("create.needImage"));
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
            t("create.imgFail", {
              reason: parseApiError(uploadErr, t("create.unknown")).general,
            })
          );
          return;
        }

        remaining = remaining.slice(1);
      }

      navigate("/my-properties");
    } catch (err) {
      const parsed = parseApiError(err, t("create.fail"));
      setFieldErrors(parsed.fields);
      setError(parsed.general);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[860px]">
      <PageHeader
        eyebrow={t("create.eyebrow")}
        title={t("create.title")}
        subtitle={t("create.subtitle")}
      />

      <PropertyForm
        submitLabel={t("create.submit")}
        submittingLabel={t("create.submitting")}
        submitting={loading}
        error={error}
        serverFieldErrors={fieldErrors}
        onSubmit={handleSubmit}
      >
        <span className="field-label">{t("img.label")}</span>

        <ImagePicker files={images} onChange={setImages} disabled={loading} />
      </PropertyForm>
    </div>
  );
}

export default CreateProperty;
