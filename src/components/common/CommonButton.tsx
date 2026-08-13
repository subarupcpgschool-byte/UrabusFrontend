import { IconProps } from "@/constants/props";
import { COLORS } from "@/theme/GlobalWorkersStyles";
import { baseStyle, layoutFixStyle, textStyle } from "@/theme/responsiveStyle";
import { capitalize } from "@/utils/stringUtils";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "expo-router/build/react-navigation";
import { GestureResponderEvent, Pressable } from "react-native";

export type ButtonProps = {
  message: MessageProps;
  btn?: BtnProps;
  icon?: IconProps;
  clickAction?: (event: GestureResponderEvent) => void;
  addStyles?: { s: string[]; lx: string[] };
  width: number;
};
export type BtnProps = {
  color?: string;
  border?: string;
};
export type MessageProps = {
  text: string;
  color?: string;
};
export default function CommonButton({
  btn,
  message,
  clickAction,
  icon,
  addStyles,
  width,
}: ButtonProps) {
  const s = (...names: string[]) => baseStyle(names, width) as never;
  const text = (...names: string[]) => textStyle(names, width);
  const lx = (classes: readonly string[]) => layoutFixStyle(classes, width);
  return (
    <Pressable
      onPress={clickAction}
      style={({ pressed }) => [
        [
          s(
            "btn",
            "btn" + capitalize(btn?.color ?? "ghost"),
            ...(addStyles?.s ?? []),
          ),
          lx([
            "btn",
            "btn-" + (btn?.color ?? "ghost").toLocaleLowerCase(),
            ...(addStyles?.lx ?? []),
          ]),
        ],
        pressed && { opacity: 0.72 },
      ]}
    >
      {icon && (
        <Ionicons
          name={icon.name}
          size={icon.size ?? 16}
          color={COLORS[icon.color]}
        />
      )}
      <Text style={text("btn", "btn" + capitalize(message.color ?? "ghost"))}>
        {message.text}
      </Text>
    </Pressable>
  );
}
