import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginRequest } from "../../services/auth";
import { getErrorMessage } from "../../types/api";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../i18n/I18nContext";
import AuthLayout from "../../components/AuthLayout/AuthLayout";
import PasswordInput from "../../components/PasswordInput";

/** Login'dan keyin qaytiladigan manzil: faqat oddiy sahifalar (admin/auth emas). */
function safeReturnPath(from?: string): string {
  if (!from || !from.startsWith("/")) return "/";
  if (from.startsWith("/admin") || from === "/login" || from === "/register") {
    return "/";
  }
  return from;
}

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await loginRequest({ email, password });

      login(data.accessToken, data.user);

      // Faqat ADMIN /admin ga tushadi; oddiy user doim oddiy sahifaga
      if (data.user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate(safeReturnPath(from), { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err, t("auth.login.fail")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.login.title")} subtitle={t("auth.login.subtitle")}>
      <form className="flex flex-col" onSubmit={handleLogin}>
        <label className="field-label !mt-0" htmlFor="login-email">
          {t("auth.email")}
        </label>
        <input
          id="login-email"
          className="input"
          type="email"
          placeholder={t("auth.emailPh")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label className="field-label" htmlFor="login-password">
          {t("auth.password")}
        </label>
        <PasswordInput
          id="login-password"
          placeholder={t("auth.passwordPh")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

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
          {loading ? t("auth.login.loading") : t("auth.login.submit")}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {t("auth.login.noAccount")}{" "}
        <Link to="/register" className="font-medium text-bronze-deep">
          {t("auth.register.title")}
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
