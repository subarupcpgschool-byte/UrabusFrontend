import type { SearchArea } from './types';
// UMD runs inside the map document, outside Metro's module graph.
export function mapHtml(area: SearchArea) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css"><style>html,body,#map{height:100%;margin:0}#status{position:absolute;top:8px;left:8px;background:white;padding:6px;font:12px sans-serif;z-index:2}</style></head><body><div id="map"></div><div id="status">地図を読み込み中…</div><script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script><script>
const initial=${JSON.stringify(area)};let area=initial;const status=document.getElementById('status');
function send(data){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify(data));else window.parent.postMessage(data,'*');}
try {
const map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/liberty',center:[area.longitude,area.latitude],zoom:12});map.addControl(new maplibregl.NavigationControl());
const marker=new maplibregl.Marker({color:'#159A69'}).setLngLat([area.longitude,area.latitude]).addTo(map);
function polygon(){const coords=[];const lat=area.latitude*Math.PI/180,lon=area.longitude*Math.PI/180,d=area.radiusKm/6371;for(let i=0;i<=96;i++){const b=i/96*2*Math.PI;const a=Math.asin(Math.sin(lat)*Math.cos(d)+Math.cos(lat)*Math.sin(d)*Math.cos(b));const o=lon+Math.atan2(Math.sin(b)*Math.sin(d)*Math.cos(lat),Math.cos(d)-Math.sin(lat)*Math.sin(a));coords.push([o*180/Math.PI,a*180/Math.PI]);}return {type:'Feature',properties:{},geometry:{type:'Polygon',coordinates:[coords]}};}
function draw(){marker.setLngLat([area.longitude,area.latitude]);if(map.getSource('radius'))map.getSource('radius').setData(polygon());}
map.on('load',()=>{status.style.display='none';map.addSource('radius',{type:'geojson',data:polygon()});map.addLayer({id:'radius-fill',type:'fill',source:'radius',paint:{'fill-color':'#159A69','fill-opacity':.14}});map.addLayer({id:'radius-line',type:'line',source:'radius',paint:{'line-color':'#159A69','line-width':2}});send({type:'ready'});});
map.on('click',e=>{area={...area,latitude:e.lngLat.lat,longitude:e.lngLat.lng};draw();send({type:'center',latitude:area.latitude,longitude:area.longitude});});
map.on('error',()=>{status.style.display='block';status.textContent='地図を読み込めません。通信状態を確認してください。';});
window.updateSearchArea=function(next){area=next;draw();const zoom=area.radiusKm===0?16:Math.max(2,Math.min(16,Math.log2(40075016*Math.cos(area.latitude*Math.PI/180)*Math.max(200,map.getContainer().clientWidth)/(512*area.radiusKm*2400))));map.easeTo({center:[area.longitude,area.latitude],zoom:zoom});};
window.addEventListener('message',e=>{if(e.source!==window.parent)return;if(e.data&&e.data.type==='update')window.updateSearchArea(e.data.area);});
}catch(e){status.textContent='地図を読み込めません。通信状態を確認してください。';}
</script></body></html>`;
}
