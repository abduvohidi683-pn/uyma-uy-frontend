import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, LANGS, type Lang, type TKey } from "./translations";

const STORAGE_KEY = "lang";

function readLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (LANGS as readonly string[]).includes(saved)) {
      return saved as Lang;
    }
  } catch {
    // localStorage mavjud bo'lmasa — standart til
  }
  return "uz";
}

const LOCALES: Record<Lang, string> = { uz: "uz-UZ", ru: "ru-RU", en: "en-GB" };

const CATEGORY_PATTERNS: Array<[RegExp, TKey]> = [
  [/kvartira|apartment|flat|квартир/i, "cat.apartment"],
  [/tijorat|commercial|коммерч/i, "cat.commercial"],
  [/ofis|office|офис/i, "cat.office"],
  [/yer|uchastka|land|plot|участ|земел/i, "cat.land"],
  [/uy|house|home|villa|dom|дом|коттедж/i, "cat.house"],
];

// React tashqarisidagi kod (masalan, xato xabarlarini o'girish) uchun joriy til
let currentLang: Lang = readLang();

type Params = Record<string, string | number>;

function translate(lang: Lang, key: TKey, params?: Params): string {
  let text: string = dictionaries[lang][key] ?? dictionaries.uz[key] ?? key;
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

/** React tashqarisida ishlatiladigan tarjima funksiyasi (joriy tilda). */
export function tr(key: TKey, params?: Params): string {
  return translate(currentLang, key, params);
}

interface I18nValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TKey, params?: Params) => string;
  /** Joriy tildagi son formati (narx, maydon) */
  n: (value: number) => string;
  /** Joriy tildagi sana formati */
  d: (value: string | number | Date, withTime?: boolean) => string;
  /** Kategoriya nomi joriy tilda (backend bitta tilda saqlaydi) */
  catName: (category: { name: string; slug?: string }) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(currentLang);

  useEffect(() => {
    currentLang = lang;
    document.documentElement.lang = lang;
    // Brauzer sarlavhasi ham tanlangan tilda
    document.title = `${translate(lang, "brand.name")} — ${translate(lang, "brand.tagline")}`;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    currentLang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // saqlab bo'lmasa ham til joriy sessiyada almashadi
    }
    setLangState(next);
  }, []);

  const t = useCallback(
    (key: TKey, params?: Params) => translate(lang, key, params),
    [lang]
  );

  const n = useCallback(
    (value: number) => new Intl.NumberFormat(LOCALES[lang]).format(value),
    [lang]
  );

  const d = useCallback(
    (value: string | number | Date, withTime = false) => {
      const date = new Date(value);
      return withTime
        ? date.toLocaleString(LOCALES[lang])
        : date.toLocaleDateString(LOCALES[lang]);
    },
    [lang]
  );

  const catName = useCallback(
    (category: { name: string; slug?: string }) => {
      const source = `${category.slug ?? ""} ${category.name}`;
      const hit = CATEGORY_PATTERNS.find(([re]) => re.test(source));
      return hit ? translate(lang, hit[1]) : category.name;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang, t, n, d, catName }),
    [lang, setLang, t, n, d, catName]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n faqat I18nProvider ichida ishlaydi");
  return ctx;
}
