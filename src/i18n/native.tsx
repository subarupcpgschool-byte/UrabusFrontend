import React, { forwardRef } from "react";
import {
  Text as NativeText,
  TextInput as NativeTextInput,
  Pressable as NativePressable,
  Alert as NativeAlert,
  type TextProps,
  type TextInputProps,
  type PressableProps,
  type View,
} from "react-native";
import { translateText, useLocaleVersion } from "./display";
function translatedChildren(children: React.ReactNode): React.ReactNode {
  const items = React.Children.toArray(children);
  if (items.every((c) => typeof c === "string" || typeof c === "number")) {
    const joined = items.join("");
    const translated = translateText(joined);
    if (translated !== joined) return translated;
    return items.map((c) => translateText(c)).join("");
  }
  return items.map((c) => (typeof c === "string" ? translateText(c) : c));
}
export const Text = forwardRef<NativeText, TextProps & { localize?: boolean }>(
  function LocalizedText({ children, localize = true, ...props }, ref) {
    "use no memo";
    useLocaleVersion();
    return (
      <NativeText
        {...props}
        ref={ref}
        accessibilityLabel={translateText(props.accessibilityLabel)}
        accessibilityHint={translateText(props.accessibilityHint)}
      >
        {localize ? translatedChildren(children) : children}
      </NativeText>
    );
  },
);
export const TextInput = forwardRef<NativeTextInput, TextInputProps>(
  function LocalizedInput(props, ref) {
    "use no memo";
    useLocaleVersion();
    return (
      <NativeTextInput
        {...props}
        ref={ref}
        placeholder={translateText(props.placeholder)}
        accessibilityLabel={translateText(props.accessibilityLabel)}
        accessibilityHint={translateText(props.accessibilityHint)}
      />
    );
  },
);
export const Pressable = forwardRef<View, PressableProps>(
  function LocalizedPressable(props, ref) {
    "use no memo";
    useLocaleVersion();
    return (
      <NativePressable
        {...props}
        ref={ref}
        accessibilityLabel={translateText(props.accessibilityLabel)}
        accessibilityHint={translateText(props.accessibilityHint)}
        accessibilityValue={
          props.accessibilityValue
            ? {
                ...props.accessibilityValue,
                text: translateText(props.accessibilityValue.text),
              }
            : undefined
        }
      />
    );
  },
);
export const Alert = {
  ...NativeAlert,
  alert: (
    title: string,
    message?: string,
    buttons?: import("react-native").AlertButton[],
    options?: import("react-native").AlertOptions,
  ) =>
    NativeAlert.alert(
      translateText(title),
      translateText(message),
      buttons?.map((b) => ({ ...b, text: translateText(b.text) })),
      options,
    ),
};

export type TextInput = NativeTextInput;
export type Text = NativeText;
