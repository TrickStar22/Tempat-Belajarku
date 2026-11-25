import { renderPlayerBannerHTML } from '../components/playerBanner.js';
import { ACHIEVEMENTS_DATA, CATEGORIES, MATERI_DATA } from '../data/curriculum.js';
import { getTodayChallenge } from '../state/store.js';
import { escapeHTML } from '../utils/formatters.js';

export function renderDashboardView(root, ctx) {
  const { state, onNavigate, onEditAlias, onAnswerDailyChallenge, onStartQuickQuiz, onRequestUpgrade } = ctx;
  const dc = getTodayChallenge();
  const dcDone = state.dailyChallenge.selesai;

  const upgradeBannerHTML = !state.isPro
    ? `
      <section class="doodle-card" style="background:linear-gradient(135deg, #FFD66B 0%, #FFE8A3 100%); margin-bottom:1.75rem; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem;">
        <div>
          <div class="meta-row" style="color:var(--ink-black); margin-bottom:0.25rem;">
            <span>DoodleLab PRO</span>
            <span class="meta-sep" aria-hidden="true">·</span>
            <span>Penawaran Pelajar</span>
          </div>
          <h2 style="font-size:1.75rem;">Upgrade ke DoodleLab PRO</h2>
          <p style="font-weight:700; font-size:0.95rem; max-width:62ch;">Buka 4 Materi Sains Lanjutan (Kuantum, Polimer, CRISPR, Lubang Hitam), Wave &amp; Optics Lab, serta Bonus 2x XP.</p>
        </div>
        <button type="button" class="doodle-btn purple" id="dash-upgrade-btn">Upgrade ke PRO</button>
      </section>
    `
    : `
      <section class="doodle-card" style="background:linear-gradient(135deg, #E8F8EC 0%, #FFF7D6 100%); margin-bottom:1.75rem; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem;">
        <div>
          <div class="meta-row" style="color:var(--ink-black); margin-bottom:0.25rem;">
            <span class="pro-badge">PRO AKTIF</span>
            <span>${escapeHTML(state.proPlanName || 'VIP Scientist')}</span>
          </div>
          <h2 style="font-size:1.65rem;">Akses Penuh VIP Scientist Aktif</h2>
          <p style="font-weight:700; font-size:0.93rem;">Seluruh materi lanjutan PRO, Wave &amp; Optics Simulator, dan Bonus 2x XP otomatis aktif.</p>
        </div>
        <button type="button" class="doodle-btn paper sm" id="dash-tx-btn">Lihat Riwayat Transaksi</button>
      </section>
    `;

  const catCardsHTML = CATEGORIES.map((cat) => {
    const items = MATERI_DATA.filter((m) => m.kategori === cat.id);
    const doneCount = items.filter((m) => state.materiSelesai.includes(m.id)).length;
    const pct = Math.round((doneCount / items.length) * 100);
    return `
      <article class="doodle-card interactive" style="display:flex; flex-direction:column; justify-content:space-between; gap:0.8rem;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
            <span class="cat-accent cat-${cat.id}">${cat.nama}</span>
            <span class="ui-font tabular-nums" style="font-size:0.86rem;">${doneCount}/${items.length} Materi</span>
          </div>
          <h3 style="font-size:1.5rem; margin-bottom:0.35rem;">Eksplorasi ${cat.nama}</h3>
          <p style="font-size:0.92rem; color:var(--ink-muted);">${cat.desc}</p>
        </div>
        <div>
          <div class="sketch-progress-wrap" style="height:14px; margin-bottom:0.75rem;" aria-hidden="true">
            <div class="sketch-progress-fill" style="width:${pct}%; background:${cat.color};"></div>
          </div>
          <button type="button" class="doodle-btn cream sm" style="width:100%;" data-cat-open="${cat.id}">
            Buka ${cat.nama}
          </button>
        </div>
      </article>
    `;
  }).join('');

  const recentBadgesHTML = ACHIEVEMENTS_DATA.slice(0, 4).map((ach) => {
    const unlocked = state.badge.includes(ach.id);
    return `
      <div class="sticker-badge ${unlocked ? 'unlocked' : 'locked'}">
        <span class="sticker-icon" aria-hidden="true">${ach.icon}</span>
        <div class="ui-font" style="font-size:0.92rem;">${ach.nama}</div>
        <div style="font-size:0.8rem; color:var(--ink-muted); margin-top:0.2rem;">${unlocked ? 'Tercapai' : 'Terkunci'}</div>
      </div>
    `;
  }).join('');

  root.innerHTML = `
    ${renderPlayerBannerHTML(state)}
    ${upgradeBannerHTML}

    <div class="section-header">
      <h1 class="section-title">Kategori Pembelajaran Sains</h1>
      <button type="button" class="doodle-btn blue sm" id="dash-all-materi">Lihat Semua ${MATERI_DATA.length} Materi</button>
    </div>

    <div class="grid-4" style="margin-bottom:2rem;">
      ${catCardsHTML}
    </div>

    <div class="grid-2">
      <section class="doodle-card alt-border" style="background:#FFFDF5;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
          <h2 style="font-size:1.65rem;">Daily Science Challenge</h2>
          <span class="meta-row tabular-nums">${state.dailyChallenge.tanggal}</span>
        </div>
        <p style="font-weight:700; margin-bottom:0.95rem;">${dc.pertanyaan}</p>
        ${dcDone
          ? `
            <div data-testid="daily-challenge-done" style="background:var(--science-green); border:2.5px solid var(--ink-black); border-radius:14px; padding:0.95rem; font-family:var(--font-ui); text-align:center;">
              Tantangan Hari Ini Selesai (+${dc.xp * (state.isPro ? 2 : 1)} XP diklaim)<br />
              <span style="font-size:0.86rem; font-family:var(--font-body);">Kembali lagi besok untuk tantangan baru.</span>
            </div>
          `
          : `
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem;">
              ${dc.opsi.map((opt, idx) => `
                <button type="button" class="doodle-btn cream sm" style="justify-content:flex-start; white-space:normal; text-align:left;" data-dc-opt="${idx}">
                  <b>${['A', 'B', 'C', 'D'][idx]}.</b>&nbsp;${opt}
                </button>
              `).join('')}
            </div>
            <div class="meta-row" style="margin-top:0.8rem;">
              <span>Hadiah: +${dc.xp * (state.isPro ? 2 : 1)} XP${state.isPro ? ' (Bonus 2x PRO)' : ''}</span>
            </div>
          `
        }
      </section>

      <section class="doodle-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem;">
          <h2 style="font-size:1.65rem;">Stiker Pencapaian</h2>
          <button type="button" class="doodle-btn purple sm" id="dash-all-badges">Semua Badge</button>
        </div>
        <div class="grid-2" style="gap:0.75rem; margin-bottom:1rem;">
          ${recentBadgesHTML}
        </div>
        <div style="display:flex; gap:0.65rem; flex-wrap:wrap;">
          <button type="button" class="doodle-btn green sm" style="flex:1;" id="dash-open-sim">Buka Lab Simulasi</button>
          <button type="button" class="doodle-btn blue sm" style="flex:1;" id="dash-quick-quiz">Mulai Kuis Acak</button>
        </div>
      </section>
    </div>
  `;

  root.querySelector('#btn-edit-alias')?.addEventListener('click', onEditAlias);
  root.querySelector('#dash-upgrade-btn')?.addEventListener('click', () => {
    if (onRequestUpgrade) onRequestUpgrade();
    else onNavigate('premium');
  });
  root.querySelector('#dash-tx-btn')?.addEventListener('click', () => onNavigate('premium'));
  root.querySelector('#dash-all-materi')?.addEventListener('click', () => onNavigate('materi', { category: 'Semua' }));
  root.querySelector('#dash-all-badges')?.addEventListener('click', () => onNavigate('pencapaian'));
  root.querySelector('#dash-open-sim')?.addEventListener('click', () => onNavigate('simulasi'));
  root.querySelector('#dash-quick-quiz')?.addEventListener('click', onStartQuickQuiz);

  root.querySelectorAll('[data-cat-open]').forEach((btn) => {
    btn.addEventListener('click', () => onNavigate('materi', { category: btn.dataset.catOpen }));
  });
  root.querySelectorAll('[data-dc-opt]').forEach((btn) => {
    btn.addEventListener('click', () => onAnswerDailyChallenge(Number(btn.dataset.dcOpt)));
  });
}
