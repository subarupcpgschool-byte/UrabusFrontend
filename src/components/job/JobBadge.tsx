import { baseStyle, layoutFixStyle, textStyle } from "@/theme/responsiveStyle";
import { capitalize } from "@/utils/stringUtils";
import { Text, useWindowDimensions, View } from "react-native";

export type BadgeProps = {
  message: string;
  color: string;
};

export default function JobBadge({ message, color = "blue" }: BadgeProps) {
  const { width } = useWindowDimensions();
  const s = (...names: string[]) => baseStyle(names, width) as never;
  const text = (...names: string[]) => textStyle(names, width);
  const lx = (classes: readonly string[]) => layoutFixStyle(classes, width);
  return (
    <View
      style={[
        s("badge", "badge" + capitalize(color)),
        lx(["badge", "badge-" + color.toLowerCase()]),
      ]}
    >
      <Text style={text("badge", "badge" + capitalize(color))}>{message}</Text>
    </View>
  );
}
