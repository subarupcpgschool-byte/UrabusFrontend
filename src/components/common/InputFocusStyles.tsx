import { useLocaleVersion } from "@/i18n/display";
/** Web-only CSS is loaded by InputFocusStyles.web.tsx. */
export default function InputFocusStyles() {
  "use no memo";
  useLocaleVersion();
  return null;
}
