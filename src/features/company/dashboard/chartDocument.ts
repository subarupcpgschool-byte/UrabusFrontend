import { CHART_JS_SOURCE } from "./chartJsBundle";

export type ChartPayload = {
  kind?: "doughnut";
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
  axisX: string;
  axisY: string;
  title: string;
  totalLabel: string;
  locale: string;
};
export function chartDocument(payload: ChartPayload) {
  const value = JSON.stringify(payload).replace(/</g, "\\u003c");
  const library = CHART_JS_SOURCE.replace(/<\/script/gi, "<\\/script");
  return `<!doctype html><html lang="${payload.locale.startsWith("ja") ? "ja" : "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><style>
html,body{margin:0;padding:0;height:100%;width:100%;overflow:hidden;background:#fff;font-family:Arial,'Noto Sans JP',sans-serif}#plot{position:relative;height:100%;width:100%}canvas{outline:none}canvas:focus-visible{outline:2px solid #2563eb;outline-offset:-2px;border-radius:6px}
</style></head><body><div id="plot"><canvas id="chart" tabindex="0" role="img"></canvas></div><script>${library}</script><script>
(function(){
const p=${value};const canvas=document.getElementById('chart');canvas.setAttribute('aria-label',p.title);
function send(type,index){const message=JSON.stringify({source:'globalworkers-chart',type,index});if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(message);else window.parent.postMessage(message,'*');}
try{
let last=-1;
function pick(index){if(Number.isInteger(index)&&index>=0&&index<p.labels.length&&index!==last){last=index;send('point',index);}}
const config={type:'line',data:{labels:p.labels,datasets:p.datasets.map(s=>({...s,backgroundColor:s.backgroundColor+'12',borderWidth:2,pointRadius:3,pointHoverRadius:5,pointHitRadius:12,tension:0.3,fill:true}))},options:{responsive:true,maintainAspectRatio:false,animation:false,locale:p.locale,interaction:{mode:'index',axis:'x',intersect:false},layout:{padding:{top:8,right:12,bottom:0,left:0}},plugins:{legend:{display:false},tooltip:{enabled:true,backgroundColor:'#173650',padding:12,callbacks:{footer:items=>p.totalLabel.replace('{{count}}',String(items.reduce((n,item)=>n+Number(item.raw||0),0)))}}},scales:{x:{type:'category',grid:{display:false},border:{color:'#CBD5E1'},ticks:{color:'#52647C',maxRotation:0,maxTicksLimit:8,autoSkip:true,callback:function(value){const label=this.getLabelForValue(value);return label.slice(5).replace('-','/');}},title:{display:true,text:p.axisX,color:'#52647C',font:{size:12},padding:8}},y:{type:'linear',beginAtZero:true,suggestedMax:5,border:{display:true,color:'#CBD5E1'},ticks:{precision:0,maxTicksLimit:6,color:'#52647C'},grid:{color:'#E2E8F0'},title:{display:true,text:p.axisY,color:'#52647C',font:{size:12}}}},onHover:(_event,elements)=>{if(elements.length)pick(elements[0].index)},onClick:(_event,elements)=>{if(elements.length)pick(elements[0].index)}}};
if(p.kind==='doughnut'){
const empty=p.datasets[0].data.every(v=>v===0);
config.type='doughnut';
config.data={labels:empty?[]:p.labels,datasets:[{data:empty?[1]:p.datasets[0].data,backgroundColor:empty?['#E2E8F0']:['#0D9488','#E85D75'],borderWidth:0,hoverOffset:3}]};
config.options={responsive:true,maintainAspectRatio:false,animation:false,cutout:'80%',layout:{padding:10},plugins:{legend:{display:false},tooltip:{enabled:!empty}},events:empty?[]:['mousemove','mouseout','click','touchstart','touchmove']};
}
const chart=new Chart(canvas,config);
if(p.kind!=='doughnut')canvas.addEventListener('focus',()=>{if(last<0){pick(0);highlight()}});
function highlight(){const elements=p.datasets.map((_,datasetIndex)=>({datasetIndex,index:Math.max(0,last)}));chart.setActiveElements(elements);chart.tooltip.setActiveElements(elements,{x:chart.scales.x.getPixelForValue(last),y:chart.chartArea.bottom});chart.update('none');}
if(p.kind!=='doughnut')canvas.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End','Enter',' '].includes(event.key))return;event.preventDefault();let next=last<0?0:last;if(event.key==='ArrowLeft')next=Math.max(0,next-1);if(event.key==='ArrowRight')next=Math.min(p.labels.length-1,next+1);if(event.key==='Home')next=0;if(event.key==='End')next=p.labels.length-1;pick(next);highlight();});
send('ready',Chart.version);
}catch(error){send('error',-1);}
})();
</script></body></html>`;
}
