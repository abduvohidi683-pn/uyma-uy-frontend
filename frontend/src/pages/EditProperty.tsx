import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPropertyById,
  updateProperty,
  type CreatePropertyData,
} from "../services/property";
import type { PropertyImage } from "../types/property";
import { uploadPropertyImage, deletePropertyImage } from "../services/image";
import ConfirmDialog from "../components/ConfirmDialog";
import ImagePicker from "../components/ImagePicker/ImagePicker";
import PropertyForm from "../components/PropertyForm/PropertyForm";
import StatusPage from "../components/StatusPage/StatusPage";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nContext";
import { getImageUrl } from "../utils/format";
import { parseApiError } from "../utils/apiErrors";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useI18n();

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
  const [imageToDelete, setImageToDelete] = useState<number | null>(null);

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
    try {
      setImageBusy(true);
      setImageMessage("");
      await deletePropertyImage(Number(id), imageId);
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      setImageMessage(parseApiError(err, t("edit.delImgFail")).general);
    } finally {
      setImageBusy(false);
      setImageToDelete(null);
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
      setImageMessage(t("edit.uploaded"));
    } catch (err) {
      setImageMessage(
        t("edit.uploadFail", {
          reason: parseApiError(err, t("create.unknown")).general,
        })
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
      const parsed = parseApiError(err, t("edit.fail"));
      setFieldErrors(parsed.fields);
      setError(parsed.general);
    } finally {
      setSaving(false);
    }
  };

  if (loadStatus === "loading") return <Loading />;

  if (loadStatus === "notFound") {
    return (
      <StatusPage
        code="404"
        title={t("edit.notFound.title")}
        text={t("edit.notFound.text")}
        linkTo="/my-properties"
        linkLabel={t("edit.toMine")}
      />
    );
  }

  if (loadStatus === "forbidden") {
    return (
      <StatusPage
        code="403"
        title={t("edit.forbidden.title")}
        text={t("edit.forbidden.text")}
        linkTo="/my-properties"
        linkLabel={t("edit.toMine")}
      />
    );
  }

  if (loadStatus === "error" || !initialValues) {
    return (
      <StatusPage
        code="!"
        title={t("edit.loadErr.title")}
        text={t("edit.loadErr.text")}
        linkTo="/my-properties"
        linkLabel={t("edit.toMine")}
      />
    );
  }

  return (
    <div className="max-w-[860px]">
      <PageHeader
        eyebrow={t("edit.eyebrow")}
        title={t("edit.title")}
        subtitle={t("edit.subtitle")}
      />

      <PropertyForm
        initialValues={initialValues}
        submitLabel={t("edit.submit")}
        submittingLabel={t("edit.submitting")}
        submitting={saving}
        error={error}
        serverFieldErrors={fieldErrors}
        onSubmit={handleSubmit}
      >
        <span className="field-label">{t("edit.currentImages")}</span>

        {existingImages.length === 0 ? (
          <p className="text-sm text-muted">{t("edit.noImages")}</p>
        ) : (
          <ul className="my-2 flex flex-wrap gap-3.5">
            {existingImages.map((image) => (
              <li key={image.id} className="flex w-[140px] flex-col gap-2">
                <img
                  src={getImageUrl(image.url)}
                  alt={image.altText ?? ""}
                  loading="lazy"
                  className="h-[100px] w-[140px] rounded-2xl bg-paper-2 object-contain"
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  disabled={imageBusy}
                  onClick={() => setImageToDelete(image.id)}
                >
                  {t("common.delete")}
                </button>
              </li>
            ))}
          </ul>
        )}

        <span className="field-label">{t("edit.addImages")}</span>

        <ImagePicker
          files={newImages}
          onChange={setNewImages}
          disabled={imageBusy}
        />

        {newImages.length > 0 && (
          <button
            type="button"
            className="btn btn-outline btn-sm mt-2 self-start"
            disabled={imageBusy}
            onClick={handleUploadImages}
          >
            {imageBusy
              ? t("edit.uploading")
              : t("edit.uploadN", { n: newImages.length })}
          </button>
        )}

        {imageMessage && <p className="mt-2 text-sm">{imageMessage}</p>}

        <p className="alert mt-4 bg-warn-bg text-warn">{t("edit.note")}</p>
      </PropertyForm>

      {imageToDelete !== null && (
        <ConfirmDialog
          title={t("edit.delImg.title")}
          confirmLabel={t("myp.delete.confirm")}
          busyLabel={t("myp.delete.busy")}
          busy={imageBusy}
          danger
          onConfirm={() => handleDeleteImage(imageToDelete)}
          onCancel={() => setImageToDelete(null)}
        >
          <p>{t("edit.delImg.text")}</p>
        </ConfirmDialog>
      )}
    </div>
  );
}

export default EditProperty;
