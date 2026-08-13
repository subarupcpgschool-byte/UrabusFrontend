import { IconProps } from "@/constants/props";
import { COLORS } from "@/theme/GlobalWorkersStyles";
import { baseStyle, layoutFixStyle, textStyle } from "@/theme/responsiveStyle";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "expo-router/build/react-navigation";
import { View } from "react-native";

export type JobMetaProps = {
  width: number;
  message: string;
  icon?: IconProps;
};

export default function JobMeta({ width, message, icon }: JobMetaProps) {
  const s = (...names: string[]) => baseStyle(names, width) as never;
  const text = (...names: string[]) => textStyle(names, width);
  const lx = (classes: readonly string[]) => layoutFixStyle(classes, width);

  return (
    <View
      style={[
        s("jobMetaSpan"),
        { flexDirection: "row", alignItems: "center", gap: 6 },
      ]}
    >
      {icon && (
        <Ionicons
          name={icon.name}
          size={icon.size ?? 16}
          color={icon.color ?? COLORS.muted}
        />
      )}
      <Text style={text("jobMetaSpan")}>{message}</Text>
    </View>
  );
}
