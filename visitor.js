(() => {
  const btn = document.getElementById('vLang');
  const menu = document.getElementById('vMobileMenu');
  const toggle = document.getElementById('vMenu');
  let ar = false;
  btn?.addEventListener('click', () => {
    ar = !ar;
    document.documentElement.lang = ar ? 'ar' : 'en';
    document.documentElement.dir = ar ? 'rtl' : 'ltr';
    document.body.classList.toggle('v-rtl', ar);
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
      el.textContent = ar ? el.dataset.ar : el.dataset.en;
    });
    btn.textContent = ar ? 'EN' : 'عربي';
  });
  toggle?.addEventListener('click', () => menu?.classList.toggle('open'));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();