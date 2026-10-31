import { forwardRef, useState } from 'react';
import { Platform, TextInput, type TextInputProps } from 'react-native';
import { INPUT_THEME } from '@/theme/inputTheme';

/** 通常・パスワード・数値・複数行入力の共通コンポーネント。 */
export const AppTextInput = forwardRef<TextInput, TextInputProps>(function AppTextInput(
  { style, onFocus, onBlur, placeholderTextColor, editable, ...props }, ref,
) {
  const [focused, setFocused] = useState(false);
  return <TextInput
    {...props}
    ref={ref}
    editable={editable}
    placeholderTextColor={placeholderTextColor ?? INPUT_THEME.placeholderColor}
    underlineColorAndroid="transparent"
    onFocus={event => { setFocused(true); onFocus?.(event); }}
    onBlur={event => { setFocused(false); onBlur?.(event); }}
    style={[
      style,
      { color: INPUT_THEME.textColor, fontSize: INPUT_THEME.fontSize, borderColor: INPUT_THEME.borderColor },
            editable === false && { opacity: INPUT_THEME.disabledOpacity },
      focused && INPUT_THEME.focusStyle,
      Platform.OS === 'web' && { outlineWidth: 0 },
    ]}
  />;
});
