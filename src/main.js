import { renderHeader } from './components/header.js';
import { closeModal, openModal } from './components/modal.js';
import { showToast } from './components/toast.js';
import { MATERI_DATA, PROMO_CODES, QUIZ_DATA } from './data/curriculum.js';
import {
  auth,
  getPrimaryAuthProvider,
  loadUserFromFirestore,
  logoutFirebase,
  mapFirebaseAuthError,
  registerWithEmail,
  reloadCurrentUser,
  resendVerificationEmail,
  saveTransactionToFirestore,
  signInWithEmail,
  signInWithGoogle,
  subscribeAuthState,
  syncUserProgressToFirestore
} from './services/firebaseClient.js';
import {
  calculateCheckoutTotals,
  createDefaultState,
  createStore,
  getAccessibleQuizzes,
  getTodayChallenge,
  normalizeDailyChallenge,
  validateAuthInput
} from './state/store.js';
import { copyToClipboard, escapeHTML, formatCountdown, getTodayDateString } from './utils/formatters.js';
import { renderDashboardView } from './views/dashboardView.js';
import { renderMateriDetailView, renderMateriListView } from './views/materiView.js';
import { renderPencapaianView } from './views/pencapaianView.js';
import { renderPremiumView } from './views/premiumView.js';
import { renderQuizView } from './views/quizView.js';
import { renderSimulasiView } from './views/simulasiView.js';

const store = createStore();
store.syncAchievements();

function persistCloudProgress(newTransaction = null) {
  const user = auth.currentUser;
  if (!user || !user.emailVerified) return;

  const snapshot = store.getState();
  syncUserProgressToFirestore(user, snapshot)
    .then(() => {
      if (newTransaction) {
        return saveTransactionToFirestore(user, newTransaction);
      }
      return null;
    })
    .catch(() => {
      showToast('⚠️', 'Progres tersimpan lokal; sinkronisasi cloud tertunda.', 'var(--soft-coral)');
    });
}

const urlParams = new URLSearchParams(window.location.search);
const validViews = new Set(['dashboard', 'materi', 'kuis', 'simulasi', 'pencapaian', 'premium']);
const initialView = urlParams.get('view') && validViews.has(urlParams.get('view'))
  ? urlParams.get('view')
  : 'dashboard';

let currentView = initialView;
let selectedCategory = 'Semua';
let activeMateriId = MATERI_DATA[0].id;
let activeSimId = 'gravity';
let mobileMenuOpen = false;
let simCleanup = null;
let paymentTimerInterval = null;

let quizSession = {
  active: false,
  title: '',
  questions: [],
  index: 0,
  scoreCount: 0,
  xpEarned: 0,
  answered: false,
  selectedOpt: null
};

const checkoutState = {
  selectedPlanId: 'yearly',
  promoInput: '',
  appliedPromo: null,
  paymentCategory: 'qris',
  paymentSubMethod: 'QRIS Instan',
  step: 'select',
  activeOrder: null,
  secondsLeft: 900
};

function cleanupActiveEffects() {
  if (typeof simCleanup === 'function') {
    simCleanup();
    simCleanup = null;
  }
  if (paymentTimerInterval) {
    window.clearInterval(paymentTimerInterval);
    paymentTimerInterval = null;
  }
}

function awardXPWithFeedback(baseAmount, reasonText, options = {}) {
  const result = store.awardXP(baseAmount);
  if (result.earned <= 0) return result;

  const state = store.getState();
  const bonusTag = state.isPro ? ' (2x PRO)' : '';
  showToast('✨', `+${result.earned} XP${bonusTag} · ${reasonText}`, 'var(--science-green)');

  for (const badge of result.newBadges) {
    window.setTimeout(() => {
      showToast(badge.icon, `Badge Baru: ${badge.nama}`, 'var(--playful-purple)');
    }, 400);
  }

  if (result.leveledUp && !options.suppressLevelModal) {
    window.setTimeout(() => {
      openModal(`
        <h2 id="modal-title" style="font-size:2.1rem; margin-bottom:0.4rem;">Naik ke Level ${result.newLevel}!</h2>
        <p style="margin:0.65rem 0 1.25rem; font-weight:600;">
          Luar biasa, <b>${escapeHTML(state.namaAlias)}</b>! Rasa ingin tahumu membuatmu semakin mahir dalam sains.
        </p>
        <button type="button" class="doodle-btn green" id="modal-level-ok">Lanjutkan Petualangan</button>
      `, (dialog) => {
        dialog.querySelector('#modal-level-ok')?.addEventListener('click', closeModal);
      });
    }, 350);
  }

  return result;
}

