(()=>{'use strict';
const precision={GOLD:2,NASDAQ:2,SP500:2,DOLLAR:3};
const money=(key,value)=>Number.isFinite(Number(value))?Number(value).toLocaleString('en-US',{minimumFractionDigits:precision[key]??2,maximumFractionDigits:precision[key]??2}):'—';
const setText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
let requestInFlight=false;
async function refreshQuotes(){
 if(requestInFlight)return;
 requestInFlight=true;
 try{
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),4500);
  const response=await fetch('/api/market-quotes',{cache:'no-store',signal:controller.signal});clearTimeout(timer);
  if(!response.ok)throw new Error(`quote request ${response.status}`);
  const json=await response.json();window.econovaQuotes=Array.isArray(json.data)?json.data:[];
  window.econovaQuotes.forEach(item=>{
   const key=item.key;if(!key)return;
   const priceText=money(key,Number(item.price));
   document.querySelectorAll(`.asset[data-symbol="${key}"] [data-live-price]`).forEach(el=>el.textContent=priceText);
   if(key==='GOLD'){
    setText('assetPrice',priceText);
    const pct=Number(item.changePct),change=Number(item.change);
    setText('assetChange',Number.isFinite(pct)?`${change>=0?'+':''}${money(key,change)} (${pct>=0?'+':''}${pct.toFixed(2)}%)`:'—');
   }
  });
  setText('marketDataStatus','MARKET DATA · '+(json.updatedAt?new Date(json.updatedAt).toLocaleTimeString([], {hour12:false}):''));
 }catch(error){setText('marketDataStatus',error.name==='AbortError'?'DATA TIMEOUT':'DATA UNAVAILABLE');console.error('ECONOVA market data:',error)}finally{requestInFlight=false}
}
window.refreshEconovaQuotes=refreshQuotes;
window.addEventListener('load',()=>{refreshQuotes();setInterval(refreshQuotes,5000)});
})();
