/* ECONOVA — premium public hero + live-condition visual */
(function(){
  'use strict';
  if(window.__ECONOVA_HERO__) return;
  window.__ECONOVA_HERO__=true;

  const copy={
    en:{kicker:'BUILT FOR DISCIPLINED TRADERS',title1:'Your strategy.',title2:'Context you can repeat.',lead:'A focused market-intelligence environment combining live conditions, structure, macro news, positioning and AI-assisted analysis in one workspace. ECONOVA informs your process — the trading decision stays yours.',primary:'Create your account',secondary:'See how it works',proof:['Live market context','Structured workflow','AI-assisted intelligence'],eyebrow:'LIVE MARKET CONDITION',label:'Market Condition',state:'Constructive context',note:'Structure, macro, positioning and intelligence combined.',assets:['XAUUSD','NAS100','S&P 500'],condition:'CONDITION',live:'LIVE'},
    ar:{kicker:'مصمّم للمتداول المنضبط',title1:'استراتيجيتك.',title2:'سياق يمكنك تكراره.',lead:'بيئة استخبارات سوقية مركّزة تجمع حالة السوق اللحظية، حركة السعر، الأخبار الاقتصادية، تمركز المؤسسات والتحليل المدعوم بالذكاء الاصطناعي في مساحة عمل واحدة. ECONOVA تدعم قرارك — والقرار النهائي يبقى إلك.',primary:'أنشئ حسابك',secondary:'شاهد كيف يعمل',proof:['حالة السوق لحظياً','منهج عمل منظّم','استخبارات مدعومة بالذكاء الاصطناعي'],eyebrow:'حالة السوق الآن',label:'حالة السوق',state:'سياق إيجابي',note:'الهيكل، الأخبار، التموضع والاستخبارات مجتمعة.',assets:['XAUUSD','NAS100','S&P 500'],condition:'الحالة',live:'مباشر'}
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
