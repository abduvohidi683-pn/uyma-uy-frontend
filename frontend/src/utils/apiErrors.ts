export interface ParsedApiError {
  /** maydon nomi -> o'zbekcha xabar (class-validator massividan) */
  fields: Record<string, string>;
  /** maydonga bog'lanmagan umumiy xabar */
  general: string;
}

const TRANSLATIONS: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/must be longer than or equal to (\d+) characters/, (m) => `kamida ${m[1]} ta belgi bo'lishi kerak`],
  [/must be shorter than or equal to (\d+) characters/, (m) => `ko'pi bilan ${m[1]} ta belgi bo'lishi kerak`],
  [/must be an email/, () => "to'g'ri email kiriting"],
  [/must be a valid phone number/, () => "telefon raqami noto'g'ri (masalan, +998901234567)"],
  [/should not be empty/, () => "bo'sh bo'lmasligi kerak"],
  [/must be a positive number/, () => "0 dan katta bo'lishi kerak"],
  [/must not be less than (\d+)/, (m) => `${m[1]} dan kam bo'lmasligi kerak`],
  [/must not be greater than (\d+)/, (m) => `${m[1]} dan oshmasligi kerak`],
  [/must be an integer number/, () => "butun son bo'lishi kerak"],
  [/must be a number/, () => "son bo'lishi kerak"],
  [/must be one of the following values/, () => "noto'g'ri qiymat"],
  [/must be a string/, () => "matn bo'lishi kerak"],
];

const translate = (text: string): string => {
  for (const [pattern, build] of TRANSLATIONS) {
    const match = text.match(pattern);
    if (match) return build(match);
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
