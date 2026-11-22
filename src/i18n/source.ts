import ja from "./locales/ja";
export type MessageKey = keyof typeof ja.messages;
export type MessageValues = Record<string, unknown>;
export const formattedMessages = new Map<
  string,
  { key: MessageKey; values: MessageValues; protectedValues: string[] }
>();
/** Canonical text for API values, typed enums, and data models. Never depends on the UI locale. */
export function sourceText<K extends MessageKey>(
  key: K,
): (typeof ja.messages)[K] {
  return ja.messages[key];
}
export function sourceFormat(
  key: MessageKey,
  values: MessageValues,
  protectedValues: string[] = [],
): string {
  const text = ja.messages[key].replace(/\{\{(\w+)\}\}/g, (_, name) =>
    String(values[name] ?? ""),
  );
  if (formattedMessages.size > 2048)
    formattedMessages.delete(formattedMessages.keys().next().value!);
  formattedMessages.set(text, { key, values, protectedValues });
  return text;
}
