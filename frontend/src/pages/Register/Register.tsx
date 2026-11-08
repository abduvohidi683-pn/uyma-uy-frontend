import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../../services/auth";
import { parseApiError } from "../../utils/apiErrors";
import FieldError from "../../components/FieldError";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      setFieldErrors({});

      const cleanPhone = phone.replace(/[\s-]/g, "");

      if (cleanPhone && !/^(\+998)?\d{9}$/.test(cleanPhone)) {
        setFieldErrors({ phone: "Telefon formati: +998901234567" });
        return;
      }

      await registerRequest({
        fullName,
        email,
        password,
        phone: cleanPhone || undefined,
      });

      navigate("/login");
    } catch (err) {
      const parsed = parseApiError(
        err,
        "Ro‘yxatdan o‘tishda xatolik yuz berdi."
      );
      const status = (err as { response?: { status?: number } })?.response
        ?.status;

      // 409: email band — xatoni email maydoni ostida ko'rsatamiz
      if (status === 409) {
        setFieldErrors({ email: parsed.general });
      } else {
        setFieldErrors(parsed.fields);
        setError(parsed.general);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h1>Ro‘yxatdan o‘tish</h1>

        <input
          type="text"
          placeholder="To‘liq ism"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
        />
        <FieldError message={fieldErrors.fullName} />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FieldError message={fieldErrors.email} />

        <input
          type="password"
          placeholder="Parol (kamida 8 ta belgi)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <FieldError message={fieldErrors.password} />

        <input
          type="tel"
          placeholder="Telefon raqam (ixtiyoriy)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <FieldError message={fieldErrors.phone} />

        {error && <p className="register-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Yuklanmoqda..." : "Ro‘yxatdan o‘tish"}
        </button>

        <p>
          Akkauntingiz bormi? <Link to="/login">Kirish</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;