function navigate(view, params = {}) {
  cleanupActiveEffects();
  currentView = view;
  mobileMenuOpen = false;

  if (params.category) selectedCategory = params.category;
  if (params.materiId) activeMateriId = params.materiId;
  if (params.simId) activeSimId = params.simId;

  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================================
   MODALS: ALIAS, AUTH, RESET, PRO GATE
   ============================================================================ */

function openEditAliasModal() {
  const state = store.getState();
  openModal(`
    <h2 id="modal-title" style="font-size:1.85rem; margin-bottom:0.45rem;">Ubah Nama Alias Ilmuwan</h2>
    <p style="font-size:0.95rem; color:var(--ink-muted); margin-bottom:1rem;">Gunakan nama panggilan kreatif untuk profil belajarmu.</p>
    <form id="alias-form">
      <label class="field-label" for="alias-input" style="text-align:left;">Nama Alias</label>
      <input id="alias-input" class="doodle-input" type="text" maxlength="24" value="${escapeHTML(state.namaAlias)}" style="margin-bottom:1.1rem;" required />
      <div style="display:flex; gap:0.6rem; justify-content:center;">
        <button type="button" class="doodle-btn cream" id="alias-cancel-btn">Batal</button>
        <button type="submit" class="doodle-btn green">Simpan Nama</button>
      </div>
    </form>
  `, (dialog) => {
    const input = dialog.querySelector('#alias-input');
    input?.focus();
    dialog.querySelector('#alias-cancel-btn')?.addEventListener('click', closeModal);
    dialog.querySelector('#alias-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = (input?.value || '').trim();
      if (val) {
        const next = store.getState();
        next.namaAlias = val.slice(0, 24);
        store.setState(next);
        persistCloudProgress();
        showToast('🪪', `Halo, ${next.namaAlias}!`);
      }
      closeModal();
      renderApp();
    });
  });
}

function openVerifyEmailModal() {
  const state = store.getState();
  openModal(`
    <h2 id="modal-title" style="font-size:1.85rem; margin-bottom:0.45rem;">Verifikasi Email Akun</h2>
    <p style="font-size:0.95rem; color:var(--ink-muted); margin-bottom:1.1rem;">
      Klik tautan verifikasi yang dikirim ke <b>${escapeHTML(state.email)}</b> agar progres belajarmu tersimpan otomatis ke Cloud Firestore.
    </p>
    <div id="verify-status-msg" class="form-error" style="display:none;" role="status"></div>
    <div style="display:flex; gap:0.6rem; justify-content:center; flex-wrap:wrap;">
      <button type="button" class="doodle-btn cream" id="verify-resend-btn">Kirim Ulang Email</button>
      <button type="button" class="doodle-btn green" id="verify-check-btn">Saya Sudah Verifikasi</button>
    </div>
  `, (dialog) => {
    const statusBox = dialog.querySelector('#verify-status-msg');
    dialog.querySelector('#verify-resend-btn')?.addEventListener('click', async () => {
      try {
        await resendVerificationEmail();
        showToast('📧', 'Email verifikasi telah dikirim ulang.', 'var(--doodle-blue)');
      } catch (err) {
        if (statusBox) {
          statusBox.textContent = mapFirebaseAuthError(err);
          statusBox.style.display = 'block';
        }
      }
    });
    dialog.querySelector('#verify-check-btn')?.addEventListener('click', async () => {
      try {
        const refreshed = await reloadCurrentUser();
        if (refreshed?.emailVerified) {
          const cur = store.getState();
          cur.emailVerified = true;
          store.setState(cur);
          await syncUserProgressToFirestore(refreshed, store.getState());
          closeModal();
          showToast('✅', 'Email terverifikasi! Progres disinkronkan ke cloud.', 'var(--science-green)');
          renderApp();
        } else if (statusBox) {
          statusBox.textContent = 'Email belum terverifikasi. Pastikan Anda sudah membuka tautan di kotak masuk atau folder spam.';
          statusBox.style.display = 'block';
        }
      } catch (err) {
        if (statusBox) {
          statusBox.textContent = mapFirebaseAuthError(err);
          statusBox.style.display = 'block';
        }
      }
    });
  });
}

