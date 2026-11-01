import { AppTag } from './form';
export function Chip({label,selected=false,onPress}:{label:string;selected?:boolean;onPress?:()=>void}) {
  return <AppTag label={label} selected={selected} onPress={onPress}/>;
}
