html,
body,
#q-app {
  min-height: 100%;
  background: #020817 !important;
}

body {
  color: #ffffff !important;
  background:
    radial-gradient(circle at 74% 0%, rgba(119, 184, 255, 0.78), transparent 22rem),
    radial-gradient(circle at 8% 18%, rgba(31, 111, 235, 0.74), transparent 18rem),
    radial-gradient(circle at 92% 82%, rgba(12, 214, 255, 0.22), transparent 18rem),
    linear-gradient(180deg, #061833 0%, #040914 42%, #020817 100%) !important;
  font-family: Inter, Roboto, Arial, sans-serif !important;
}

.q-layout,
.q-page-container,
.q-page {
  background: transparent !important;
  color: #ffffff !important;
}

.q-page {
  min-height: 100vh !important;
  padding: 18px 0 34px !important;
}

.page-shell {
  width: min(100% - 28px, 920px) !important;
  margin: 0 auto !important;
}

.q-header {
  background: linear-gradient(180deg, rgba(2, 8, 23, 0.82), rgba(2, 8, 23, 0)) !important;
  border-bottom: 0 !important;
  box-shadow: none !important;
  color: #ffffff !important;
  padding-top: 6px;
}

.q-toolbar.page-shell {
  gap: 10px;
  min-height: 74px;
  align-items: center;
}

.q-toolbar__title {
  display: none !important;
}

.back-btn.disabled {
  display: none !important;
}

.q-btn[aria-label="Назад"],
.q-btn[aria-label="Меню"] {
  backdrop-filter: blur(18px);
  background: rgba(255, 255, 255, 0.12) !important;
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
  color: #ffffff !important;
}

.status-chip {
  display: none !important;
}

.q-toolbar.page-shell::after {
  width: 48px;
  height: 48px;
  content: "person";
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background:
    radial-gradient(circle at 34% 24%, rgba(255, 255, 255, 0.78), transparent 17%),
    linear-gradient(135deg, #3b82ff, #0b2f72 52%, #061126);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
  color: #ffffff;
  font-family: "Material Icons";
  font-size: 26px;
  line-height: 1;
}

.app-drawer,
.app-drawer .q-drawer__content {
  background:
    radial-gradient(circle at 28% 0%, rgba(71, 139, 255, 0.42), transparent 16rem),
    linear-gradient(180deg, #071226 0%, #050816 58%, #02030a 100%) !important;
  color: #ffffff !important;
}

.drawer-brand {
  padding: 28px 18px 18px !important;
}

.drawer-subtitle,
.nav-list .q-item__label--header {
  color: rgba(255, 255, 255, 0.62) !important;
}

.brand-avatar {
  background:
    radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.84), transparent 18%),
    linear-gradient(135deg, #2f7cff, #0bc7ff 46%, #081124) !important;
  box-shadow: 0 18px 42px rgba(47, 124, 255, 0.32);
}

.nav-item {
  border: 1px solid transparent;
  border-radius: 16px !important;
  color: rgba(255, 255, 255, 0.78) !important;
  margin: 6px 8px !important;
  min-height: 56px;
}

.nav-item.q-router-link--active {
  background: linear-gradient(135deg, rgba(47, 124, 255, 0.34), rgba(255, 255, 255, 0.08)) !important;
  border-color: rgba(255, 255, 255, 0.16);
  color: #ffffff !important;
  font-weight: 800;
}

.dashboard-head {
  min-height: 42vh;
  margin: 52px 0 20px !important;
  padding: 18px 0 !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
}

.dashboard-head > div {
  width: 100%;
}

.dashboard-head h1,
.page-shell > h1 {
  color: #ffffff !important;
  font-size: clamp(2.65rem, 11vw, 4.8rem) !important;
  font-weight: 400 !important;
  letter-spacing: 0 !important;
  line-height: 1.05 !important;
  margin: 0 !important;
  text-align: center;
}

.dashboard-head p {
  max-width: 560px;
  margin: 18px auto 26px !important;
  color: rgba(255, 255, 255, 0.68) !important;
  font-size: 1.05rem;
  line-height: 1.55;
}

.dashboard-head .q-btn,
.toolbar-row .q-btn,
.push-card .q-btn {
  min-height: 52px;
  border-radius: 16px !important;
  background: linear-gradient(90deg, #1e6cff, #6ea4ff) !important;
  box-shadow: 0 18px 36px rgba(30, 108, 255, 0.28) !important;
  color: #ffffff !important;
  font-weight: 800 !important;
}

.module-grid {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 14px !important;
}

.module-status {
  min-height: 144px !important;
  aspect-ratio: 1 / 1;
  padding: 14px 10px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative;
  text-align: center;
  border-radius: 28px !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  background:
    radial-gradient(circle at 50% 0%, rgba(106, 164, 255, 0.22), transparent 62%),
    linear-gradient(145deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.07)) !important;
  box-shadow: 0 24px 58px rgba(0, 0, 0, 0.26);
  color: #ffffff !important;
}

.module-status .q-item__section--avatar {
  width: 56px !important;
  min-width: 56px !important;
  height: 56px !important;
  margin: 0 0 12px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background:
    radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.72), transparent 18%),
    linear-gradient(135deg, #2f7cff, #081124) !important;
  box-shadow: 0 18px 34px rgba(47, 124, 255, 0.28);
}

.module-status .q-icon {
  color: #ffffff !important;
  font-size: 1.9rem !important;
}

.module-status .q-item__section {
  align-items: center !important;
  min-width: 0 !important;
  text-align: center !important;
  width: 100% !important;
}

.module-status .q-item__section:not(.q-item__section--avatar):not(.q-item__section--side) {
  padding: 0 !important;
}

.module-status .q-item__label {
  color: #ffffff !important;
  font-size: 0.95rem;
  font-weight: 800;
  line-height: 1.18;
  max-width: 100%;
  white-space: normal !important;
}

.module-status .q-item__label--caption {
  color: rgba(255, 255, 255, 0.58) !important;
  font-size: 0.85rem;
  margin-top: 6px;
}

.module-status .q-item__section--side {
  display: none !important;
}

.module-status .q-badge {
  width: 12px;
  min-width: 12px;
  height: 12px;
  padding: 0;
  background: #19d27d !important;
  box-shadow: 0 0 20px rgba(25, 210, 125, 0.54);
}

.q-card,
.rounded-borders,
.chat-shell {
  backdrop-filter: blur(24px);
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.07)),
    rgba(4, 14, 32, 0.58) !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  border-radius: 26px !important;
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28) !important;
  color: #ffffff !important;
}

