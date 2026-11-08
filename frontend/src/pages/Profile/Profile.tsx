import { useState } from "react";
import type React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageSquare,
  Building2,
  Plus,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import { updateMe, type UpdateProfileData } from "../../services/user";
import { getErrorMessage } from "../../types/api";

import "./Profile.css";

const PHONE_REGEX = /^(\+998)?\d{9}$/;

function Profile() {
  const { user, isAdmin, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const startEditing = () => {
    setFullName(user.fullName);
    setPhone(user.phone ?? "");
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const name = fullName.trim();
    const cleanPhone = phone.replace(/[\s-]/g, "");

    if (name.length < 2 || name.length > 100) {
      setError("Ism 2 dan 100 belgigacha bo‘lishi kerak.");
      return;
    }

    if (cleanPhone && !PHONE_REGEX.test(cleanPhone)) {
      setError("Telefon formati: +998901234567");
      return;
    }

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

      setSuccess("Ma’lumotlar saqlandi.");
      setIsEditing(false);
    } catch (err) {
      setError(
        getErrorMessage(err, "Saqlashda xatolik yuz berdi.")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-avatar">
          {user.fullName.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h1>{user.fullName}</h1>

          <span className={`profile-role ${isAdmin ? "admin" : ""}`}>
            {isAdmin ? "Administrator" : "Foydalanuvchi"}
          </span>
        </div>

        <LogoutButton />
      </section>

      <section className="profile-details">
        <div className="profile-details-header">
          <h2>Ma’lumotlarim</h2>

          {!isEditing && (
            <button
              type="button"
              className="profile-edit-btn"
              onClick={startEditing}
            >
              Tahrirlash
            </button>
          )}
        </div>

        {success && (
          <p className="profile-success">{success}</p>
        )}

        {isEditing ? (
          <form className="profile-form" onSubmit={handleSave}>
            <label htmlFor="fullName">To‘liq ism</label>

            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <label htmlFor="phone">Telefon</label>

            <input
              id="phone"
              type="tel"
              placeholder="+998901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            {error && (
              <p className="profile-error">{error}</p>
            )}

            <div className="profile-form-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                }}
                disabled={saving}
              >
                Bekor qilish
              </button>
            </div>
          </form>
        ) : (
          <dl>
            <div>
              <dt>To‘liq ism</dt>
              <dd>{user.fullName}</dd>
            </div>

            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>

            <div>
              <dt>Telefon</dt>
              <dd>{user.phone || "Kiritilmagan"}</dd>
            </div>
          </dl>
        )}
      </section>

      <section className="profile-links">
        <Link to="/my-properties">
          <Building2 size={22} />
          Mening e’lonlarim
        </Link>

        <Link to="/favorites">
          <Heart size={22} />
          Sevimlilar
        </Link>

        <Link to="/my-inquiries">
          <MessageSquare size={22} />
          Murojaatlarim
        </Link>

        <Link to="/create-property">
          <Plus size={22} />
          E’lon qo‘shish
        </Link>

        {isAdmin && (
          <Link to="/admin">
            <ShieldCheck size={22} />
            Admin panel
          </Link>
        )}
      </section>
    </main>
  );
}

export default Profile;