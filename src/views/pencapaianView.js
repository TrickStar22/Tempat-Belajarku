import { renderPlayerBannerHTML } from '../components/playerBanner.js';
import { ACHIEVEMENTS_DATA, CATEGORIES, DEMO_LEADERBOARD, MATERI_DATA, QUIZ_DATA } from '../data/curriculum.js';
import { calculateLevel } from '../state/store.js';
import { escapeHTML } from '../utils/formatters.js';

export function renderPencapaianView(root, ctx) {
  const { state, onEditAlias, onConfirmReset } = ctx;

  const lbEntries = [
    ...DEMO_LEADERBOARD.map((d) => ({ ...d, isMe: false })),
    {
      namaAlias: `${state.namaAlias} (Kamu)`,
      xp: state.xp,
      avatar: state.isPro ? '👑' : '🧑‍🔬',
      isPro: state.isPro,
      isMe: true
    }
  ].sort((a, b) => b.xp - a.xp);

  root.innerHTML = `
    ${renderPlayerBannerHTML(state)}

    <div class="grid-2" style="margin-bottom:2rem;">
      <section class="doodle-card">
        <h2 style="font-size:1.7rem; margin-bottom:1rem;">Statistik Belajar per Kategori</h2>
        ${CATEGORIES.map((cat) => {
          const items = MATERI_DATA.filter((m) => m.kategori === cat.id);
          const done = items.filter((m) => state.materiSelesai.includes(m.id)).length;
          const pct = Math.round((done / items.length) * 100);
          return `
            <div style="margin-bottom:1rem;">
              <div style="display:flex; justify-content:space-between; font-family:var(--font-ui); font-size:0.92rem; margin-bottom:0.3rem;" class="tabular-nums">
                <span>${cat.nama} (${done}/${items.length} Materi)</span>
                <span><b>${pct}%</b></span>
              </div>
              <div class="sketch-progress-wrap" style="height:15px;" aria-hidden="true">
                <div class="sketch-progress-fill" style="width:${pct}%; background:${cat.color};"></div>
              </div>
            </div>
          `;
        }).join('')}

        <div style="margin-top:1.3rem; padding-top:1rem; border-top:2px dashed var(--ink-black); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem;">
          <span class="tabular-nums" style="font-size:0.9rem; color:var(--ink-muted); font-weight:700;">
            Total Kuis Dikuasai: ${state.kuisSelesai.length}/${QUIZ_DATA.length}
          </span>
          <button type="button" class="doodle-btn coral sm" id="btn-reset-progress">Reset Progres</button>
        </div>
      </section>

      <section class="doodle-card alt-border">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h2 style="font-size:1.7rem;">Papan Peringkat Lokal</h2>
          <span class="meta-row">Top Ilmuwan</span>
        </div>
        <div>
          ${lbEntries.map((item, idx) => {
            const lvl = calculateLevel(item.xp);
            const rankLabel = idx === 0 ? '#1' : idx === 1 ? '#2' : idx === 2 ? '#3' : `#${idx + 1}`;
            return `
              <div class="lb-row ${item.isMe ? 'is-me' : ''}">
                <div style="display:flex; align-items:center; gap:0.7rem;">
                  <span class="ui-font tabular-nums" style="font-size:1.05rem; min-width:30px;">${rankLabel}</span>
                  <span style="font-size:1.35rem;" aria-hidden="true">${item.avatar}</span>
                  <div>
                    <div class="ui-font" style="font-size:0.98rem;">
                      ${escapeHTML(item.namaAlias)} ${item.isPro ? '· PRO' : ''}
                    </div>
                    <div style="font-size:0.8rem; color:var(--ink-muted); font-weight:700;" class="tabular-nums">Level ${lvl}</div>
                  </div>
                </div>
                <span class="mono-metric tabular-nums" style="font-weight:700;">${item.xp} XP</span>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    </div>

    <div class="section-header">
      <h2 class="section-title tabular-nums">Koleksi Stiker Pencapaian (${state.badge.length}/${ACHIEVEMENTS_DATA.length})</h2>
    </div>

    <div class="grid-4" data-testid="badges-grid">
      ${ACHIEVEMENTS_DATA.map((ach) => {
        const unlocked = state.badge.includes(ach.id);
        return `
          <article class="sticker-badge ${unlocked ? 'unlocked' : 'locked'}" data-badge-id="${ach.id}" data-unlocked="${unlocked}">
            <span class="sticker-icon" aria-hidden="true">${ach.icon}</span>
            <h3 style="font-family:var(--font-ui); font-size:1.04rem;">${ach.nama}</h3>
            <p style="font-size:0.85rem; color:var(--ink-muted); margin:0.35rem 0 0.55rem;">${ach.deskripsi}</p>
            <span class="status-label ${unlocked ? 'status-done' : 'status-locked'}">
              ${unlocked ? 'Diperoleh' : 'Belum Tercapai'}
            </span>
          </article>
        `;
      }).join('')}
    </div>
  `;

  root.querySelector('#btn-edit-alias')?.addEventListener('click', onEditAlias);
  root.querySelector('#btn-reset-progress')?.addEventListener('click', onConfirmReset);
}
