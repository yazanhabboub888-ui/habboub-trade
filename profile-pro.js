/* Econova — Premium Profile UI
   Lightweight by design: email/phone/avatar stay references in Auth/Profile.
*/
(() => {
  "use strict";

  const q = (id) => document.getElementById(id);
  const SUPABASE_URL = "https://feoyjasuvrqxzhskqzye.supabase.co";
  const SUPABASE_KEY = "sb_publishable_ehho8PNFtVSRiBn7GaBl9Q_Tl1mYVT0";
  let client = null;

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
  }
  function val(value, fallback = "—") {
    const v = String(value ?? "").trim();
    return v || fallback;
  }
  function labels() {
    return document.documentElement.lang === "ar" ? {
      account:"الحساب الشخصي", online:"متصل الآن", email:"البريد الإلكتروني", phone:"رقم الهاتف",
      plan:"الخطة الحالية", free:"الخطة المجانية", soon:"الدفع والاشتراكات قريباً",
      profile:"تعديل الملف الشخصي", logout:"تسجيل الخروج"
    } : {
      account:"Personal Account", online:"Online now", email:"Email address", phone:"Phone number",
      plan:"Current plan", free:"Free plan", soon:"Payments & subscriptions coming soon",
      profile:"Edit profile", logout:"Log out"
    };
  }
  function icon(symbol) { return `<span class="profile-item-icon" aria-hidden="true">${symbol}</span>`; }

  async function loadData() {
    try {
      if (!window.supabase?.createClient) return null;
      if (!client) client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth:{ persistSession:true, autoRefreshToken:true, detectSessionInUrl:true } });
      const { data:{ user } } = await client.auth.getUser();
      if (!user) return null;
      let profile = null;
      const result = await client.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (!result.error) profile = result.data;
      return {
        name: val(profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0], "User"),
        email: val(user.email || profile?.email),
        phone: val(user.phone || user.user_metadata?.phone || profile?.phone),
        avatar: profile?.avatar_url || user.user_metadata?.avatar_url || ""
      };
    } catch (_) { return null; }
  }

  function paint(data) {
    const menu = q("profileMenu");
    if (!menu || !data) return;
    const l = labels();
    const old = menu.querySelector(".profile-premium-extra");
    old?.remove();

    const head = menu.querySelector(".profile-menu-head");
    if (head) {
      const name = head.querySelector("#profileName");
      const email = head.querySelector("#profileEmail");
      if (name) name.textContent = data.name;
      if (email) email.textContent = data.email;
      const avatar = head.querySelector("#profileAvatarLarge");
      if (avatar && data.avatar) {
        avatar.innerHTML = "";
        const img = document.createElement("img");
        img.src = data.avatar; img.alt = ""; img.loading = "lazy";
        Object.assign(img.style,{width:"100%",height:"100%",objectFit:"cover",display:"block",borderRadius:"50%"});
        img.onerror = () => { avatar.textContent = data.name.charAt(0).toUpperCase(); };
        avatar.appendChild(img); avatar.classList.add("has-image");
      }
    }

    const extra = document.createElement("div");
    extra.className = "profile-premium-extra";
    extra.innerHTML = `
      <div class="profile-contact-grid">
        <div class="profile-contact-card">${icon("✉")}<div><small>${l.email}</small><strong>${escapeHtml(data.email)}</strong></div></div>
        <div class="profile-contact-card">${icon("⌕")}<div><small>${l.phone}</small><strong>${escapeHtml(data.phone)}</strong></div></div>
      </div>
      <div class="profile-plan-card">
        <div>${icon("◈")}<div><small>${l.plan}</small><strong>${l.free}</strong></div></div>
        <span>${l.soon}</span>
      </div>`;
    menu.insertBefore(extra, menu.querySelector("#profileLabel") || menu.lastElementChild);

    const actions = menu.querySelectorAll(".profile-menu-item");
    if (actions[0]) actions[0].innerHTML = `${icon("◎")}<span>${l.profile}</span><b>›</b>`;
    if (actions[1]) actions[1].innerHTML = `${icon("↪")}<span>${l.logout}</span><b>›</b>`;
  }

  async function refresh() { const data = await loadData(); if (data) paint(data); }

  function init() {
    refresh();
    window.addEventListener("habboub:profile-refresh", refresh);
    window.addEventListener("habboub:language-changed", refresh);
    window.HabboubPremiumProfile = { refresh };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once:true });
  else init();
})();
