import { useEffect, useRef } from 'react';
import { mapHtml } from './mapHtml';
import type { GeoMapProps } from './types';
export default function GeoMap({ area, onCenter }: GeoMapProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  const html = useRef(mapHtml(area));
  const latest = useRef({area,onCenter}); latest.current={area,onCenter};
  const update=()=>ref.current?.contentWindow?.postMessage({type:'update',area:latest.current.area},'*');
  useEffect(()=>{const receive=(e:MessageEvent)=>{if(e.source!==ref.current?.contentWindow)return;
    if(e.data?.type==='ready')update();
    if(e.data?.type==='center'&&Number.isFinite(e.data.latitude)&&Number.isFinite(e.data.longitude))latest.current.onCenter(e.data.latitude,e.data.longitude);
  };window.addEventListener('message',receive);return()=>window.removeEventListener('message',receive);},[]);
  useEffect(update,[area.latitude,area.longitude,area.radiusKm]);
  return <iframe ref={ref} title="検索範囲の地図" srcDoc={html.current} sandbox="allow-scripts" style={{width:'100%',height:280,border:0,borderRadius:8}} />;
}