.rounded-borders {
  overflow: hidden !important;
}

.section-title {
  color: #ffffff !important;
  font-size: 1.25rem !important;
  font-weight: 800 !important;
}

.q-card .q-item,
.q-card .q-item__label,
.q-card .q-item__section--side {
  color: rgba(255, 255, 255, 0.82) !important;
}

.page-shell > h1 {
  margin: 0 0 30px !important;
  padding-top: 116px !important;
}

.toolbar-row {
  display: grid !important;
  grid-template-columns: minmax(0, 1fr) !important;
  gap: 12px !important;
  align-items: center !important;
  margin-bottom: 18px !important;
}

.toolbar-row span,
.text-warning {
  color: #fbbf24 !important;
  font-weight: 700;
  text-align: center;
}

.poll-item {
  background: rgba(10, 18, 36, 0.94) !important;
  color: #ffffff !important;
  padding: 24px 20px !important;
}

.poll-item + .poll-item {
  border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
}

.poll-question,
.session-title {
  color: #ffffff !important;
  font-size: 1.15rem !important;
  font-weight: 800 !important;
  line-height: 1.25;
}

.q-radio__label,
.q-checkbox__label {
  color: rgba(255, 255, 255, 0.88) !important;
  font-size: 1rem;
}

.sessions-grid {
  display: grid !important;
  grid-template-columns: 1fr !important;
  gap: 16px !important;
}

.muted,
.q-field__label,
.q-field__native,
.q-field__input,
.q-item__label--caption {
  color: rgba(255, 255, 255, 0.66) !important;
}

.q-field--outlined .q-field__control::before {
  border-color: rgba(255, 255, 255, 0.26) !important;
}

.chat-shell {
  display: grid !important;
  grid-template-columns: 1fr !important;
  min-height: 620px !important;
  overflow: hidden !important;
}

.rooms {
  background: rgba(255, 255, 255, 0.06) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-right: 0 !important;
}

.rooms-head {
  padding: 16px !important;
}

.rooms-head .q-badge {
  border-radius: 999px !important;
  background: linear-gradient(135deg, #f59e0b, #c2410c) !important;
  color: #ffffff !important;
  font-weight: 800;
  padding: 8px 12px;
}

.rooms .q-item {
  color: rgba(255, 255, 255, 0.82) !important;
  min-height: 58px;
  padding: 0 18px;
}

.rooms .q-item--active {
  background: rgba(47, 124, 255, 0.18) !important;
  color: #ffffff !important;
  font-weight: 800;
}

.message {
  max-width: 680px;
  padding: 12px 14px !important;
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  background: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
}

.message p {
  color: rgba(255, 255, 255, 0.74) !important;
}

.composer {
  border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
  padding: 14px !important;
}

.composer .q-btn {
  min-width: 54px !important;
  min-height: 54px !important;
  background: linear-gradient(135deg, #2f7cff, #7fb3ff) !important;
  color: #ffffff !important;
}

.q-banner {
  border-radius: 18px !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  color: #ffffff !important;
}

.push-card {
  max-width: 560px;
  margin: 0 auto;
}

@media (min-width: 720px) {
  .module-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
  }

  .sessions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .toolbar-row {
    grid-template-columns: minmax(260px, 360px) minmax(0, 1fr) !important;
  }
}
