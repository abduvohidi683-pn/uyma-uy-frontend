import type { ReactNode } from "react";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeToggle from "../ThemeToggle";
import Logo from "../Logo";
import { useI18n } from "../../i18n/I18nContext";

interface Props {
  title: string;
  subtitle: string;
  children: ReactNode;
}

/** Login va Register: chapda paspartudagi surat va bayonot, o'ngda forma. */
function AuthLayout({ title, subtitle, children }: Props) {
  const { t } = useI18n();

  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <aside className="flex flex-col justify-between gap-8 border-b border-line px-[var(--gutter)] py-7 lg:border-b-0 lg:border-r lg:p-12">
        <div className="flex items-center justify-between gap-3">
          <Logo />
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="print max-w-[460px]">
            <div className="print-window aspect-[4/3] bg-paper-2" data-slot="auth">
              <img src="/hero.jpg" alt="" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="max-w-[16ch] text-[length:var(--text-sub)] lg:text-[length:var(--text-head)] lg:leading-[1.05]">
            {t("auth.visual.title")}
          </h2>
          <p className="mt-4 hidden max-w-[44ch] text-muted lg:block">
            {t("auth.visual.text")}
          </p>
        </div>
      </aside>

      <section className="relative grid place-items-center px-[var(--gutter)] py-12">
        <div className="absolute right-6 top-6 hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-[440px]">
          <h1 className="display">{title}</h1>
          <p className="mb-8 mt-3 text-muted">{subtitle}</p>
          {children}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