function openAuthModal(initialTab = 'login') {
  let tab = initialTab;
  let busy = false;

  function renderAuthBody(dialog) {
    const isLogin = tab === 'login';
    dialog.innerHTML = `
      <div style="text-align:left;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.85rem;">
          <h2 id="modal-title" style="font-size:1.85rem;">Akun Ilmuwan DoodleLab</h2>
          <button type="button" class="doodle-btn cream sm" id="auth-close-btn" aria-label="Tutup dialog akun">Tutup</button>
        </div>

        <button type="button" class="doodle-btn google-auth-btn" id="auth-google-btn" data-testid="google-login-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.87c2.26-2.08 3.57-5.15 3.57-8.64Z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.1A12 12 0 0 0 12 24Z"/>
            <path fill="#FBBC05" d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.29v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l4-3.1Z"/>
            <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.61l4 3.1C6.23 6.87 8.88 4.76 12 4.76Z"/>
          </svg>
          <span>Masuk dengan Google</span>
        </button>

        <div class="auth-divider"><span>atau gunakan email</span></div>

        <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
          <button type="button" class="doodle-btn sm ${isLogin ? '' : 'cream'}" style="flex:1;" id="auth-tab-login">Masuk Akun</button>
          <button type="button" class="doodle-btn sm ${!isLogin ? '' : 'cream'}" style="flex:1;" id="auth-tab-register">Daftar Baru</button>
        </div>

        <div id="auth-error-msg" class="form-error" style="display:none;" role="alert"></div>

        <form id="auth-form" novalidate>
          ${!isLogin
            ? `
              <div style="margin-bottom:0.75rem;">
                <label class="field-label" for="auth-alias">Nama Panggilan / Alias</label>
                <input id="auth-alias" class="doodle-input" type="text" maxlength="24" placeholder="Contoh: Ilmuwan Bintang" />
              </div>
            `
            : ''
          }

          <div style="margin-bottom:0.75rem;">
            <label class="field-label" for="auth-email">Email Pelajar / Guru</label>
            <input id="auth-email" class="doodle-input" type="email" placeholder="nama@sekolah.sch.id" />
          </div>

          <div style="margin-bottom:1rem;">
            <label class="field-label" for="auth-pass">Kata Sandi</label>
            <input id="auth-pass" class="doodle-input" type="password" placeholder="Minimal 6 karakter" />
          </div>

          <button type="submit" class="doodle-btn green" id="auth-submit-btn" style="width:100%; margin-bottom:0.85rem;">
            ${isLogin ? 'Masuk & Muat Progres' : 'Buat Akun & Mulai Belajar'}
          </button>
        </form>

        <div style="text-align:center; border-top:2px dashed var(--ink-black); padding-top:0.8rem;">
          <p style="font-size:0.84rem; color:var(--ink-muted); margin-bottom:0.5rem;">Ingin langsung mencoba tanpa membuat akun?</p>
          <button type="button" class="doodle-btn cream sm" style="width:100%;" id="auth-guest-btn">Lanjut sebagai Tamu Lokal</button>
        </div>
      </div>
    `;

    const setBusy = (nextBusy) => {
      busy = nextBusy;
      const gBtn = dialog.querySelector('#auth-google-btn');
      const sBtn = dialog.querySelector('#auth-submit-btn');
      if (gBtn) gBtn.disabled = nextBusy;
      if (sBtn) {
        sBtn.disabled = nextBusy;
        sBtn.textContent = nextBusy
          ? 'Menghubungkan ke Firebase...'
          : (isLogin ? 'Masuk & Muat Progres' : 'Buat Akun & Mulai Belajar');
      }
    };

    const showErr = (msg) => {
      const box = dialog.querySelector('#auth-error-msg');
      if (box) {
        box.textContent = msg;
        box.style.display = 'block';
      }
    };

    dialog.querySelector('#auth-close-btn')?.addEventListener('click', closeModal);
    dialog.querySelector('#auth-tab-login')?.addEventListener('click', () => {
      if (busy) return;
      tab = 'login';
      renderAuthBody(dialog);
    });
    dialog.querySelector('#auth-tab-register')?.addEventListener('click', () => {
      if (busy) return;
      tab = 'register';
      renderAuthBody(dialog);
    });

    dialog.querySelector('#auth-google-btn')?.addEventListener('click', async () => {
      if (busy) return;
      setBusy(true);
      try {
        const user = await signInWithGoogle();
        closeModal();
        showToast('🔑', `Selamat datang, ${user.displayName || 'Ilmuwan Sains'}!`, 'var(--science-green)');
      } catch (err) {
        showErr(mapFirebaseAuthError(err));
        setBusy(false);
      }
    });

    dialog.querySelector('#auth-guest-btn')?.addEventListener('click', async () => {
      if (busy) return;
      try {
        await logoutFirebase();
      } catch {
        // Tetap lanjut ke mode tamu lokal
      }
      store.switchAccount('guest-local');
      closeModal();
      showToast('🧪', 'Masuk dalam Mode Tamu Lokal', 'var(--doodle-blue)');
      renderApp();
    });

    dialog.querySelector('#auth-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (busy) return;
      const alias = dialog.querySelector('#auth-alias')?.value || '';
      const email = dialog.querySelector('#auth-email')?.value || '';
      const password = dialog.querySelector('#auth-pass')?.value || '';

      const check = validateAuthInput({
        mode: isLogin ? 'login' : 'register',
        alias,
        email,
        password
      });
      if (!check.valid) {
        showErr(check.error);
        return;
      }

      setBusy(true);
      try {
        if (isLogin) {
          const user = await signInWithEmail(check.email, check.password);
          closeModal();
          if (user.emailVerified) {
            showToast('🔑', `Selamat datang kembali, ${user.displayName || check.email}!`, 'var(--science-green)');
          } else {
            showToast('📧', 'Masuk berhasil. Verifikasi emailmu untuk sinkronisasi cloud.', 'var(--warm-yellow)');
          }
        } else {
          const user = await registerWithEmail(check.alias, check.email, check.password);
          closeModal();
          showToast('🎉', `Akun ${user.displayName || check.alias} dibuat! Cek email untuk verifikasi.`, 'var(--science-green)');
        }
      } catch (err) {
        showErr(mapFirebaseAuthError(err));
        setBusy(false);
      }
    });
  }

  openModal('', renderAuthBody);
}

