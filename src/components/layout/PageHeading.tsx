import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions, type StyleProp, type ViewStyle } from 'react-native';

/** Shared style 03: a quiet translucent heading card with compact typography. */
export default function PageHeading({ title, subtitle, eyebrow, trailing, style }: {
  title: ReactNode; subtitle?: string; eyebrow?: string; trailing?: ReactNode; style?: StyleProp<ViewStyle>;
}) {
  const { width } = useWindowDimensions();
  const compact = width < 600;
  return <LinearGradient colors={['rgba(255,255,255,0.94)','rgba(227,242,255,0.82)','rgba(226,251,244,0.82)']} start={{x:0,y:0}} end={{x:1,y:1}}
    style={[s.card, compact && s.compact, Platform.OS === 'web' && ({backdropFilter:'blur(14px)',WebkitBackdropFilter:'blur(14px)'} as unknown as ViewStyle), style]}>
    <View style={s.row}><View style={s.copy}>
      {!!eyebrow && <Text style={s.eyebrow}>{eyebrow}</Text>}
      <Text accessibilityRole="header" style={[s.title,compact&&s.titleCompact]}>{title}</Text>
      {!!subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
    </View>{trailing&&<View style={s.trailing}>{trailing}</View>}</View>
  </LinearGradient>;
}
const s=StyleSheet.create({
  card:{width:'100%',minHeight:96,borderRadius:16,borderWidth:1,borderColor:'rgba(255,255,255,0.95)',paddingHorizontal:22,paddingVertical:20,backgroundColor:'#F0F8FC',shadowColor:'#6AA9DB',shadowOffset:{width:0,height:5},shadowOpacity:.09,shadowRadius:14,elevation:2},
  compact:{minHeight:88,paddingHorizontal:16,paddingVertical:16},row:{flexDirection:'row',alignItems:'center',flexWrap:'wrap',gap:12},copy:{flex:1,minWidth:160,gap:6},trailing:{flexShrink:0},title:{color:'#10284B',fontSize:22,lineHeight:30,fontWeight:'800'},titleCompact:{fontSize:20,lineHeight:28},subtitle:{fontSize:12,lineHeight:20,color:'#61708A'},eyebrow:{fontSize:11,lineHeight:17,color:'#2563EB',fontWeight:'700'},
});
