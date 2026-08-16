import { COLORS } from "@/theme/GlobalWorkersStyles";
import { Ionicons } from "@expo/vector-icons";

export type IconProps = {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: keyof typeof COLORS;
  size?: number;
};