async function handleLogout() {
  try {
    await logoutFirebase();
  } catch {
    // Tetap kembalikan sesi lokal ke Mode Tamu
  }
  store.switchAccount('guest-local');
  showToast('👋', 'Berhasil keluar ke Mode Tamu.', 'var(--warm-yellow)');
  navigate('dashboard');
}

function openProGateModal(title, description) {
  openModal(`
    <div style="font-size:3rem; margin-bottom:0.35rem;" aria-hidden="true">👑</div>
    <h2 id="modal-title" style="font-size:1.9rem; margin-bottom:0.5rem;">${escapeHTML(title)}</h2>
    <p style="font-size:0.96rem; color:var(--ink-muted); margin-bottom:1.25rem;">${description}</p>
    <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
      <button type="button" class="doodle-btn cream" id="pro-gate-cancel">Nanti Saja</button>
      <button type="button" class="doodle-btn" id="pro-gate-upgrade">Lihat Paket PRO</button>
    </div>
  `, (dialog) => {
    dialog.querySelector('#pro-gate-cancel')?.addEventListener('click', closeModal);
    dialog.querySelector('#pro-gate-upgrade')?.addEventListener('click', () => {
      closeModal();
      navigate('premium');
    });
  });
}

function openResetConfirmModal() {
  openModal(`
    <h2 id="modal-title" style="font-size:1.85rem; margin-bottom:0.5rem;">Reset Seluruh Progres?</h2>
    <p style="font-size:0.96rem; color:var(--ink-muted); margin-bottom:1.25rem;">
      Semua XP, Level, materi selesai, kuis, dan stiker badge pada akun ini akan dikembalikan ke awal.
    </p>
    <div style="display:flex; gap:0.75rem; justify-content:center;">
      <button type="button" class="doodle-btn cream" id="reset-cancel-btn">Batal</button>
      <button type="button" class="doodle-btn coral" id="reset-confirm-btn">Ya, Hapus Semua</button>
    </div>
  `, (dialog) => {
    dialog.querySelector('#reset-cancel-btn')?.addEventListener('click', closeModal);
    dialog.querySelector('#reset-confirm-btn')?.addEventListener('click', () => {
      store.resetProgress();
      persistCloudProgress();
      closeModal();
      showToast('🧹', 'Seluruh progres berhasil direset.', 'var(--soft-coral)');
      renderApp();
    });
  });
}

