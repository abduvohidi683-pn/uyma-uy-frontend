import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Building2,
  ChevronDown,
  FolderTree,
  Heart,
  Inbox,
  Menu,
  MessageSquare,
  Plus,
  ShieldCheck,
  User,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { TKey } from "../../i18n/translations";
import LogoutButton from "../LogoutButton/LogoutButton";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
import { useAuth } from "../../context/AuthContext";
import { useI18n } from "../../i18n/I18nContext";

interface MenuItem {
  to: string;
  icon: LucideIcon;
  label: TKey;
}

const USER_MENU: MenuItem[] = [
  { to: "/my-properties", icon: Building2, label: "side.myProperties" },
  { to: "/favorites", icon: Heart, label: "side.favorites" },
  { to: "/received-inquiries", icon: Inbox, label: "side.received" },
  { to: "/my-inquiries", icon: MessageSquare, label: "side.inquiries" },
  { to: "/profile", icon: User, label: "nav.profile" },
];

const ADMIN_MENU: MenuItem[] = [
  { to: "/admin", icon: ShieldCheck, label: "side.adminOverview" },
  { to: "/admin/properties", icon: ShieldCheck, label: "side.adminModeration" },
  { to: "/admin/categories", icon: FolderTree, label: "side.adminCategories" },
  { to: "/admin/users", icon: Users, label: "side.adminUsers" },
];

function Navbar() {
  const { isLoggedIn, isAdmin, user } = useAuth();
  const { t } = useI18n();
  const { pathname, search } = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Sahifa almashganda menyularni yopamiz
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname, search]);

  // Menyudan tashqariga bosilsa yoki Esc bosilsa yopiladi
  useEffect(() => {
    if (!userMenuOpen) return;

    const onClick = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [userMenuOpen]);

  // Login/Register sahifalari to'liq ekranli bo'lingan dizaynga ega
  if (pathname === "/login" || pathname === "/register") return null;

  const type = new URLSearchParams(search).get("type");

  const items = [
    {
      to: "/properties?type=SALE",
      label: t("nav.buy"),
      active: pathname === "/properties" && type === "SALE",
    },
    {
      to: "/properties?type=RENT",
      label: t("nav.rent"),
      active: pathname === "/properties" && type === "RENT",
    },
    {
      to: "/create-property",
      label: t("nav.post"),
      active: pathname === "/create-property",
    },
  ];

  const linkClass = (active: boolean) =>
    `relative inline-flex min-h-11 items-center px-4 text-sm transition-colors after:absolute after:inset-x-4 after:bottom-2 after:h-px after:origin-left after:bg-bronze after:transition-transform ${
      active
        ? "text-ink after:scale-x-100"
        : "text-ink-2 after:scale-x-0 hover:text-ink hover:after:scale-x-100"
    }`;

  const mobileLink =
    "flex min-h-12 items-center gap-3 border-b border-line px-1 text-sm";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="container-page flex h-[72px] items-center justify-between gap-4">
        <Logo />

        {/* Kompyuter menyusi */}
        <nav className="hidden items-center md:flex">
          {items.map((item) => (
            <Link key={item.to} to={item.to} className={linkClass(item.active)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <LanguageSwitcher />

          {isLoggedIn ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                type="button"
                className="flex min-h-11 items-center gap-2.5 rounded-[var(--radius-pill)] border border-line py-1 pl-1 pr-3 text-sm text-ink transition-colors hover:border-ink"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="grid size-9 place-items-center rounded-full bg-ink font-serif text-base text-paper">
                  {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
                </span>
                <span className="hidden max-w-[110px] truncate lg:inline">
                  {user?.fullName}
                </span>
                <ChevronDown size={15} />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+10px)] z-[60] flex min-w-[260px] flex-col card p-2 text-ink"
                  role="menu"
                >
                  <div className="mb-1.5 flex flex-col border-b border-line px-3 pb-3 pt-2.5">
                    <strong className="font-serif text-lg font-medium">
                      {user?.fullName}
                    </strong>
                    <span className="truncate text-[13px] text-muted">
                      {user?.email}
                    </span>
                    {isAdmin && (
                      <span className="mt-2 w-fit text-xs text-accent">
                        Admin
                      </span>
                    )}
                  </div>
                  {[...USER_MENU, ...(isAdmin ? ADMIN_MENU : [])].map(
                    ({ to, icon: Icon, label }) => (
                      <Link
                        key={to}
                        to={to}
                        role="menuitem"
                        className="flex min-h-11 items-center gap-2.5 px-3 text-sm hover:bg-paper-2"
                      >
                        <Icon size={16} strokeWidth={1.5} className="text-muted" /> {t(label)}
                      </Link>
                    )
                  )}
                  <div className="mt-1.5 border-t border-line px-1 pb-0.5 pt-2">
                    <LogoutButton className="w-full" />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden min-h-11 items-center px-3 text-sm text-ink-2 underline decoration-transparent underline-offset-4 hover:text-ink hover:decoration-accent md:inline-flex"
              >
                {t("nav.login")}
              </Link>
              <Link
                to="/register"
                className="btn btn-dark btn-sm hidden md:inline-flex"
              >
                {t("nav.register")}
              </Link>
            </>
          )}

          <button
            type="button"
            className="grid size-11 place-items-center rounded-[var(--radius-pill)] border border-ink text-ink md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t("nav.menuClose") : t("nav.menuOpen")}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobil menyu */}
      {menuOpen && (
        <nav className="absolute inset-x-0 top-full z-[60] max-h-[calc(100dvh-72px)] overflow-y-auto border-b border-line bg-paper px-[var(--gutter)] pb-6 pt-2 md:hidden">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`${mobileLink} ${item.active ? "text-accent" : ""}`}
            >
              {item.label}
            </Link>
          ))}

          {isLoggedIn ? (
            <>
              {[...USER_MENU, ...(isAdmin ? ADMIN_MENU : [])].map(
                ({ to, icon: Icon, label }) => (
                  <Link key={to} to={to} className={mobileLink}>
                    <Icon size={16} /> {t(label)}
                  </Link>
                )
              )}
              <div className="mt-4 flex flex-col gap-2.5">
                <Link to="/create-property" className="btn btn-bronze">
                  <Plus size={16} />
                  {t("nav.post")}
                </Link>
                <LogoutButton className="w-full" />
              </div>
            </>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <Link to="/login" className="btn btn-outline">
                {t("nav.login")}
              </Link>
              <Link to="/register" className="btn btn-dark">
                {t("nav.register")}
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
