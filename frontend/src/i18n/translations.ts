import { common } from "./dict/common";
import { nav } from "./dict/nav";
import { home } from "./dict/home";
import { properties } from "./dict/properties";
import { detail } from "./dict/detail";
import { auth } from "./dict/auth";
import { dashboard } from "./dict/dashboard";
import { forms } from "./dict/forms";
import { admin } from "./dict/admin";

export const LANGS = ["uz", "ru", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const LANG_LABELS: Record<Lang, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};

const parts = [common, nav, home, properties, detail, auth, dashboard, forms, admin];

// Har bir bo'lim uz/ru/en uchun bir xil kalitlarga ega (TypeScript tekshiradi)
export const dictionaries = {
  uz: Object.assign({}, ...parts.map((p) => p.uz)) as (typeof common.uz &
    typeof nav.uz &
    typeof home.uz &
    typeof properties.uz &
    typeof detail.uz &
    typeof auth.uz &
    typeof dashboard.uz &
    typeof forms.uz &
    typeof admin.uz),
  ru: Object.assign({}, ...parts.map((p) => p.ru)) as Record<string, string>,
  en: Object.assign({}, ...parts.map((p) => p.en)) as Record<string, string>,
};

export type TKey = keyof typeof dictionaries.uz;
