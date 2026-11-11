import en from "../../../messages/en.json";
import sw from "../../../messages/sw.json";

export type Locale = "en" | "sw";

const dictionaries: Record<Locale, typeof en> = {
  en,
  sw,
};

/**
 * Client-safe translator lookup function.
 * Resolves dot-notated keys (e.g. "planner.controls.editRooms")
 * Falls back to English if the key is missing in the chosen locale,
 * and falls back to the key string itself if not found anywhere.
 */
export function t(locale: string | undefined, path: string): string {
  const activeLocale: Locale = locale === "sw" ? "sw" : "en";
  const dict = dictionaries[activeLocale] ?? dictionaries.en;
  const parts = path.split(".");

  let current: unknown = dict;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      // Fallback to English
      let fallbackCurrent: unknown = dictionaries.en;
      for (const fbPart of parts) {
        if (
          fallbackCurrent &&
          typeof fallbackCurrent === "object" &&
          fbPart in fallbackCurrent
        ) {
          fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[fbPart];
        } else {
          return path;
        }
      }
      return typeof fallbackCurrent === "string" ? fallbackCurrent : path;
    }
  }

  return typeof current === "string" ? current : path;
}
