import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppPage from "@/components/layout/AppPage";
import { AppButton, FormField, Panel, SectionTitle } from "@/components/ui/AppUI";
import { SEARCH_COLORS as C } from "@/components/search/theme";

export default function CompanyReviewPage(){const[rating,setRating]=useState(4);return <AppPage title="企業評価を作成" subtitle="実際の応募・雇用経験をもとに評価します" role="user"><View style={s.page}><Panel><SectionTitle>評価する企業</SectionTitle><Text style={s.company}>TechVision株式会社</Text><Text style={s.sub}>応募：バックエンドエンジニア／雇用期間 2025年4月〜2026年7月</Text></Panel><Panel><SectionTitle>総合評価</SectionTitle><View style={s.stars}>{[1,2,3,4,5].map(x=><Pressable key={x} onPress={()=>setRating(x)}><Ionicons name={x<=rating?"star":"star-outline"} size={38} color={C.warning}/></Pressable>)}</View>{["仕事内容の正確さ","職場環境","コミュニケーション","待遇・福利厚生"].map(x=><View key={x} style={s.row}><Text style={s.label}>{x}</Text><Text style={s.rowStars}>★★★★☆</Text></View>)}<FormField label="評価コメント" placeholder="実際に働いた感想を入力してください" large/><AppButton label="評価を投稿する" onPress={()=>Alert.alert("投稿完了",`${rating}点の評価を投稿しました。`)}/></Panel></View></AppPage>}
const s=StyleSheet.create({page:{width:"100%",maxWidth:900,alignSelf:"center",gap:13},company:{color:C.text,fontSize:19,fontWeight:"900"},sub:{color:C.textSub,fontSize:11.5},stars:{flexDirection:"row",justifyContent:"center",gap:10,paddingVertical:14},row:{minHeight:43,flexDirection:"row",alignItems:"center",justifyContent:"space-between",borderBottomWidth:1,borderBottomColor:C.border},label:{color:C.textSub,fontSize:12},rowStars:{color:C.warning,letterSpacing:2}});
