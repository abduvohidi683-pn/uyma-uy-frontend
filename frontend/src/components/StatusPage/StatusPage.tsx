import { Link } from "react-router-dom";
import "./StatusPage.css";

interface StatusPageProps {
  code: string;
  title: string;
  text: string;
  linkTo?: string;
  linkLabel?: string;
}

/** 403 / 404 kabi to'liq sahifa holatlari uchun umumiy ko'rinish. */
function StatusPage({
  code,
  title,
  text,
  linkTo = "/",
  linkLabel = "Bosh sahifaga qaytish",
}: StatusPageProps) {
  return (
    <main className="status-page">
      <span className="status-code">{code}</span>
      <h1>{title}</h1>
      <p>{text}</p>
      <Link to={linkTo} className="status-link">
        {linkLabel}
      </Link>
    </main>
  );
}

export default StatusPage;
