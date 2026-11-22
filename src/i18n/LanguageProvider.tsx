import { useEffect, type PropsWithChildren } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nextProvider } from "react-i18next";
import i18n, { LANGUAGE_STORAGE_KEY, type AppLanguage } from "./index";
let revision = 0;
/** The locale is a display preference; changing it never remounts page/form state. */
export async function setLanguage(language: AppLanguage) {
  revision++;
  await i18n.changeLanguage(language);
  if (Platform.OS === "web" && typeof document !== "undefined")
    document.documentElement.lang = language;
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    /* The current selection still works when storage is unavailable. */
  }
}
export function LanguageProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    let active = true;
    const initialRevision = revision;
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then(async (saved) => {
        if (
          active &&
          revision === initialRevision &&
          (saved === "ja" || saved === "en")
        )
          await i18n.changeLanguage(saved);
      })
      .catch(() => {});
    const updateDocument = () => {
      if (Platform.OS === "web" && typeof document !== "undefined")
        document.documentElement.lang = i18n.language;
    };
    updateDocument();
    i18n.on("languageChanged", updateDocument);
    return () => {
      active = false;
      i18n.off("languageChanged", updateDocument);
    };
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
