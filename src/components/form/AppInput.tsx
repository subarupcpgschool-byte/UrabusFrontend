import { forwardRef, useId, useState } from 'react';
import { Platform, StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { INPUT_THEME as T } from '@/theme/inputTheme';
import { AppFormField, type FieldProps } from './AppFormField';

export type AppInputProps = TextInputProps & FieldProps & { variant?: 'outlined' | 'plain'; disabled?: boolean };

export const AppInput = forwardRef<TextInput, AppInputProps>(function AppInput({
  label, required, hint, error, containerStyle, variant = 'outlined', disabled = false,
  style, onFocus, onBlur, placeholderTextColor, editable, accessibilityLabel, ...props
}, ref) {
  const [focused, setFocused] = useState(false);
  const id = useId();
  const inactive = disabled || editable === false;
  const control = <TextInput {...props} ref={ref} editable={!inactive}
    accessibilityLabel={accessibilityLabel ?? label ?? props.placeholder}
    aria-labelledby={label ? `${id}-label` : undefined}
    aria-describedby={error || hint ? `${id}-message` : undefined}
    aria-invalid={!!error} aria-required={required}
    placeholderTextColor={placeholderTextColor ?? T.placeholderColor}
    underlineColorAndroid="transparent"
    onFocus={event => { setFocused(true); onFocus?.(event); }}
    onBlur={event => { setFocused(false); onBlur?.(event); }}
    style={[styles.base, variant === 'outlined' ? styles.outlined : styles.plain, style,
      // Theme colors are authoritative so one edit applies to legacy screens too.
      { color: T.textColor, borderColor: T.borderColor }, focused && T.focusStyle,
      !!error && { borderColor: T.errorColor }, inactive && { opacity: T.disabledOpacity },
      Platform.OS === 'web' && { outlineWidth: 0 }]} />;
  return label || hint || error || containerStyle
    ? <AppFormField {...{ label, required, hint, error, containerStyle }} labelId={`${id}-label`} messageId={`${id}-message`}>{control}</AppFormField>
    : control;
});

export const AppTextArea = forwardRef<TextInput, AppInputProps>(function AppTextArea({ style, ...props }, ref) {
  return <AppInput {...props} ref={ref} multiline style={[styles.textarea, style]} />;
});

const styles = StyleSheet.create({
  base: { fontSize: T.fontSize, minWidth: 0 },
  outlined: { minHeight: T.minHeight, borderWidth: 1, borderRadius: T.borderRadius, backgroundColor: T.backgroundColor, paddingHorizontal: T.paddingHorizontal, paddingVertical: T.paddingVertical },
  plain: { borderWidth: 0, padding: 0, backgroundColor: 'transparent' },
  textarea: { minHeight: 105, textAlignVertical: 'top' },
});
