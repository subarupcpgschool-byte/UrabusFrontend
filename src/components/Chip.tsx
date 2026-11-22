import { useLocaleVersion } from "@/i18n/display";
import { AppTag } from "./form";
export function Chip({
  label,
  selected = false,
  onPress,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  "use no memo";
  useLocaleVersion();
  return <AppTag label={label} selected={selected} onPress={onPress} />;
}
