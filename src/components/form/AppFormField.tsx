import { useId, type ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { INPUT_THEME as T } from '@/theme/inputTheme';

export type FieldProps = {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function AppFormField({ label, required, hint, error, containerStyle, children, labelId, messageId }: FieldProps & {
  children: ReactNode; labelId?: string; messageId?: string;
}) {
  const id = useId();
  return <View style={[styles.field, containerStyle]}>
    {!!label && <Text nativeID={labelId ?? `${id}-label`} style={styles.label}>{label}{required && <Text style={styles.required}> *</Text>}</Text>}
    {children}
    {!!(error || hint) && <Text nativeID={messageId ?? `${id}-message`} accessibilityRole={error ? 'alert' : undefined} style={[styles.hint, !!error && styles.required]}>{error || hint}</Text>}
  </View>;
}

const styles = StyleSheet.create({
  field: { gap: 6, minWidth: 0 },
  label: { color: T.textColor, fontSize: 13, fontWeight: '700' },
  required: { color: T.errorColor },
  hint: { color: '#64748B', fontSize: 12, lineHeight: 18 },
});