/* ============================================================================
   QUIZ & DAILY CHALLENGE HANDLERS
   ============================================================================ */

function launchQuiz(title, questions) {
  quizSession = {
    active: true,
    title,
    questions,
    index: 0,
    scoreCount: 0,
    xpEarned: 0,
    answered: false,
    selectedOpt: null
  };
  navigate('kuis');
}

function startQuickAllQuiz() {
  const pool = getAccessibleQuizzes(store.getState().isPro);
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
  launchQuiz('Tantangan Kuis Sains Campuran (10 Soal)', shuffled);
}

function startQuizByMateri(materiId) {
  const m = MATERI_DATA.find((item) => item.id === materiId);
  const qs = QUIZ_DATA.filter((q) => q.materiId === materiId);
  launchQuiz(`Kuis: ${m ? m.judul : 'Topik Sains'}`, qs);
}

function startQuizByCategory(cat) {
  const state = store.getState();
  const matIds = MATERI_DATA
    .filter((m) => m.kategori === cat && (!m.isPro || state.isPro))
    .map((m) => m.id);
  const qs = QUIZ_DATA.filter((q) => matIds.includes(q.materiId));
  launchQuiz(`Kuis Kategori ${cat}`, qs);
}

/* ============================================================================
   CHECKOUT & PAYMENT FLOW
   ============================================================================ */

function startCountdownTimer() {
  if (paymentTimerInterval) window.clearInterval(paymentTimerInterval);
  paymentTimerInterval = window.setInterval(() => {
    if (checkoutState.secondsLeft > 0) {
      checkoutState.secondsLeft -= 1;
      const timerEl = document.getElementById('pay-countdown');
      if (timerEl) timerEl.textContent = formatCountdown(checkoutState.secondsLeft);
    }
  }, 1000);
}

/* ============================================================================
   MAIN RENDER DISPATCHER
   ============================================================================ */

