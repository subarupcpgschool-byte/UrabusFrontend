import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import AppPage from "@/components/layout/AppPage";
import { AppButton, FormField, Panel } from "@/components/ui/AppUI";
import { SEARCH_COLORS as C } from "@/components/search/theme";

export default function AuthPage(){const[register,setRegister]=useState(false);const[email,setEmail]=useState("");const[password,setPassword]=useState("");return <AppPage title={register?"ユーザー登録":"ログイン"} subtitle="GlobalWorkersを無料で始めましょう"><View style={s.wrap}><Panel style={s.card}><Text style={s.title}>{register?"無料ユーザー登録":"アカウントへログイン"}</Text>{register&&<FormField label="お名前" placeholder="山田 太郎"/>}<FormField label="メールアドレス" placeholder="example@globalworkers.jp" value={email} onChangeText={setEmail}/><FormField label="パスワード" placeholder="8文字以上" value={password} onChangeText={setPassword}/><AppButton label={register?"登録して始める":"ログイン"} onPress={()=>Alert.alert(register?"登録":"ログイン",email&&password?"入力内容を受け付けました。":"メールアドレスとパスワードを入力してください。")}/><Pressable onPress={()=>setRegister(v=>!v)}><Text style={s.switch}>{register?"ログイン画面へ戻る":"アカウントをお持ちでない方はこちら"}</Text></Pressable></Panel></View></AppPage>}
const s=StyleSheet.create({wrap:{minHeight:560,alignItems:"center",justifyContent:"center"},card:{width:"100%",maxWidth:450,padding:28},title:{textAlign:"center",color:C.text,fontSize:23,fontWeight:"900"},switch:{textAlign:"center",color:C.primary,fontSize:12,fontWeight:"800",padding:7}});
