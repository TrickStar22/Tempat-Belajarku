import { CATEGORIES, MATERI_DATA, QUIZ_DATA } from '../data/curriculum.js';
import { getAccessibleQuizzes } from '../state/store.js';

export function renderQuizView(root, ctx) {
  const {
    state,
    quizSession,
    onStartQuickQuiz,
    onStartMarathonQuiz,
    onStartCategoryQuiz,
    onSubmitAnswer,
    onNextQuestion,
    onExitQuiz,
    onGoDashboard
  } = ctx;

  const accessible = getAccessibleQuizzes(state.isPro);

  if (!quizSession.active) {
    const solvedCount = state.kuisSelesai.length;
    root.innerHTML = `
      <div class="section-header">
        <h1 class="section-title">Arena Kuis Interaktif Sains</h1>
        <span class="meta-row tabular-nums">Soal Dikuasai: <b>${solvedCount} / ${accessible.length}</b></span>
      </div>

      <section class="doodle-card" style="margin-bottom:1.75rem; background:linear-gradient(135deg,#FFFDF7,#EBF7FF);">
        <h2 style="font-size:1.75rem; margin-bottom:0.4rem;">Tantangan Kuis Cepat (${accessible.length} Bank Soal)</h2>
        <p style="margin-bottom:1.1rem; max-width:68ch;">
          Uji pemahamanmu dari seluruh cabang ilmu sains. ${state.isPro ? '<b>Bonus PRO 2x XP aktif pada setiap jawaban benar!</b>' : 'Upgrade ke PRO untuk mendapatkan 2x XP pada setiap kuis.'}
        </p>
        <div style="display:flex; flex-wrap:wrap; gap:0.75rem;">
          <button type="button" class="doodle-btn" id="quiz-quick-btn">Mulai 10 Soal Acak</button>
          <button type="button" class="doodle-btn green" id="quiz-marathon-btn">Maraton Semua ${accessible.length} Soal</button>
        </div>
      </section>

      <h2 style="font-size:1.55rem; margin-bottom:0.9rem;">Pilih Kuis Berdasarkan Kategori</h2>
      <div class="grid-4">
        ${CATEGORIES.map((cat) => {
          const matIds = MATERI_DATA.filter((m) => m.kategori === cat.id && (!m.isPro || state.isPro)).map((m) => m.id);
          const qs = QUIZ_DATA.filter((q) => matIds.includes(q.materiId));
          const done = qs.filter((q) => state.kuisSelesai.includes(q.id)).length;
          return `
            <article class="doodle-card interactive" style="display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <span class="cat-accent cat-${cat.id}" style="display:inline-block; margin-bottom:0.65rem;">${cat.nama}</span>
                <h3 style="font-size:1.45rem;">Kuis ${cat.nama}</h3>
                <p class="tabular-nums" style="font-size:0.9rem; color:var(--ink-muted); margin:0.35rem 0 1rem;">Selesai: ${done}/${qs.length} soal</p>
              </div>
              <button type="button" class="doodle-btn sm" style="width:100%; background:${cat.color};" data-quiz-cat="${cat.id}">
                Mulai Kuis ${cat.nama}
              </button>
            </article>
          `;
        }).join('')}
      </div>
    `;

    root.querySelector('#quiz-quick-btn')?.addEventListener('click', onStartQuickQuiz);
    root.querySelector('#quiz-marathon-btn')?.addEventListener('click', onStartMarathonQuiz);
    root.querySelectorAll('[data-quiz-cat]').forEach((btn) => {
      btn.addEventListener('click', () => onStartCategoryQuiz(btn.dataset.quizCat));
    });
    return;
  }

  // Results Screen
  if (quizSession.index >= quizSession.questions.length) {
    const total = quizSession.questions.length;
    const pct = total > 0 ? Math.round((quizSession.scoreCount / total) * 100) : 0;
    root.innerHTML = `
      <div class="doodle-card" style="max-width:620px; margin:0 auto; text-align:center;">
        <div style="font-size:3.2rem; margin-bottom:0.4rem;" aria-hidden="true">${pct >= 70 ? '🏆' : '📝'}</div>
        <h1 style="font-size:2.1rem; margin-bottom:0.35rem;">Hasil Akhir Kuis</h1>
        <p class="ui-font" style="color:var(--ink-muted); margin-bottom:1.25rem;">${quizSession.title}</p>

        <div style="background:var(--bg-cream); border:2.5px solid var(--ink-black); border-radius:18px; padding:1.25rem; margin-bottom:1.35rem;" class="tabular-nums">
          <div style="font-size:2.4rem; font-family:var(--font-display); font-weight:700;" data-testid="quiz-final-score">Skor: ${pct}%</div>
          <p style="font-weight:700;">Jawaban Benar: ${quizSession.scoreCount} dari ${total} soal</p>
          <p style="color:#1F6B33; font-weight:800; margin-top:0.35rem;">Total XP Baru Diperoleh: +${quizSession.xpEarned} XP</p>
        </div>

        <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
          <button type="button" class="doodle-btn cream" id="quiz-exit-btn">Kembali ke Daftar Kuis</button>
          <button type="button" class="doodle-btn green" id="quiz-home-btn">Kembali ke Beranda</button>
        </div>
      </div>
    `;
    root.querySelector('#quiz-exit-btn')?.addEventListener('click', onExitQuiz);
    root.querySelector('#quiz-home-btn')?.addEventListener('click', onGoDashboard);
    return;
  }

  // Active Question Screen
  const q = quizSession.questions[quizSession.index];
  const alreadyClaimed = state.kuisSelesai.includes(q.id) && !quizSession.answered;
  const potentialXP = q.poin * (state.isPro ? 2 : 1);
  const progressPct = Math.round(((quizSession.index + (quizSession.answered ? 1 : 0)) / quizSession.questions.length) * 100);

  root.innerHTML = `
    <div style="max-width:740px; margin:0 auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
        <button type="button" class="doodle-btn cream sm" id="quiz-abort-btn">Keluar Kuis</button>
        <span class="ui-font tabular-nums">Soal ${quizSession.index + 1} dari ${quizSession.questions.length}</span>
      </div>

      <div class="sketch-progress-wrap" style="height:12px; margin-bottom:1rem;" aria-hidden="true">
        <div class="sketch-progress-fill" style="width:${progressPct}%; background:var(--doodle-blue);"></div>
      </div>

      <div class="doodle-card">
        <div class="meta-row" style="justify-content:space-between; margin-bottom:0.85rem;">
          <span>${quizSession.title}</span>
          <span class="tabular-nums" style="color:var(--ink-black);">
            ${alreadyClaimed ? 'Mode Latihan (Poin Sudah Diklaim)' : `Hadiah: +${potentialXP} XP`}
          </span>
        </div>

        <h2 style="font-size:1.58rem; margin-bottom:1.15rem;">${q.pertanyaan}</h2>

        <div>
          ${q.pilihanJawaban.map((opt, idx) => {
            let cls = 'quiz-option';
            if (quizSession.answered) {
              if (idx === q.jawabanBenar) cls += ' correct';
              else if (idx === quizSession.selectedOpt) cls += ' wrong';
            }
            return `
              <button type="button" class="${cls}" ${quizSession.answered ? 'disabled' : ''} data-quiz-opt="${idx}">
                <span class="option-letter">${['A', 'B', 'C', 'D'][idx]}</span>
                <span>${opt}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${quizSession.answered
          ? `
            <div data-testid="quiz-feedback" style="margin-top:1.1rem; padding:1rem; border-radius:14px; border:2.5px solid var(--ink-black); background:${quizSession.selectedOpt === q.jawabanBenar ? '#E4F7E7' : '#FDE8E5'};">
              <div class="ui-font" style="font-size:1.05rem; margin-bottom:0.3rem;">
                ${quizSession.selectedOpt === q.jawabanBenar ? 'Tepat Sekali!' : 'Kurang Tepat — Penjelasan Ilmiah:'}
              </div>
              <p style="font-size:0.96rem;">${q.penjelasan}</p>
              <div style="margin-top:0.95rem; text-align:right;">
                <button type="button" class="doodle-btn" id="quiz-next-btn">
                  ${quizSession.index + 1 < quizSession.questions.length ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}
                </button>
              </div>
            </div>
          `
          : ''
        }
      </div>
    </div>
  `;

  root.querySelector('#quiz-abort-btn')?.addEventListener('click', onExitQuiz);
  root.querySelector('#quiz-next-btn')?.addEventListener('click', onNextQuestion);
  root.querySelectorAll('[data-quiz-opt]').forEach((btn) => {
    btn.addEventListener('click', () => onSubmitAnswer(Number(btn.dataset.quizOpt)));
  });
}
