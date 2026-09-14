(()=>{'use strict';
const $=id=>document.getElementById(id),qsa=s=>[...document.querySelectorAll(s)];
const PAGES={overview:'index.html',markets:'markets.html',intelligence:'intelligence.html',performance:'performance.html',calendar:'risk-calendar.html',education:'education.html',notifications:'notifications.html',profile:'profile.html'};
const toast=text=>{const t=$('toast');if(!t)return;t.querySelector('span')&&(t.querySelector('span').textContent=text);t.classList.add('show');clearTimeout(window.__econovaToast);window.__econovaToast=setTimeout(()=>t.classList.remove('show'),2400)};
function route(key,hash=''){window.location.href=(PAGES[key]||key)+hash}
function bind(id,fn){const el=$(id);if(el)el.onclick=fn}
bind('profileOpen',()=>route('profile'));bind('sideProfile',()=>route('profile'));bind('drawerProfile',()=>route('profile'));bind('notificationsOpen',()=>route('notifications'));bind('focusRisk',()=>route('calendar'));
qsa('[data-action="journal"]').forEach(b=>b.onclick=()=>route('performance','#journal'));qsa('[data-action="strategy"]').forEach(b=>b.onclick=()=>route('intelligence'));qsa('[data-action="risk"]').forEach(b=>b.onclick=()=>route('calendar'));
qsa('#commandItems button').forEach(b=>b.onclick=()=>{const k=(b.dataset.target||'').replace('#','');route(k||'overview')});
qsa('.side-link,.drawer a').forEach(a=>{const h=a.getAttribute('href')||'';if(Object.values(PAGES).includes(h))a.onclick=e=>{e.preventDefault();window.location.href=h}});
async function signOut(){try{const sb=window.supabase;if(sb?.createClient){const c=sb.createClient('https://feoyjasuvrqxzhskqzye.supabase.co','sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0');await c.auth.signOut()}}finally{location.replace('../auth.html')}}
bind('sideLogout',signOut);bind('drawerLogout',signOut);
function refresh(){toast(document.documentElement.lang==='ar'?'جارٍ تحديث بيانات السوق…':'Refreshing market data…');window.dispatchEvent(new Event('econova:refresh'));if(typeof window.refreshEconovaQuotes==='function')window.refreshEconovaQuotes();else if(typeof window.loadMarketData==='function')window.loadMarketData()}
bind('refreshData',refresh);
const drawer=$('drawer'),backdrop=$('drawerBackdrop');function close(){drawer?.classList.remove('open');backdrop?.classList.remove('open');drawer?.setAttribute('aria-hidden','true')}function open(){drawer?.classList.add('open');backdrop?.classList.add('open');drawer?.setAttribute('aria-hidden','false')}bind('mobileTools',open);bind('drawerClose',close);bind('drawerBackdrop',close);
window.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
const palette=$('commandPalette'),input=$('commandInput');function openPalette(){palette?.classList.add('open');palette?.setAttribute('aria-hidden','false');input?.focus()}function closePalette(){palette?.classList.remove('open');palette?.setAttribute('aria-hidden','true')}input?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();qsa('#commandItems button').forEach(b=>b.hidden=!b.textContent.toLowerCase().includes(q))});window.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette()}if(e.key==='Escape')closePalette()});palette?.addEventListener('click',e=>{if(e.target===palette)closePalette()});
const sessionChip=$('sessionChip');function paintSession(){if(sessionChip)sessionChip.textContent=`SESSION · ${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`}paintSession();setInterval(paintSession,30000);
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
