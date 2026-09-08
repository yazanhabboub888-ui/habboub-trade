(()=>{'use strict';
const quoteMap={GOLD:'GC=F',NASDAQ:'NQ=F',SP500:'ES=F',DOLLAR:'DX-Y.NYB'};
const precision={GOLD:2,NASDAQ:2,SP500:2,DOLLAR:3};
const moneyFormat=(symbol,value)=>{if(!Number.isFinite(value))return '—';return value.toLocaleString('en-US',{minimumFractionDigits:precision[symbol]??2,maximumFractionDigits:precision[symbol]??2});};
const setText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
const stateLabel=state=>state==='REGULAR'||state==='OPEN'?'LIVE':state==='PRE'||state==='PREPRE'?'PRE-MARKET':state==='POST'||state==='POSTPOST'?'AFTER-HOURS':'MARKET CLOSED';
const stateClass=state=>state==='REGULAR'||state==='OPEN'?'live':'closed';
function applyQuote(symbol,item){
  if(!item)return;
  const price=Number(item.price), change=Number(item.change), pct=Number(item.changePct);
  const priceText=moneyFormat(symbol,price);
  if(symbol==='GOLD'){setText('assetPrice',priceText);setText('assetChange',Number.isFinite(pct)?`${change>=0?'+':''}${moneyFormat(symbol,change)} (${pct>=0?'+':''}${pct.toFixed(2)}%)`:'—');}
  const line=document.querySelector('.price-line span');if(line&&window.selectedSymbol===symbol)line.textContent=priceText;
  document.querySelectorAll('.asset[data-symbol="'+symbol+'"] [data-live-price]').forEach(el=>el.textContent=priceText);
  const liveEls=document.querySelectorAll('[data-market-state]');liveEls.forEach(el=>{if(el.dataset.marketState===symbol||el.dataset.marketState==='all'){el.textContent=stateLabel(item.marketState);el.classList.toggle('live',stateClass(item.marketState)==='live');el.classList.toggle('closed',stateClass(item.marketState)==='closed');}});
  const bannerState=document.querySelector('.banner-state');if(bannerState&&window.selectedSymbol===symbol){bannerState.innerHTML=`<i></i><span>${stateLabel(item.marketState)}</span>`;bannerState.classList.toggle('live',stateClass(item.marketState)==='live');bannerState.classList.toggle('closed',stateClass(item.marketState)==='closed');}
}
async function refreshQuotes(){
 try{const response=await fetch('/api/market-quotes',{cache:'no-store'});if(!response.ok)throw new Error('quote request failed');const json=await response.json();window.econovaQuotes=json.data||[];window.econovaQuotes.forEach(item=>{const symbol=Object.keys(quoteMap).find(key=>quoteMap[key]===item.symbol);if(symbol)applyQuote(symbol,item);});setText('marketDataStatus','LIVE DATA');}
 catch(error){setText('marketDataStatus','DATA UNAVAILABLE');}
}
window.refreshEconovaQuotes=refreshQuotes;window.quoteMap=quoteMap;
const originalUpdateAsset=window.updateAsset;
window.addEventListener('load',()=>{refreshQuotes();setInterval(refreshQuotes,10000);});
})();
