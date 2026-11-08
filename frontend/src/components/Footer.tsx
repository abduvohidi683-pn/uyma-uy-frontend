import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../i18n/I18nContext";

const YEAR = new Date().getFullYear();

const linkClass =
  "inline-flex min-h-11 w-fit items-center text-[15px] text-ink-2 underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-accent sm:min-h-9";
const headingClass = "mb-2 text-sm font-normal text-muted";

/** Footer: platforma tavsifi katta harfda bayonot sifatida, yonida havolalar. */
function Footer() {
  const { isLoggedIn, isAdmin } = useAuth();
  const { t } = useI18n();

  return (
    <footer className="mt-[var(--section-gap-s)]">
      <div className="container-page">
        <div className="grid gap-12 border-t border-ink py-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="flex flex-col gap-8">
            <Logo />
            <p className="max-w-[24ch] font-serif text-[length:var(--text-sub)] font-light leading-[1.2] tracking-[var(--tracking-statement)] text-ink">
              {t("footer.desc")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:pt-14">
            <nav className="flex flex-col" aria-label={t("footer.pages")}>
              <h4 className={headingClass}>{t("footer.pages")}</h4>
              <Link to="/" className={linkClass}>
                {t("nav.home")}
              </Link>
              <Link to="/properties?type=SALE" className={linkClass}>
                {t("nav.buy")}
              </Link>
              <Link to="/properties?type=RENT" className={linkClass}>
                {t("nav.rent")}
              </Link>
              <Link
                to={isLoggedIn ? "/create-property" : "/register"}
                className={linkClass}
              >
                {t("nav.post")}
              </Link>
            </nav>

            <nav className="flex flex-col" aria-label={t("footer.account")}>
              <h4 className={headingClass}>{t("footer.account")}</h4>
              {isLoggedIn ? (
                <>
                  <Link to="/my-properties" className={linkClass}>
                    {t("side.myProperties")}
                  </Link>
                  <Link to="/favorites" className={linkClass}>
                    {t("side.favorites")}
                  </Link>
                  <Link to="/profile" className={linkClass}>
                    {t("nav.profile")}
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className={linkClass}>
                      {t("nav.admin")}
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className={linkClass}>
                    {t("nav.login")}
                  </Link>
                  <Link to="/register" className={linkClass}>
                    {t("nav.register")}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-line pb-8 pt-6 text-sm text-muted sm:flex-row">
          <span>
            {t("brand.name")} © {YEAR}
          </span>
          <span>{t("footer.rights")}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
