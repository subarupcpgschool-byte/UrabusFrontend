import { useLocaleVersion } from "@/i18n/display";
import type { IconButtonTooltipProps } from "./AppIconButton";

export function IconButtonTooltip(_props: IconButtonTooltipProps) {
  "use no memo";
  useLocaleVersion();
  return null;
}
