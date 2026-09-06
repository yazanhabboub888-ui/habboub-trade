/* ECONOVA — premium public hero + live-condition visual */
(function(){
  'use strict';
  if(window.__ECONOVA_HERO__) return;
  window.__ECONOVA_HERO__=true;

  const copy={
    en:{kicker:'ECONOVA MARKET CONDITION',title1:'Read the market.',title2:'Before you trade.',lead:'ECONOVA turns live price action, market structure, economic news, institutional positioning and AI analysis into one clear Market Condition score — so you can see when the environment is stronger, when risk is rising, and make the final decision yourself.',primary:'Create your account',secondary:'See how it works',proof:['0–100 Market Condition','Live market intelligence','AI + News + Positioning'],eyebrow:'LIVE MARKET CONDITION',label:'Market Condition',state:'Environment in focus',note:'Price, structure, macro, positioning and AI intelligence combined.',assets:['XAUUSD','NAS100','S&P 500'],condition:'CONDITION SCORE',live:'LIVE'},
    ar:{kicker:'ECONOVA — حالة السوق',title1:'اقرأ حالة السوق.',title2:'قبل ما تتخذ قرارك.',lead:'ECONOVA تحوّل حركة السعر اللحظية، هيكل السوق، الأخبار الاقتصادية، تمركز المؤسسات والتحليل المدعوم بالذكاء الاصطناعي إلى حالة سوق واضحة من 0 إلى 100 — لتشوف قوة البيئة ومتى يرتفع مستوى المخاطرة، والقرار النهائي يبقى إلك.',primary:'أنشئ حسابك',secondary:'شاهد كيف يعمل',proof:['حالة السوق من 0–100','استخبارات سوقية لحظية','AI + أخبار + تمركز المؤسسات'],eyebrow:'حالة السوق الآن',label:'حالة السوق',state:'البيئة قيد التحليل',note:'السعر، الهيكل، الماكرو، التموضع والذكاء الاصطناعي في صورة واحدة.',assets:['XAUUSD','NAS100','S&P 500'],condition:'مؤشر الحالة',live:'مباشر'}
  };

  function lang(){return localStorage.getItem('habboub_language')==='ar'?'ar':'en'}
  function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  function render(){
    const hero=document.querySelector('#econova-public-site .v-hero');
    if(!hero) return false;
    const c=copy[lang()];
    hero.className='v-wrap v-hero econova-premium-hero';
    hero.setAttribute('dir',lang()==='ar'?'rtl':'ltr');
    hero.innerHTML=`
      <div class="econova-hero-copy">
        <span class="v-kicker econova-hero-kicker"><i></i>${esc(c.kicker)}</span>
        <h1>${esc(c.title1)}<br><span class="v-gradient">${esc(c.title2)}</span></h1>
        <p class="v-lead">${esc(c.lead)}</p>
        <div class="v-hero-actions">
          <a class="v-primary" href="auth.html">${esc(c.primary)}</a>
          <a class="v-secondary" href="#how-it-works">${esc(c.secondary)}</a>
        </div>
        <div class="v-proof">${c.proof.map(x=>`<span><b>✓</b>${esc(x)}</span>`).join('')}</div>
      </div>
      <div class="econova-condition-stage" aria-label="${esc(c.label)}">
        <div class="econova-condition-card">
          <div class="econova-condition-head"><span>${esc(c.eyebrow)}</span><span class="econova-live-dot"><i></i>${esc(c.live)}</span></div>
          <div class="econova-condition-body">
            <div class="econova-condition-ring" style="--condition:76">
              <div class="econova-ring-inner"><strong>76</strong><span>/100</span></div>
            </div>
            <div class="econova-condition-copy"><span>${esc(c.condition)}</span><h3>${esc(c.label)}</h3><strong>${esc(c.state)}</strong><p>${esc(c.note)}</p></div>
          </div>
          <div class="econova-condition-chart" aria-hidden="true"><span style="--h:24%"></span><span style="--h:31%"></span><span style="--h:27%"></span><span style="--h:43%"></span><span style="--h:39%"></span><span style="--h:54%"></span><span style="--h:49%"></span><span style="--h:68%"></span><span style="--h:61%"></span><span style="--h:78%"></span><span style="--h:72%"></span><span style="--h:86%"></span></div>
          <div class="econova-condition-assets">${c.assets.map((x,i)=>`<span><b>${esc(x)}</b><i>${i===0?'76':i===1?'71':'68'}</i></span>`).join('')}</div>
          <div class="econova-scan-line"></div>
        </div>
      </div>`;
    return true;
  }

  function init(){if(render()){const observer=new MutationObserver(()=>{const hero=document.querySelector('#econova-public-site .v-hero');if(hero&&!hero.classList.contains('econova-premium-hero'))render()});observer.observe(document.body,{childList:true,subtree:true});}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.EconovaHero={render};
})();