export function renderApp() {
  const state = store.getState();
  const root = document.getElementById('app-root');
  if (!root) return;

  cleanupActiveEffects();

  renderHeader({
    state,
    currentView,
    mobileMenuOpen,
    onNavigate: (view) => navigate(view),
    onOpenAuth: (tab) => openAuthModal(tab),
    onLogout: handleLogout,
    onToggleMobileMenu: () => {
      mobileMenuOpen = !mobileMenuOpen;
      renderHeader({
        state,
        currentView,
        mobileMenuOpen,
        onNavigate: (view) => navigate(view),
        onOpenAuth: (tab) => openAuthModal(tab),
        onLogout: handleLogout,
        onToggleMobileMenu: () => {
          mobileMenuOpen = !mobileMenuOpen;
          renderApp();
        }
      });
    }
  });

  if (currentView === 'dashboard') {
    renderDashboardView(root, {
      state,
      onNavigate: navigate,
      onEditAlias: openEditAliasModal,
      onStartQuickQuiz: startQuickAllQuiz,
      onAnswerDailyChallenge: (idx) => {
        const cur = store.getState();
        if (cur.dailyChallenge.selesai) return;
        const dc = getTodayChallenge();
        if (idx === dc.benar) {
          cur.dailyChallenge.selesai = true;
          store.setState(cur);
          awardXPWithFeedback(dc.xp, 'Daily Challenge Selesai');
          persistCloudProgress();
          renderApp();
        } else {
          showToast('🤔', 'Belum tepat, coba pikirkan lagi!', 'var(--soft-coral)');
        }
      }
    });
  } else if (currentView === 'materi') {
    renderMateriListView(root, {
      state,
      selectedCategory,
      onSelectCategory: (cat) => navigate('materi', { category: cat }),
      onOpenMateri: (materiId) => {
        const m = MATERI_DATA.find((item) => item.id === materiId);
        if (!m) return;
        if (m.isPro && !store.getState().isPro) {
          openProGateModal(
            'Materi Eksklusif DoodleLab PRO',
            `Materi <b>"${escapeHTML(m.judul)}"</b> tersedia khusus untuk member <b>DoodleLab PRO</b>. Upgrade sekarang untuk membuka seluruh materi lanjutan dan simulator premium.`
          );
          return;
        }
        navigate('materi-detail', { materiId });
      }
    });
  } else if (currentView === 'materi-detail') {
    renderMateriDetailView(root, {
      state,
      activeMateriId,
      onBack: () => navigate('materi'),
      onCompleteMateri: (materiId) => {
        const cur = store.getState();
        if (cur.materiSelesai.includes(materiId)) return;
        cur.materiSelesai.push(materiId);
        cur.riwayatProgres.unshift({
          pemainId: cur.userId,
          materiId,
          skor: 100,
          status: 'Selesai',
          tanggalPenyelesaian: getTodayDateString()
        });
        store.setState(cur);
        awardXPWithFeedback(30, 'Materi Sains Diselesaikan');
        persistCloudProgress();
        renderApp();
      },
      onStartQuiz: startQuizByMateri,
      onOpenSim: (simId) => navigate('simulasi', { simId })
    });
  } else if (currentView === 'kuis') {
    renderQuizView(root, {
      state,
      quizSession,
      onStartQuickQuiz: startQuickAllQuiz,
      onStartMarathonQuiz: () => {
        const pool = getAccessibleQuizzes(store.getState().isPro);
        launchQuiz(`Maraton Lengkap ${pool.length} Soal Sains`, pool);
      },
      onStartCategoryQuiz: startQuizByCategory,
      onSubmitAnswer: (optIndex) => {
        if (quizSession.answered) return;
        const q = quizSession.questions[quizSession.index];
        quizSession.answered = true;
        quizSession.selectedOpt = optIndex;

        if (optIndex === q.jawabanBenar) {
          quizSession.scoreCount += 1;
          const cur = store.getState();
          if (!cur.kuisSelesai.includes(q.id)) {
            cur.kuisSelesai.push(q.id);
            store.setState(cur);
            const res = awardXPWithFeedback(q.poin, 'Jawaban Kuis Tepat');
            quizSession.xpEarned += res.earned;
            persistCloudProgress();
          } else {
            showToast('✔️', 'Benar! (Poin soal ini sudah pernah diklaim)', 'var(--doodle-blue)');
          }
        }
        renderApp();
      },
      onNextQuestion: () => {
        quizSession.index += 1;
        quizSession.answered = false;
        quizSession.selectedOpt = null;
        renderApp();
      },
      onExitQuiz: () => {
        quizSession.active = false;
        renderApp();
      },
      onGoDashboard: () => {
        quizSession.active = false;
        navigate('dashboard');
      }
    });
  } else if (currentView === 'simulasi') {
    simCleanup = renderSimulasiView(root, {
      state,
      activeSimId,
      onSelectSim: (simId) => {
        if (simId === 'optics' && !store.getState().isPro) {
          openProGateModal(
            'Wave & Optics Lab (PRO)',
            'Simulator <b>Interferensi Gelombang &amp; Pembiasan Prisma Cahaya</b> adalah fasilitas eksklusif member <b>DoodleLab PRO</b>.'
          );
          return;
        }
        navigate('simulasi', { simId });
      },
      onMarkSimTried: (simId) => {
        const cur = store.getState();
        if (!cur.simulasiDicoba.includes(simId)) {
          cur.simulasiDicoba.push(simId);
          store.setState(cur);
          awardXPWithFeedback(25, 'Mencoba Eksperimen Simulasi');
          persistCloudProgress();
        }
      }
    });
  } else if (currentView === 'pencapaian') {
    renderPencapaianView(root, {
      state,
      onEditAlias: openEditAliasModal,
      onConfirmReset: openResetConfirmModal
    });
  } else if (currentView === 'premium') {
    renderPremiumView(root, {
      state,
      checkoutState,
      onSelectPlan: (planId) => {
        checkoutState.selectedPlanId = planId;
        renderApp();
      },
      onSelectPayment: (cat, sub) => {
        checkoutState.paymentCategory = cat;
        checkoutState.paymentSubMethod = sub;
        renderApp();
      },
      onApplyPromo: (rawCode) => {
        const code = String(rawCode || '').trim().toUpperCase();
        checkoutState.promoInput = code;
        if (PROMO_CODES[code]) {
          checkoutState.appliedPromo = { code, ...PROMO_CODES[code] };
          showToast('🎟️', `Kode promo ${code} berhasil diterapkan`, 'var(--science-green)');
        } else {
          checkoutState.appliedPromo = null;
          showToast('❌', 'Kode promo tidak valid (Coba: DOODLE50 atau SAINSJUARA)', 'var(--soft-coral)');
        }
        renderApp();
      },
      onCreateOrder: () => {
        const { plan, subtotal, discount, adminFee, total } = calculateCheckoutTotals(
          checkoutState.selectedPlanId,
          checkoutState.appliedPromo ? checkoutState.appliedPromo.code : ''
        );
        const invNumber = 'INV-DL-' + Date.now().toString();
        const vaNumber = '8801' + Math.floor(1000000000 + Math.random() * 9000000000);
        checkoutState.activeOrder = {
          invoiceId: invNumber,
          tanggal: new Date().toLocaleString('id-ID'),
          planId: plan.id,
          planName: plan.nama,
          subtotal,
          discount,
          adminFee,
          total,
          method: `${checkoutState.paymentCategory.toUpperCase()} — ${checkoutState.paymentSubMethod}`,
          vaNumber,
          status: 'Menunggu Pembayaran'
        };
        checkoutState.step = 'awaiting';
        checkoutState.secondsLeft = 900;
        renderApp();
        startCountdownTimer();
      },
      onBackToSelect: () => {
        checkoutState.step = 'select';
        renderApp();
      },
      onCopyVA: async (va) => {
        await copyToClipboard(va);
        showToast('📋', 'Nomor Virtual Account disalin ke clipboard', 'var(--doodle-blue)');
      },
      onSimulatePaymentSuccess: () => {
        if (!checkoutState.activeOrder) return;
        cleanupActiveEffects();

        const completedOrder = {
          ...checkoutState.activeOrder,
          status: 'LUNAS (Paid)',
          paidAt: new Date().toLocaleString('id-ID')
        };

        const cur = store.getState();
        cur.isPro = true;
        cur.proPlanName = completedOrder.planName;
        cur.transactions.unshift(completedOrder);
        store.setState(cur);

        checkoutState.activeOrder = completedOrder;
        checkoutState.step = 'receipt';

        const xpRes = awardXPWithFeedback(100, 'Aktivasi DoodleLab PRO VIP', { suppressLevelModal: true });
        persistCloudProgress(completedOrder);

        openModal(`
          <div style="font-size:3.2rem; margin-bottom:0.35rem;" aria-hidden="true">👑</div>
          <h2 id="modal-title" style="font-size:2rem; margin-bottom:0.4rem;">Pembayaran Berhasil!</h2>
          <p style="font-weight:700; margin-bottom:1rem;">
            Selamat, <b>${escapeHTML(cur.namaAlias)}</b>! Akunmu kini berstatus <b>DoodleLab PRO</b>${xpRes.leveledUp ? ` dan naik ke Level ${xpRes.newLevel}` : ''}.
          </p>
          <div style="background:var(--bg-cream); border:2px dashed var(--ink-black); border-radius:14px; padding:0.9rem; margin-bottom:1.15rem; font-size:0.92rem; text-align:left;">
            ✓ 4 Materi Sains Lanjutan PRO Terbuka<br />
            ✓ Wave &amp; Optics Lab Simulator Aktif<br />
            ✓ Bonus 2x XP &amp; Lencana VIP Scientist
          </div>
          <button type="button" class="doodle-btn green" id="pay-success-ok">Lihat Struk Digital</button>
        `, (dialog) => {
          dialog.querySelector('#pay-success-ok')?.addEventListener('click', closeModal);
        });

        renderApp();
      },
      onViewReceipt: (txIndex) => {
        const cur = store.getState();
        if (cur.transactions[txIndex]) {
          checkoutState.activeOrder = cur.transactions[txIndex];
          checkoutState.step = 'receipt';
          renderApp();
        }
      },
      onExploreProMateri: () => {
        checkoutState.step = 'select';
        navigate('materi');
      }
    });
  }

  document.getElementById('btn-verify-email')?.addEventListener('click', openVerifyEmailModal);
}

