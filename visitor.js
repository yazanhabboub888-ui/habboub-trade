(() => {
  const btn = document.getElementById('vLang');
  const theme = document.getElementById('vTheme');
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

  const savedTheme = localStorage.getItem('econova-public-theme');
  if (savedTheme === 'light') document.body.classList.add('v-light');
  const syncTheme = () => { if (theme) theme.textContent = document.body.classList.contains('v-light') ? '☾' : '☀'; };
  syncTheme();
  theme?.addEventListener('click', () => {
    document.body.classList.toggle('v-light');
    localStorage.setItem('econova-public-theme', document.body.classList.contains('v-light') ? 'light' : 'dark');
    syncTheme();
  });

  toggle?.addEventListener('click', () => menu?.classList.toggle('open'));
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));
})();