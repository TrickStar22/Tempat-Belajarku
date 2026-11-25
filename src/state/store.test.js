import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ADMIN_FEE,
  calculateCheckoutTotals,
  calculateLevel,
  calculateXpAward,
  createDefaultState,
  createStore,
  evaluateAchievements,
  getAccessibleQuizzes,
  normalizeDailyChallenge,
  validateAuthInput
} from './store.js';

test('calculateLevel computes 100 XP per level starting at Level 1', () => {
  assert.equal(calculateLevel(0), 1);
  assert.equal(calculateLevel(99), 1);
  assert.equal(calculateLevel(100), 2);
  assert.equal(calculateLevel(250), 3);
});

test('calculateXpAward doubles XP when user is PRO', () => {
  assert.equal(calculateXpAward(30, false), 30);
  assert.equal(calculateXpAward(30, true), 60);
  assert.equal(calculateXpAward(-10, true), 0);
});

test('calculateCheckoutTotals applies percentage and flat promo codes accurately', () => {
  const noPromo = calculateCheckoutTotals('yearly', '');
  assert.equal(noPromo.subtotal, 199000);
  assert.equal(noPromo.discount, 0);
  assert.equal(noPromo.total, 199000 + ADMIN_FEE);

  const percentPromo = calculateCheckoutTotals('yearly', 'doodle50');
  assert.equal(percentPromo.discount, 99500);
  assert.equal(percentPromo.total, 199000 - 99500 + ADMIN_FEE);

  const flatPromo = calculateCheckoutTotals('monthly', 'SAINSJUARA');
  assert.equal(flatPromo.discount, 10000);
  assert.equal(flatPromo.total, 29000 - 10000 + ADMIN_FEE);
});

test('getAccessibleQuizzes restricts PRO quizzes for free users and unlocks for PRO', () => {
  const freeQuizzes = getAccessibleQuizzes(false);
  const proQuizzes = getAccessibleQuizzes(true);
  assert.equal(freeQuizzes.length, 24);
  assert.equal(proQuizzes.length, 28);
});

test('evaluateAchievements unlocks expected badges as progress grows', () => {
  const s = createDefaultState({
    materiSelesai: ['fis-1', 'fis-2', 'fis-3'],
    kuisSelesai: Array.from({ length: 10 }, (_, i) => `q-${i + 1}`),
    simulasiDicoba: ['gravity', 'solar', 'circuit'],
    isPro: true
  });
  const unlockedIds = evaluateAchievements(s).map((b) => b.id);
  assert.ok(unlockedIds.includes('first_step'));
  assert.ok(unlockedIds.includes('fisika_master'));
  assert.ok(unlockedIds.includes('quiz_star'));
  assert.ok(unlockedIds.includes('sim_pro'));
  assert.ok(unlockedIds.includes('vip_scientist'));
});

test('normalizeDailyChallenge resets selesai flag on a new day', () => {
  const old = { dailyChallenge: { tanggal: '2025-01-01', selesai: true } };
  const normalized = normalizeDailyChallenge(old, '2025-01-02');
  assert.deepEqual(normalized, { tanggal: '2025-01-02', selesai: false });
});

test('validateAuthInput rejects invalid email, short alias, and short password', () => {
  assert.equal(validateAuthInput({ mode: 'register', alias: 'A', email: 'a@b.com', password: 'secret' }).valid, false);
  assert.equal(validateAuthInput({ mode: 'login', email: 'not-an-email', password: 'secret' }).valid, false);
  assert.equal(validateAuthInput({ mode: 'login', email: 'student@school.id', password: '123' }).valid, false);
  assert.equal(validateAuthInput({ mode: 'register', alias: 'Ilmuwan', email: 'student@school.id', password: 'password1' }).valid, true);
});

test('store persists awardXP, level up, and resetProgress while keeping identity', () => {
  const store = createStore();
  const res = store.awardXP(110);
  assert.equal(res.earned, 110);
  assert.equal(res.leveledUp, true);
  assert.equal(res.newLevel, 2);
  assert.equal(store.getState().xp, 110);

  store.setState({ ...store.getState(), email: 'test@doodle.id', isGuest: false, namaAlias: 'Budi' });
  store.resetProgress();
  assert.equal(store.getState().xp, 0);
  assert.equal(store.getState().level, 1);
  assert.equal(store.getState().namaAlias, 'Budi');
  assert.equal(store.getState().email, 'test@doodle.id');
});
