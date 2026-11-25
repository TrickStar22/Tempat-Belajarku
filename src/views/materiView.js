import { getDoodleSVG } from '../assets/illustrations.js';
import { MATERI_DATA, QUIZ_DATA } from '../data/curriculum.js';

export function renderMateriListView(root, ctx) {
  const { state, selectedCategory, onSelectCategory, onOpenMateri } = ctx;
  const filters = ['Semua', 'Fisika', 'Kimia', 'Biologi', 'Astronomi'];
  const filtered = selectedCategory === 'Semua'
    ? MATERI_DATA
    : MATERI_DATA.filter((m) => m.kategori === selectedCategory);

  root.innerHTML = `
    <div class="section-header">
      <h1 class="section-title">Buku Catatan Materi Sains</h1>
      <div class="segmented-bar" role="group" aria-label="Filter kategori materi">
        ${filters.map((f) => `
          <button
            type="button"
            class="seg-btn ${selectedCategory === f ? 'active' : ''}"
            data-filter-cat="${f}"
            aria-pressed="${selectedCategory === f ? 'true' : 'false'}"
          >${f}</button>
        `).join('')}
      </div>
    </div>

    <div class="grid-3" data-testid="materi-grid">
      ${filtered.map((m) => {
        const isDone = state.materiSelesai.includes(m.id);
        const isLockedPro = m.isPro && !state.isPro;
        return `
          <article class="doodle-card interactive" style="display:flex; flex-direction:column; justify-content:space-between; ${m.isPro ? 'background:linear-gradient(180deg,#FFFDF7,#FFF8E1);' : ''}">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:center; gap:0.5rem; margin-bottom:0.75rem;">
                <span class="cat-accent cat-${m.kategori}">${m.kategori}</span>
                ${m.isPro
                  ? `<span class="pro-badge">${isLockedPro ? 'Terkunci PRO' : 'Materi PRO'}</span>`
                  : `<span class="status-label ${isDone ? 'status-done' : ''}">${isDone ? 'Selesai' : m.tingkatKesulitan}</span>`
                }
              </div>
              <div class="materi-illustration">
                ${getDoodleSVG(m.svgType)}
              </div>
              <h2 style="font-size:1.48rem; margin-bottom:0.4rem;">${m.judul}</h2>
              <p style="font-size:0.94rem; color:var(--ink-muted); margin-bottom:1.1rem;">${m.deskripsi}</p>
            </div>
            <button
              type="button"
              class="doodle-btn ${isLockedPro ? '' : (isDone ? 'green' : 'blue')}"
              style="width:100%;"
              data-open-materi="${m.id}"
            >
              ${isLockedPro ? 'Buka dengan PRO' : (isDone ? 'Baca Ulang Materi' : 'Pelajari Materi')}
            </button>
          </article>
        `;
      }).join('')}
    </div>
  `;

  root.querySelectorAll('[data-filter-cat]').forEach((btn) => {
    btn.addEventListener('click', () => onSelectCategory(btn.dataset.filterCat));
  });
  root.querySelectorAll('[data-open-materi]').forEach((btn) => {
    btn.addEventListener('click', () => onOpenMateri(btn.dataset.openMateri));
  });
}

export function renderMateriDetailView(root, ctx) {
  const { state, activeMateriId, onBack, onCompleteMateri, onStartQuiz, onOpenSim } = ctx;
  const m = MATERI_DATA.find((item) => item.id === activeMateriId) || MATERI_DATA[0];

  if (m.isPro && !state.isPro) {
    renderMateriListView(root, ctx);
    return;
  }

  const isDone = state.materiSelesai.includes(m.id);
  const relatedQuiz = QUIZ_DATA.filter((q) => q.materiId === m.id);
  const rewardXP = 30 * (state.isPro ? 2 : 1);

  root.innerHTML = `
    <div style="margin-bottom:1rem;">
      <button type="button" class="doodle-btn cream sm" id="materi-back-btn">Kembali ke Daftar Materi</button>
    </div>

    <article class="doodle-card" style="max-width:840px; margin:0 auto;">
      <div class="meta-row" style="margin-bottom:0.85rem;">
        <span class="cat-accent cat-${m.kategori}">${m.kategori}</span>
        ${m.isPro ? '<span class="pro-badge">Materi PRO</span>' : ''}
        <span>Tingkat: ${m.tingkatKesulitan}</span>
        ${isDone ? '<span class="meta-sep" aria-hidden="true">·</span><span class="status-label status-done">Sudah Dipelajari</span>' : ''}
      </div>

      <h1 style="font-size:2.2rem; margin-bottom:0.85rem;">${m.judul}</h1>

      <div class="materi-illustration hero-ill">
        ${getDoodleSVG(m.svgType)}
      </div>

      <div class="materi-content-box">
        <p>${m.konten[0]}</p>
        <p>${m.konten[1]}</p>
        <div class="formula-note">${m.konten[2]}</div>
      </div>

      <div style="display:flex; flex-wrap:wrap; gap:0.75rem; margin-top:1.5rem; padding-top:1.25rem; border-top:2.5px dashed var(--ink-black);">
        <button
          type="button"
          class="doodle-btn ${isDone ? 'cream' : 'green'}"
          id="materi-complete-btn"
          ${isDone ? 'disabled' : ''}
        >
          ${isDone ? 'Poin Materi Sudah Diklaim' : `Tandai Selesai (+${rewardXP} XP)`}
        </button>

        ${relatedQuiz.length > 0
          ? `<button type="button" class="doodle-btn" id="materi-quiz-btn">Kuis Materi Ini (${relatedQuiz.length} Soal)</button>`
          : ''
        }

        ${m.simulasiId
          ? `<button type="button" class="doodle-btn purple" id="materi-sim-btn">Coba Lab Simulasi Terkait</button>`
          : ''
        }
      </div>
    </article>
  `;

  root.querySelector('#materi-back-btn')?.addEventListener('click', onBack);
  root.querySelector('#materi-complete-btn')?.addEventListener('click', () => onCompleteMateri(m.id));
  root.querySelector('#materi-quiz-btn')?.addEventListener('click', () => onStartQuiz(m.id));
  root.querySelector('#materi-sim-btn')?.addEventListener('click', () => onOpenSim(m.simulasiId));
}
