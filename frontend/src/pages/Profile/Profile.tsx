import { useState } from "react";
import type React from "react";

import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import FieldError from "../../components/FieldError";
import PageHeader from "../../components/PageHeader/PageHeader";
import { updateMe, type UpdateProfileData } from "../../services/user";
import { parseApiError } from "../../utils/apiErrors";

const PHONE_REGEX = /^(\+998)?\d{9}$/;

function Profile() {
  const { user, isAdmin, updateUser } = useAuth();
  const { t } = useI18n();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const startEditing = () => {
    setFullName(user.fullName);
    setPhone(user.phone ?? "");
    setError("");
    setFieldErrors({});
    setSuccess("");
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setFieldErrors({});
    setSuccess("");

    const name = fullName.trim();
    const cleanPhone = phone.replace(/[\s-]/g, "");
    const clientErrors: Record<string, string> = {};

    if (name.length < 2 || name.length > 100) {
      clientErrors.fullName = t("profile.nameErr");
    }

    if (cleanPhone && !PHONE_REGEX.test(cleanPhone)) {
      clientErrors.phone = t("profile.phoneErr");
    }

    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    // Notion: PATCH /users/me faqat fullName va phone qabul qiladi
    const payload: UpdateProfileData = {};

    if (name !== user.fullName) {
      payload.fullName = name;
    }

    if (cleanPhone && cleanPhone !== user.phone) {
      payload.phone = cleanPhone;
    }

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);

      const updated = await updateMe(payload);

      updateUser(updated);

      setSuccess(t("profile.saved"));
      setIsEditing(false);
    } catch (err) {
      const parsed = parseApiError(err, t("profile.saveFail"));
      setFieldErrors(parsed.fields);
      setError(parsed.general);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow={t("nav.profile")} title={user.fullName} />

      <section className="card flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:p-[30px]">
        <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-charcoal font-serif text-[34px] font-medium text-bronze-light">
          {user.fullName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2.5 truncate text-muted">{user.email}</p>

          <span
            className={`inline-block rounded-[var(--radius-pill)] px-3.5 py-1 text-xs font-medium tracking-wide ${
              isAdmin ? "bg-charcoal text-paper" : "bg-bronze-soft text-bronze-deep"
            }`}
          >
            {isAdmin ? t("role.ADMIN") : t("role.USER")}
          </span>
        </div>

        <LogoutButton />
      </section>

      <section className="card p-6 sm:p-[30px]">
        <div className="mb-[22px] flex items-center justify-between gap-3">
          <h2 className="text-[26px]">{t("profile.title")}</h2>

          {!isEditing && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={startEditing}
            >
              {t("common.edit")}
            </button>
          )}
        </div>

        {success && <p className="alert alert-success mb-4">{success}</p>}

        {isEditing ? (
          <form className="flex flex-col" onSubmit={handleSave} noValidate>
            <label className="field-label !mt-0" htmlFor="fullName">
              {t("profile.fullName")}
            </label>
            <input
              id="fullName"
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <FieldError message={fieldErrors.fullName} />

            <label className="field-label" htmlFor="email">
              {t("profile.email")}
            </label>
            <input
              id="email"
              className="input cursor-not-allowed bg-canvas text-muted"
              value={user.email}
              readOnly
              disabled
            />
            <small className="mt-1 text-xs text-muted">
              {t("profile.emailLocked")}
            </small>

            <label className="field-label" htmlFor="phone">
              {t("profile.phone")}
            </label>
            <input
              id="phone"
              type="tel"
              className="input"
              placeholder="+998901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <FieldError message={fieldErrors.phone} />

            {error && <p className="alert alert-error mt-4">{error}</p>}

            <div className="mt-5 flex gap-2.5">
              <button type="submit" className="btn btn-dark btn-sm" disabled={saving}>
                {saving ? t("common.saving") : t("common.save")}
              </button>

              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                  setFieldErrors({});
                }}
                disabled={saving}
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        ) : (
          <dl>
            {[
              [t("profile.fullName"), user.fullName],
              [t("profile.email"), user.email],
              [t("profile.phone"), user.phone || t("common.notSet")],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col gap-1 border-b border-line py-4 last:border-b-0 sm:flex-row sm:justify-between sm:gap-4"
              >
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="break-all font-medium sm:text-right">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>
    </div>
  );
}

export default Profile;
