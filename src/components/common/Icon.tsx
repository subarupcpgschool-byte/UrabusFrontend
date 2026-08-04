import { Ionicons } from "@expo/vector-icons";

import { COLORS } from "@/theme/GlobalWorkersStyles";

export type Props = {
  name: any;
};
export default function Icon({ name }: Props) {
  return <Ionicons name={{ name }} size={16} color={COLORS.muted} />;
}
