
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginRequest } from "../../services/auth";
import { getErrorMessage } from "../../types/api";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
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

            if (data.user.role === "ADMIN") {
                navigate("/admin", { replace: true });
            } else {
                navigate(from || "/", { replace: true });
            }
        } catch (err) {
            setError(getErrorMessage(err, "Email yoki parol noto'g'ri."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h1>UyJoy</h1>
                <p>Hisobingizga kiring</p>

                <label>Email</label>
                <input
                    type="email"
                    placeholder="Emailingizni kiriting"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>Parol</label>
                <input
                    type="password"
                    placeholder="Parolingizni kiriting"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && (
                    <p className="login-error">{error}</p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Kirilmoqda..." : "Kirish"}
                </button>

                <p>
                    Hisobingiz yo'qmi? <Link to="/register">Ro'yxatdan o'tish</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
