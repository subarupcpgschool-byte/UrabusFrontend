import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ja from "./locales/ja";
import en from "./locales/en";
export type AppLanguage = "ja" | "en";
export const LANGUAGE_STORAGE_KEY = "globalworkers.language";
i18n.use(initReactI18next).init({
  resources: { ja: { translation: ja }, en: { translation: en } },
  lng: "ja",
  fallbackLng: "ja",
  supportedLngs: ["ja", "en"],
  initAsync: false,
  returnEmptyString: true,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});
export default i18n;
