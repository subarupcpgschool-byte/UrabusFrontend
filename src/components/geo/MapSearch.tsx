import { useState } from 'react';
import { Pressable, Text, View, Platform, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';
import GeoMap from './GeoMap';
import type { SearchArea } from './types';
export const INITIAL_AREA: SearchArea={latitude:34.6937,longitude:135.5023,radiusKm:5};
export default function MapSearch({value,onChange}:{value?:SearchArea;onChange:(area:SearchArea|undefined)=>void}){
 const [draft,setDraft]=useState(INITIAL_AREA);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const area=value??draft;
 const change=(next:SearchArea)=>{setDraft(next);onChange(next);};
 const locate=async()=>{setBusy(true);setError('');try{
  if(Platform.OS==='web'){
   if(!navigator.geolocation)throw new Error('このブラウザは現在地取得に対応していません。');
   const p=await new Promise<GeolocationPosition>((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:15000,maximumAge:0}));
   change({...area,latitude:p.coords.latitude,longitude:p.coords.longitude});
  }else{const permission=await Location.requestForegroundPermissionsAsync();if(permission.status!=='granted')throw new Error('位置情報の利用を許可してください。');
   const p=await new Promise<Location.LocationObject>((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('timeout')),15000);Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced}).then(resolve,reject).finally(()=>clearTimeout(timer));});change({...area,latitude:p.coords.latitude,longitude:p.coords.longitude});}
 }catch{setError('現在地を取得できません。位置情報の許可・通信を確認するか、地図をタップしてください。');}finally{setBusy(false);}};
 return <View style={{gap:8}}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={{fontWeight:'700'}}>マップ検索</Text><Switch value={!!value} onValueChange={enabled=>onChange(enabled?draft:undefined)}/></View>
 {!!value&&<><Text>検索半径：{area.radiusKm.toFixed(1)} km</Text><Slider accessibilityLabel="検索半径 0から10キロメートル" minimumValue={0} maximumValue={10} step={0.1} value={area.radiusKm} onValueChange={radiusKm=>change({...area,radiusKm})} minimumTrackTintColor="#159A69"/>
 <Pressable disabled={busy} onPress={locate} style={{padding:10,borderRadius:8,backgroundColor:'#E8F5EE'}}><Text style={{color:'#13794E',textAlign:'center'}}>{busy?'現在地を取得中…':'現在地を使う'}</Text></Pressable>
 {!!error&&<Text accessibilityRole="alert" style={{color:'#B42318'}}>{error}</Text>}
 <GeoMap area={area} onCenter={(latitude,longitude)=>change({...area,latitude,longitude})}/>
 <Text style={{color:'#737B85',fontSize:11}}>地図をタップして検索中心を指定できます。0kmは中心と一致する地点のみです。</Text></>}
 </View>;
}
