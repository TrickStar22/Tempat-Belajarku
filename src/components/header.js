import { getBrandLogoSVG } from '../assets/illustrations.js';
import { escapeHTML } from '../utils/formatters.js';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Beranda' },
  { id: 'materi', label: 'Materi' },
  { id: 'kuis', label: 'Kuis' },
  { id: 'simulasi', label: 'Simulasi' },
  { id: 'pencapaian', label: 'Pencapaian' },
  { id: 'premium', label: 'DoodleLab PRO', isPro: true }
];

export function renderHeader({ state, currentView, mobileMenuOpen, onNavigate, onOpenAuth, onLogout, onToggleMobileMenu }) {
  const topBar = document.getElementById('top-bar');
  if (!topBar) return;

  const isMateriActive = (id) => currentView === id || (id === 'materi' && currentView === 'materi-detail');

  const navButtonsHTML = NAV_ITEMS.map((item) => `
    <button
      type="button"
      class="nav-link ${item.isPro ? 'pro-link' : ''} ${isMateriActive(item.id) ? 'active' : ''}"
      data-nav-view="${item.id}"
      aria-current="${isMateriActive(item.id) ? 'page' : 'false'}"
    >${item.label}</button>
  `).join('');

  const authControlHTML = state.isGuest
    ? `<button type="button" class="doodle-btn blue sm" id="header-login-btn">Masuk / Daftar</button>`
    : `
      <div style="display:flex; align-items:center; gap:0.5rem;">
        ${state.isPro ? '<span class="pro-badge">PRO</span>' : ''}
        <button type="button" class="doodle-btn coral sm" id="header-logout-btn" title="${escapeHTML(state.email)}">Keluar</button>
      </div>
    `;

  topBar.innerHTML = `
    <div class="header-inner">
      <button type="button" class="brand-btn" id="brand-home-btn" aria-label="DoodleLab Beranda">
        ${getBrandLogoSVG()}
        <span class="brand-title">DoodleLab</span>
      </button>

      <nav class="nav-links" aria-label="Navigasi Utama">
        ${navButtonsHTML}
      </nav>

      <div class="header-actions">
        ${authControlHTML}
        <button
          type="button"
          class="mobile-menu-btn"
          id="mobile-menu-toggle"
          aria-expanded="${mobileMenuOpen ? 'true' : 'false'}"
          aria-controls="mobile-drawer"
          aria-label="Buka menu navigasi"
        >${mobileMenuOpen ? 'Tutup' : 'Menu'}</button>
      </div>
    </div>

    <nav id="mobile-drawer" class="mobile-drawer ${mobileMenuOpen ? 'open' : ''}" aria-label="Menu Seluler">
      ${navButtonsHTML}
    </nav>
  `;

  topBar.querySelector('#brand-home-btn')?.addEventListener('click', () => onNavigate('dashboard'));
  topBar.querySelectorAll('[data-nav-view]').forEach((btn) => {
    btn.addEventListener('click', () => onNavigate(btn.dataset.navView));
  });
  topBar.querySelector('#header-login-btn')?.addEventListener('click', () => onOpenAuth('login'));
  topBar.querySelector('#header-logout-btn')?.addEventListener('click', onLogout);
  topBar.querySelector('#mobile-menu-toggle')?.addEventListener('click', onToggleMobileMenu);
}
