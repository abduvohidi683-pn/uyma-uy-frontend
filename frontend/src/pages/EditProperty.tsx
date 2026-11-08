import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPropertyById,
  updateProperty,
  type CreatePropertyData,
} from "../services/property";
import type { PropertyImage } from "../types/property";
import { uploadPropertyImage, deletePropertyImage } from "../services/image";
import ImagePicker from "../components/ImagePicker/ImagePicker";
import PropertyForm from "../components/PropertyForm/PropertyForm";
import StatusPage from "../components/StatusPage/StatusPage";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/format";
import { parseApiError } from "../utils/apiErrors";
import "./EditProperty.css";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [initialValues, setInitialValues] = useState<CreatePropertyData | null>(
    null
  );
  const [loadStatus, setLoadStatus] = useState<
    "loading" | "ready" | "notFound" | "forbidden" | "error"
  >("loading");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [existingImages, setExistingImages] = useState<PropertyImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imageBusy, setImageBusy] = useState(false);
  const [imageMessage, setImageMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const property = await getPropertyById(id!);

        // Egasi emasligini oldindan aniqlaymiz (server baribir 403 beradi)
        if (user && Number(user.id) !== property.owner.id) {
          setLoadStatus("forbidden");
          return;
        }

        setExistingImages(property.images ?? []);
        setInitialValues({
          title: property.title,
          description: property.description,
          price: property.price,
          currency: property.currency,
          listingType: property.listingType,
          categoryId: property.categoryId,
          address: property.address,
          city: property.city,
          area: property.area,
          rooms: property.rooms,
          bathrooms: property.bathrooms,
        });
        setLoadStatus("ready");
      } catch (err) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;
        setLoadStatus(status === 404 ? "notFound" : "error");
      }
    };

    if (id) loadData();
  }, [id, user]);

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm("Bu rasmni o'chirmoqchimisiz?")) return;

    try {
      setImageBusy(true);
      setImageMessage("");
      await deletePropertyImage(Number(id), imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setImageMessage(
        parseApiError(err, "Rasmni o'chirib bo'lmadi.").general ||
          "Rasmni o'chirib bo'lmadi."
      );
    } finally {
      setImageBusy(false);
    }
  };

  const handleUploadImages = async () => {
    setImageBusy(true);
    setImageMessage("");

    let remaining = [...newImages];
    const uploaded: PropertyImage[] = [];

    try {
      while (remaining.length > 0) {
        const created = await uploadPropertyImage(Number(id), remaining[0]);
        uploaded.push(created as PropertyImage);
        remaining = remaining.slice(1);
      }
      setImageMessage("Rasmlar yuklandi.");
    } catch (err) {
      setImageMessage(
        `Yuklanmadi: ${parseApiError(err, "noma'lum xato").general}. Qolgan rasmlarni qayta yuboring.`
      );
    } finally {
      setExistingImages((prev) => [...prev, ...uploaded]);
      setNewImages(remaining);
      setImageBusy(false);
    }
  };

  const handleSubmit = async (data: CreatePropertyData) => {
    setError("");
    setFieldErrors({});

    try {
      setSaving(true);
      await updateProperty(Number(id), data);
      navigate("/my-properties");
    } catch (err) {
      const parsed = parseApiError(err, "Yangilashda xatolik yuz berdi.");
      setFieldErrors(parsed.fields);
      setError(parsed.general);
    } finally {
      setSaving(false);
    }
  };

  if (loadStatus === "loading") return <Loading text="Yuklanmoqda..." />;

  if (loadStatus === "notFound") {
    return (
      <StatusPage
        code="404"
        title="E'lon topilmadi"
        text="Bunday e'lon mavjud emas."
        linkTo="/my-properties"
        linkLabel="Mening e'lonlarim"
      />
    );
  }

  if (loadStatus === "forbidden") {
    return (
      <StatusPage
        code="403"
        title="Ruxsat yo'q"
        text="Bu e'lon sizga tegishli emas, uni tahrirlay olmaysiz."
        linkTo="/my-properties"
        linkLabel="Mening e'lonlarim"
      />
    );
  }

  if (loadStatus === "error" || !initialValues) {
    return (
      <StatusPage
        code="!"
        title="Xatolik"
        text="E'lon ma'lumotlarini yuklab bo'lmadi. Keyinroq qayta urinib ko'ring."
        linkTo="/my-properties"
        linkLabel="Mening e'lonlarim"
      />
    );
  }

  return (
    <div className="container">
      <h1>E'lonni tahrirlash</h1>

      <PropertyForm
        initialValues={initialValues}
        submitLabel="O'zgarishlarni saqlash"
        submittingLabel="Saqlanmoqda..."
        submitting={saving}
        error={error}
        serverFieldErrors={fieldErrors}
        onSubmit={handleSubmit}
      >
        <label>Joriy rasmlar</label>

        {existingImages.length === 0 ? (
          <p>Rasm yo'q. Kamida 1 ta rasm qo'shing.</p>
        ) : (
          <ul className="edit-images">
            {existingImages.map((image) => (
              <li key={image.id}>
                <img src={getImageUrl(image.url)} alt={image.altText ?? ""} />
                <button
                  type="button"
                  disabled={imageBusy}
                  onClick={() => handleDeleteImage(image.id)}
                >
                  O'chirish
                </button>
              </li>
            ))}
          </ul>
        )}

        <label>Yangi rasmlar qo'shish</label>

        <ImagePicker
          files={newImages}
          onChange={setNewImages}
          disabled={imageBusy}
        />

        {newImages.length > 0 && (
          <button
            type="button"
            disabled={imageBusy}
            onClick={handleUploadImages}
          >
            {imageBusy
              ? "Yuklanmoqda..."
              : `${newImages.length} ta rasmni yuklash`}
          </button>
        )}

        {imageMessage && <p>{imageMessage}</p>}

        <p style={{ color: "#8a6500" }}>
          Eslatma: e'lonni tahrirlasangiz, u qayta moderatsiyaga (Kutilmoqda)
          o'tadi va tasdiqlanmaguncha ommaviy ro'yxatda ko'rinmaydi.
        </p>
      </PropertyForm>
    </div>
  );
}

export default EditProperty;
