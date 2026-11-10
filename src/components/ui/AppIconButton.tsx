import { useId, useRef, useState, type RefObject } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconButtonTooltip } from './IconButtonTooltip';

export type IconButtonTooltipProps = {
  anchor: RefObject<View | null>;
  id: string;
  text: string;
  visible: boolean;
};

type AppIconButtonProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  tooltip?: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'primary' | 'danger';
};

export function AppIconButton({
  icon, label, tooltip = label, onPress, disabled = false, tone = 'primary',
}: AppIconButtonProps) {
  const anchor = useRef<View>(null);
  const tooltipId = useId();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const color = tone === 'danger' ? '#B42318' : '#1857B4';

  const showTooltip = hovered || (focused && !disabled);
  return <View ref={anchor} collapsable={false}
    onPointerEnter={event => { if (event.nativeEvent.pointerType !== 'touch') setHovered(true); }}
    onPointerLeave={() => setHovered(false)}>
    <Pressable accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ disabled }} disabled={disabled}
      aria-describedby={showTooltip ? tooltipId : undefined}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { borderColor: color },
        hovered && !disabled && (tone === 'danger' ? styles.dangerHover : styles.primaryHover),
        focused && !disabled && styles.focus,
        (disabled || pressed) && styles.dim,
      ]}>
      <Ionicons name={icon} size={21} color={color} />
    </Pressable>
    <IconButtonTooltip anchor={anchor} id={tooltipId} text={tooltip} visible={showTooltip} />
  </View>;
}

const styles = StyleSheet.create({
  button: {
    width: 44, height: 44, borderWidth: 1, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF',
  },
  primaryHover: { backgroundColor: '#EFF6FF' },
  dangerHover: { backgroundColor: '#FEF3F2' },
  focus: { borderWidth: 2 },
  dim: { opacity: 0.48 },
});
