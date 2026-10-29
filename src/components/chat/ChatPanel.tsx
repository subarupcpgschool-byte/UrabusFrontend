import { useLocalSearchParams, usePathname } from 'expo-router';
import MessageWorkspace from '@/features/workspace/MessageWorkspace';
export default function ChatPanel({partner,roomLabel}:{partner:string;roomLabel:string;firstMessage:string}) {
 const {id}=useLocalSearchParams<{id:string}>();const path=usePathname();
 return <MessageWorkspace initialRoom={{kind:path.includes('/company/')?'company':'job',id:`${path.includes('/scout/')?'scout:':''}${id||partner}`,company:partner,title:roomLabel}}/>;
}
