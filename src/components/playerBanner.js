import { ACHIEVEMENTS_DATA, MATERI_DATA } from '../data/curriculum.js';
import { escapeHTML } from '../utils/formatters.js';

export function renderPlayerBannerHTML(state) {
  const xpInLevel = state.xp % 100;
  const totalMateri = MATERI_DATA.length;
  const doneMateri = state.materiSelesai.length;

  return `
    <section class="doodle-card player-banner" aria-label="Ringkasan Profil Ilmuwan">
      <div class="player-identity">
        <div class="avatar-doodle" style="background:${state.isPro ? 'var(--warm-yellow)' : 'var(--playful-purple)'};" aria-hidden="true">
          ${state.isPro ? '👑' : '🧑‍🔬'}
        </div>
        <div style="flex:1; min-width:0;">
          <div class="alias-row">
            <span class="alias-name" data-testid="player-alias">${escapeHTML(state.namaAlias)}</span>
            ${state.isPro ? '<span class="pro-badge">PRO MEMBER</span>' : ''}
            <button type="button" class="doodle-btn cream sm" id="btn-edit-alias" aria-label="Ubah nama alias ilmuwan">Ubah Nama</button>
          </div>
          <div class="meta-row" style="margin-top:0.2rem;">
            <span>${
              state.isGuest
                ? 'Mode Tamu Lokal'
                : state.emailVerified
                  ? `${escapeHTML(state.email)} · ${state.authProvider === 'google.com' ? 'Google Firebase' : 'Akun Firebase'}`
                  : `${escapeHTML(state.email)} · Belum Terverifikasi`
            }</span>
            ${
              !state.isGuest && !state.emailVerified
                ? '<button type="button" class="doodle-btn cream sm" id="btn-verify-email" style="min-height:28px; padding:0.15rem 0.55rem; font-size:0.78rem;">Verifikasi Email</button>'
                : ''
            }
            <span class="meta-sep" aria-hidden="true">·</span>
            <span>${state.isPro ? 'Bonus 2x XP Aktif' : 'Paket Gratis'}</span>
          </div>
          <div class="stat-strip tabular-nums">
            <span class="stat-chip" style="background:var(--playful-purple);" data-testid="player-level">Level ${state.level}</span>
            <span class="stat-chip" style="background:var(--warm-yellow);" data-testid="player-xp">${state.xp} XP</span>
            <span class="stat-chip" style="background:var(--science-green);" data-testid="player-points">${state.totalPoin} Poin</span>
          </div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; justify-content:center; gap:0.55rem;">
        <div style="display:flex; justify-content:space-between; font-family:var(--font-ui); font-size:0.9rem;" class="tabular-nums">
          <span>Progres Level ${state.level} ke ${state.level + 1}</span>
          <span><b>${xpInLevel} / 100 XP</b></span>
        </div>
        <div class="sketch-progress-wrap" role="progressbar" aria-valuenow="${xpInLevel}" aria-valuemin="0" aria-valuemax="100" aria-label="Progres XP level saat ini">
          <div class="sketch-progress-fill" style="width:${xpInLevel}%; background:var(--playful-purple);"></div>
        </div>
        <div class="meta-row tabular-nums">
          <span>Materi Selesai: ${doneMateri}/${totalMateri}</span>
          <span class="meta-sep" aria-hidden="true">·</span>
          <span>Badge: ${state.badge.length}/${ACHIEVEMENTS_DATA.length}</span>
        </div>
      </div>
    </section>
  `;
}
