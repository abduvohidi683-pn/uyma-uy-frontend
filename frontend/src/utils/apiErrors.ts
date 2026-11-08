import { tr } from "../i18n/I18nContext";
import type { TKey } from "../i18n/translations";

export interface ParsedApiError {
  /** maydon nomi -> tarjima qilingan xabar (class-validator massividan) */
  fields: Record<string, string>;
  /** maydonga bog'lanmagan umumiy xabar */
  general: string;
}

// class-validator'ning inglizcha xabarlarini joriy tilga o'giradi
const PATTERNS: Array<[RegExp, TKey, boolean]> = [
  [/must be longer than or equal to (\d+) characters/, "val.minLen", true],
  [/must be shorter than or equal to (\d+) characters/, "val.maxLen", true],
  [/must be an email/, "val.email", false],
  [/must be a valid phone number/, "val.phone", false],
  [/should not be empty/, "val.notEmpty", false],
  [/must be a positive number/, "val.positive", false],
  [/must not be less than (\d+)/, "val.min", true],
  [/must not be greater than (\d+)/, "val.max", true],
  [/must be an integer number/, "val.int", false],
  [/must be a number/, "val.number", false],
  [/must be one of the following values/, "val.oneOf", false],
  [/must be a string/, "val.string", false],
];

const translate = (text: string): string => {
  for (const [pattern, key, withNumber] of PATTERNS) {
    const match = text.match(pattern);
    if (match) return tr(key, withNumber ? { n: match[1] } : undefined);
  }
  return text;
};

/**
 * NestJS xatosini ajratadi: `message` matn bo'lsa — umumiy xabar,
 * massiv bo'lsa — birinchi so'zi maydon nomi bo'lgan xabarlar maydonlarga bo'linadi.
 */
export function parseApiError(err: unknown, fallback: string): ParsedApiError {
  const message = (
    err as { response?: { data?: { message?: string | string[] } } }
  )?.response?.data?.message;

  if (!message) return { fields: {}, general: fallback };
  if (!Array.isArray(message)) return { fields: {}, general: message };

  const fields: Record<string, string> = {};
  const general: string[] = [];

  for (const item of message) {
    const match = item.match(/^([a-zA-Z][a-zA-Z0-9]*)\s+(.*)$/);

    if (match && /^[a-z]+([A-Z][a-z0-9]*)*$/.test(match[1])) {
      // Bitta maydonga bir nechta xabar bo'lsa, birinchisini qoldiramiz
      fields[match[1]] ??= translate(match[2]);
    } else {
      general.push(item);
    }
  }

  return { fields, general: general.join(", ") };
}
