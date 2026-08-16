import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { SEARCH_COLORS as C, SEARCH_SHADOW } from "./theme";
import type { SearchConditions, SearchFilterConfig } from "./types";

export default function SearchFilterPanel({ config, onSearch }: { config: SearchFilterConfig; onSearch: (conditions: SearchConditions) => void }) {
  const { width } = useWindowDimensions();
  const [keyword, setKeyword] = useState(""); const [location, setLocation] = useState(""); const [selected, setSelected] = useState<string[]>([]); const [salaryMin, setSalaryMin] = useState(""); const [salaryMax, setSalaryMax] = useState("");
  const toggle = (value: string) => setSelected(current => current.includes(value) ? current.filter(x => x !== value) : [...current, value]);
  const reset = () => { setKeyword(""); setLocation(""); setSelected([]); setSalaryMin(""); setSalaryMax(""); };
  const conditions = { keyword, location, selectedValues: selected, salaryMin, salaryMax };
  return <View style={[s.panel, width < 900 && s.panelMobile]}>
    <View style={s.heading}><Text style={s.title}>絞り込み条件</Text><Pressable onPress={reset}><Text style={s.reset}>条件をリセット</Text></Pressable></View>
    <Input label={config.keywordLabel} placeholder={config.keywordPlaceholder} value={keyword} onChangeText={setKeyword} icon="search-outline" />
    <Input label={config.locationLabel} placeholder={config.locationPlaceholder} value={location} onChangeText={setLocation} icon="location-outline" />
    <OptionGroup label={config.firstGroupLabel} options={config.firstGroupOptions} selected={selected} onToggle={toggle} />
    <OptionGroup label={config.secondGroupLabel} options={config.secondGroupOptions} selected={selected} onToggle={toggle} />
    {config.showSalary && <View><Text style={s.label}>想定年収</Text><View style={s.range}><TextInput value={salaryMin} onChangeText={setSalaryMin} keyboardType="numeric" placeholder="下限なし" placeholderTextColor={C.textMuted} style={s.input} /><Text style={s.rangeMark}>〜</Text><TextInput value={salaryMax} onChangeText={setSalaryMax} keyboardType="numeric" placeholder="上限なし" placeholderTextColor={C.textMuted} style={s.input} /></View></View>}
    <Pressable onPress={() => onSearch(conditions)} style={({ pressed }) => [s.primary, pressed && s.pressed]}><Text style={s.primaryText}>この条件で検索</Text></Pressable>
    <Pressable onPress={() => Alert.alert("検索条件を保存", "現在の検索条件を保存しました。") } style={({ pressed }) => [s.outline, pressed && s.pressed]}><Ionicons name="bookmark-outline" size={17} color={C.primary} /><Text style={s.outlineText}>検索条件を保存</Text></Pressable>
  </View>;
}

function Input({ label, icon, ...props }: { label: string; icon: keyof typeof Ionicons.glyphMap; placeholder: string; value: string; onChangeText: (value: string) => void }) { return <View><Text style={s.label}>{label}</Text><View style={s.inputWrap}><Ionicons name={icon} size={18} color={C.textMuted} /><TextInput {...props} placeholderTextColor={C.textMuted} style={s.inputText} /></View></View>; }
function OptionGroup({ label, options, selected, onToggle }: { label: string; options: SearchFilterConfig["firstGroupOptions"]; selected: string[]; onToggle: (value: string) => void }) { return <View><Text style={s.label}>{label}</Text><View style={s.options}>{options.map(option => { const checked = selected.includes(option.value); return <Pressable key={option.value} onPress={() => onToggle(option.value)} style={s.option}><View style={[s.checkbox, checked && s.checkboxActive]}>{checked && <Ionicons name="checkmark" size={13} color={C.white} />}</View><Text style={[s.optionText, checked && s.optionTextActive]}>{option.label}</Text></Pressable>; })}</View></View>; }
const s = StyleSheet.create({ panel:{width:285,borderRadius:13,borderWidth:1,borderColor:C.border,backgroundColor:C.white,padding:17,gap:17,...SEARCH_SHADOW},panelMobile:{width:"100%"},heading:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},title:{color:C.text,fontSize:15,fontWeight:"900"},reset:{color:C.primary,fontSize:10.5,fontWeight:"800"},label:{color:C.text,fontSize:11.5,fontWeight:"800",marginBottom:7},inputWrap:{minHeight:43,borderRadius:8,borderWidth:1,borderColor:C.border,flexDirection:"row",alignItems:"center",gap:7,paddingHorizontal:11},inputText:{flex:1,color:C.text,fontSize:12},options:{gap:9},option:{flexDirection:"row",alignItems:"center",gap:8},checkbox:{width:18,height:18,borderRadius:4,borderWidth:1,borderColor:C.border,alignItems:"center",justifyContent:"center"},checkboxActive:{backgroundColor:C.primary,borderColor:C.primary},optionText:{color:C.textSub,fontSize:11.5},optionTextActive:{color:C.primaryDark,fontWeight:"800"},range:{flexDirection:"row",alignItems:"center",gap:7},input:{flex:1,minWidth:0,minHeight:41,borderRadius:8,borderWidth:1,borderColor:C.border,paddingHorizontal:10,color:C.text,fontSize:11},rangeMark:{color:C.textSub},primary:{minHeight:44,borderRadius:8,backgroundColor:C.primary,alignItems:"center",justifyContent:"center"},primaryText:{color:C.white,fontSize:12,fontWeight:"900"},outline:{minHeight:44,borderRadius:8,borderWidth:1,borderColor:C.primary,flexDirection:"row",alignItems:"center",justifyContent:"center",gap:7},outlineText:{color:C.primary,fontSize:12,fontWeight:"800"},pressed:{opacity:.7} });
