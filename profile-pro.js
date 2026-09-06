/* Habboub — Premium Profile UI
   Lightweight: email/phone/avatar remain references from Auth/Profile data.
*/
(() => {
  "use strict";

  const q = (id) => document.getElementById(id);
  const getClient = () => window.supabaseClient || window._supabaseClient || null;

  function text(value, fallback = "—") {
    const v = String(value ?? "").trim();
    return v || fallback;
  }

  function profileData() {
    const user = window.state?.user || null;
    const profile = window.state?.profile || null;
    return {
      user,
      profile,
      name: text(profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0], "User"),
      email: text(user?.email || profile?.email),
      phone: text(user?.phone || user?.user_metadata?.phone || profile?.phone),
      avatar: text(profile?.avatar_url || user?.user_metadata?.avatar_url, "")
    };
  }

  function icon(symbol) {
    return `<span class="profile-item-icon" aria-hidden="true">${symbol}</span>`;
  }

  function renderMenu() {
    const menu = q("profileMenu");
    if (!menu) return;
    const d = profileData();
    const avatar = q("profileAvatarLarge");
    const avatarHtml = avatar?.outerHTML || `<span id="profileAvatarLarge" class="profile-avatar large">U</span>`;
    const ar = document.documentElement.lang === "ar";
    const labels = ar ? {
      account: "الحساب الشخصي", online: "متصل الآن", email: "البريد الإلكتروني",
      phone: "رقم الهاتف", profile: "تعديل الملف الشخصي", plan: "الخطة الحالية",
      free: "الخطة المجانية", soon: "الدفع والاشتراكات قريباً", logout: "تسجيل الخروج"
    } : {
      account: "Personal Account", online: "Online now", email: "Email address",
      phone: "Phone number", profile: "Edit profile", plan: "Current plan",
      free: "Free plan", soon: "Payments & subscriptions coming soon", logout: "Log out"
    };

    menu.innerHTML = `
      <div class="profile-premium-glow"></div>
      <div class="profile-premium-head">
        <div class="profile-premium-user">
          ${avatarHtml}
          <div class="profile-premium-copy">
            <strong>${escapeHtml(d.name)}</strong>
            <small>${labels.account}</small>
            <span class="profile-status"><i></i>${labels.online}</span>
          </div>
        </div>
      </div>
      <div class="profile-contact-grid">
        <div class="profile-contact-card">${icon("✉")}<div><small>${labels.email}</small><strong>${escapeHtml(d.email)}</strong></div></div>
        <div class="profile-contact-card">${icon("⌕")}<div><small>${labels.phone}</small><strong>${escapeHtml(d.phone)}</strong></div></div>
      </div>
      <div class="profile-plan-card">
        <div>${icon("◈")}<div><small>${labels.plan}</small><strong>${labels.free}</strong></div></div>
        <span>${labels.soon}</span>
      </div>
      <div class="profile-menu-divider"></div>
      <div class="profile-menu-actions">
        <button id="profileLabel" class="profile-menu-item profile-premium-item" type="button">${icon("◎")}<span>${labels.profile}</span><b>›</b></button>
        <button id="logoutButton" class="profile-menu-item profile-premium-item danger" type="button">${icon("↪")}<span>${labels.logout}</span><b>›</b></button>
      </div>`;

    q("profileLabel")?.addEventListener("click", () => { menu.classList.add("hidden"); window.showProfileModal?.(); });
    q("logoutButton")?.addEventListener("click", async () => { menu.classList.add("hidden"); await window.logoutUser?.(); });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function init() {
    renderMenu();
    const area = q("profileArea");
    if (!area) return;
    const observer = new MutationObserver(() => {
      if (!q("profileMenu")) return;
      const menu = q("profileMenu");
      if (!menu.dataset.premiumReady || menu.dataset.premiumReady !== "1") {
        menu.dataset.premiumReady = "1";
        renderMenu();
      }
    });
    observer.observe(area, { childList: true, subtree: true, attributes: false });
    window.addEventListener("habboub:profile-refresh", renderMenu);
    window.HabboubPremiumProfile = { refresh: renderMenu };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