subscribeAuthState(async (user) => {
  if (user) {
    const fallbackAlias = (user.displayName || user.email?.split('@')[0] || 'Ilmuwan Sains').trim().slice(0, 24);
    store.switchAccount(user.uid);
    const localCur = store.getState();
    localCur.userId = user.uid;
    localCur.email = user.email || '';
    localCur.emailVerified = Boolean(user.emailVerified);
    localCur.authProvider = getPrimaryAuthProvider(user);
    localCur.isGuest = false;
    if (!localCur.namaAlias || localCur.namaAlias === 'Penjelajah Sains') {
      localCur.namaAlias = fallbackAlias || 'Ilmuwan Sains';
    }
    store.setState(localCur);
    renderApp();

    if (user.emailVerified) {
      try {
        const cloud = await loadUserFromFirestore(user);
        if (cloud.exists && cloud.progress) {
          const merged = createDefaultState({
            ...store.getState(),
            ...cloud.progress,
            userId: user.uid,
            email: user.email || '',
            emailVerified: true,
            authProvider: getPrimaryAuthProvider(user),
            isGuest: false,
            transactions: cloud.transactions.length > 0 ? cloud.transactions : store.getState().transactions
          });
          const normalizedDc = normalizeDailyChallenge(merged);
          const dateRolledOver = normalizedDc.tanggal !== cloud.progress.dailyChallenge?.tanggal;
          merged.dailyChallenge = normalizedDc;
          store.setState(merged);
          if (dateRolledOver) {
            await syncUserProgressToFirestore(user, merged);
          }
          renderApp();
        } else {
          await syncUserProgressToFirestore(user, store.getState());
        }
      } catch {
        showToast('⚠️', 'Gagal memuat progres dari cloud. Menggunakan data lokal.', 'var(--soft-coral)');
      }
    }
  } else if (store.getState().userId !== 'guest-local') {
    store.switchAccount('guest-local');
    renderApp();
  }
});

renderApp();
