import { useSyncExternalStore } from "react";
import i18n from "./index";
import ja from "./locales/ja";
import {
  formattedMessages,
  type MessageKey,
  type MessageValues,
} from "./source";
const entries = Object.entries(ja.messages) as [MessageKey, string][];
const reverse = new Map<string, MessageKey>(
  entries.map(([key, value]) => [value, key]),
);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const patterns = entries
  .filter(([, s]) => s.includes("{{"))
  .map(([key, text]) => {
    const names: string[] = [];
    let at = 0,
      pattern = "^",
      m;
    const re = /\{\{(\w+)\}\}/g;
    while ((m = re.exec(text))) {
      pattern += escape(text.slice(at, m.index)) + "([\\s\\S]*?)";
      names.push(m[1]);
      at = m.index + m[0].length;
    }
    pattern += escape(text.slice(at)) + "$";
    return {
      key,
      names,
      re: new RegExp(pattern),
      size: text.replace(/\{\{.*?\}\}/g, "").length,
    };
  })
  .sort((a, b) => b.size - a.size);
const fragments = entries
  .filter(([, s]) => s.length >= 4 && !s.includes("{{") && !s.includes("\n"))
  .sort((a, b) => b[1].length - a[1].length);
export function tText(key: MessageKey, values: MessageValues = {}): string {
  return String(i18n.t(`messages.${key}`, values as never));
}
function parameter(value: unknown): unknown {
  return typeof value === "string" ? translateText(value) : value;
}
/** Only localize UI labels and system messages. User-authored content opts out in display components. */
export function translateText<T>(value: T): T {
  if (typeof value !== "string" || i18n.language.startsWith("ja")) return value;
  const exact = reverse.get(value);
  if (exact) return tText(exact) as T;
  const arrow = value.split(" → ");
  if (arrow.length > 1 && arrow.every((part) => reverse.has(part)))
    return arrow.map((part) => tText(reverse.get(part)!)).join(" → ") as T;
  const pay = /^(年収|月給|時給)\s*([0-9,.]+)\s*(万円|円)$/.exec(value);
  if (pay) {
    const amount =
      Number(pay[2].replaceAll(",", "")) * (pay[3] === "万円" ? 10000 : 1);
    return `${tText(reverse.get(pay[1])!)} JPY ${amount.toLocaleString("en-US")}` as T;
  }
  const formatted = formattedMessages.get(value);
  if (formatted) {
    const values = Object.fromEntries(
      Object.entries(formatted.values).map(([name, v]) => [
        name,
        formatted.protectedValues.includes(name) ? v : parameter(v),
      ]),
    );
    return tText(formatted.key, values) as T;
  }
  for (const pattern of patterns) {
    if (pattern.size < 8) continue;
    const match = pattern.re.exec(value);
    if (match) {
      const params = Object.fromEntries(
        pattern.names.map((name, index) => [name, parameter(match[index + 1])]),
      );
      return tText(pattern.key, params) as T;
    }
  }
  // Server validation messages can prefix a field name to a shared suffix.
  for (const [key, text] of fragments) {
    if (value.endsWith(text) && text.startsWith("を"))
      return (translateText(value.slice(0, -text.length)) +
        " " +
        tText(key)) as T;
  }
  return value;
}
export function translateMarkup(text: string): string {
  if (i18n.language.startsWith("ja")) return text;
  let result = text;
  for (const [key, label] of fragments) {
    if (/[ぁ-んァ-ヶ一-龯]/.test(label))
      result = result.split(label).join(tText(key));
  }
  return result;
}
const subscribe = (notify: () => void) => {
  i18n.on("languageChanged", notify);
  return () => i18n.off("languageChanged", notify);
};
export function useLocaleVersion() {
  return useSyncExternalStore(
    subscribe,
    () => i18n.language,
    () => "ja",
  );
}
export function localeTag() {
  return i18n.language.startsWith("en") ? "en-US" : "ja-JP";
}
