import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerRequest } from "../../services/auth";
import { parseApiError } from "../../utils/apiErrors";
import { useI18n } from "../../i18n/I18nContext";
import FieldError from "../../components/FieldError";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import PasswordInput from "../../components/PasswordInput";

function Register() {
  const navigate = useNavigate();
  const { t } = useI18n();

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
        setFieldErrors({ phone: t("auth.register.phoneFormat") });
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
      const parsed = parseApiError(err, t("auth.register.fail"));
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
    <AuthLayout
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
    >
      <form className="flex flex-col" onSubmit={handleRegister} noValidate>
        <label className="field-label !mt-0" htmlFor="reg-name">
          {t("auth.register.fullName")}
        </label>
        <input
          id="reg-name"
          className="input"
          type="text"
          placeholder={t("auth.register.fullNamePh")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          autoComplete="name"
        />
        <FieldError message={fieldErrors.fullName} />

        <label className="field-label" htmlFor="reg-email">
          {t("auth.email")}
        </label>
        <input
          id="reg-email"
          className="input"
          type="email"
          placeholder={t("auth.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <FieldError message={fieldErrors.email} />

        <label className="field-label" htmlFor="reg-password">
          {t("auth.password")}
        </label>
        <PasswordInput
          id="reg-password"
          placeholder={t("auth.passwordHint")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoComplete="new-password"
        />
        <FieldError message={fieldErrors.password} />

        <label className="field-label" htmlFor="reg-phone">
          {t("auth.register.phone")}
        </label>
        <input
          id="reg-phone"
          className="input"
          type="tel"
          placeholder="+998901234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
        <FieldError message={fieldErrors.phone} />

        {error && (
          <p role="alert" className="alert alert-error mt-4">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="btn btn-dark mt-6 w-full py-4"
          disabled={loading}
        >
          {loading ? t("auth.register.loading") : t("auth.register.submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {t("auth.register.haveAccount")}{" "}
        <Link to="/login" className="font-medium text-bronze-deep">
          {t("auth.login.submit")}
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
