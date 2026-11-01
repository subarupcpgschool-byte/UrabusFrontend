import { Switch, type SwitchProps } from 'react-native';
import { INPUT_THEME as T } from '@/theme/inputTheme';

export function AppSwitch(props: SwitchProps) {
  return <Switch trackColor={{ false: T.borderColor, true: T.selectedBackground }} thumbColor={props.value ? T.primaryColor : T.placeholderColor} {...props}/>;
}
