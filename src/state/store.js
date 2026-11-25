import {
  ACHIEVEMENTS_DATA,
  DAILY_CHALLENGES,
  MATERI_DATA,
  PRICING_PLANS,
  PROMO_CODES,
  QUIZ_DATA
} from '../data/curriculum.js';
import { getTodayDateString } from '../utils/formatters.js';

export const ACCOUNTS_DB_KEY = 'doodlelab_accounts_v2';
export const ACTIVE_SESSION_KEY = 'doodlelab_active_session_v2';
export const ADMIN_FEE = 2500;

export function createDefaultState(overrides = {}) {
  return {
    userId: overrides.userId || 'guest-local',
    email: overrides.email || '',
    emailVerified: Boolean(overrides.emailVerified),
    authProvider: overrides.authProvider || 'local',
    isGuest: overrides.isGuest !== undefined ? overrides.isGuest : true,
    namaAlias: overrides.namaAlias || 'Penjelajah Sains',
    isPro: Boolean(overrides.isPro),
    proPlanName: overrides.proPlanName || '',
    xp: Number(overrides.xp || 0),
    level: calculateLevel(Number(overrides.xp || 0)),
    totalPoin: Number(overrides.totalPoin || 0),
    badge: Array.isArray(overrides.badge) ? overrides.badge : [],
    materiSelesai: Array.isArray(overrides.materiSelesai) ? overrides.materiSelesai : [],
    kuisSelesai: Array.isArray(overrides.kuisSelesai) ? overrides.kuisSelesai : [],
    simulasiDicoba: Array.isArray(overrides.simulasiDicoba) ? overrides.simulasiDicoba : [],
    riwayatProgres: Array.isArray(overrides.riwayatProgres) ? overrides.riwayatProgres : [],
    transactions: Array.isArray(overrides.transactions) ? overrides.transactions : [],
    dailyChallenge: overrides.dailyChallenge || {
      tanggal: getTodayDateString(),
      selesai: false
    }
  };
}

export function calculateLevel(xp) {
  return Math.floor(Math.max(0, Number(xp || 0)) / 100) + 1;
}

export function calculateXpAward(baseAmount, isPro) {
  const safeBase = Math.max(0, Number(baseAmount || 0));
  const multiplier = isPro ? 2 : 1;
  return safeBase * multiplier;
}

export function evaluateAchievements(state) {
  const newlyUnlocked = [];
  for (const ach of ACHIEVEMENTS_DATA) {
    if (!state.badge.includes(ach.id) && ach.check(state)) {
      newlyUnlocked.push(ach);
    }
  }
  return newlyUnlocked;
}

export function getAccessibleQuizzes(isPro) {
  if (isPro) return QUIZ_DATA;
  const proMateriIds = new Set(MATERI_DATA.filter((m) => m.isPro).map((m) => m.id));
  return QUIZ_DATA.filter((q) => !proMateriIds.has(q.materiId));
}

export function getTodayChallenge(date = new Date()) {
  const idx = date.getDate() % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[idx];
}

export function normalizeDailyChallenge(state, todayStr = getTodayDateString()) {
  if (!state.dailyChallenge || state.dailyChallenge.tanggal !== todayStr) {
    return { tanggal: todayStr, selesai: false };
  }
  return state.dailyChallenge;
}

export function calculateCheckoutTotals(planId, promoCode = '') {
  const plan = PRICING_PLANS.find((p) => p.id === planId) || PRICING_PLANS[1];
  const subtotal = plan.harga;
  const normalizedCode = String(promoCode || '').trim().toUpperCase();
  const promo = normalizedCode && PROMO_CODES[normalizedCode]
    ? { code: normalizedCode, ...PROMO_CODES[normalizedCode] }
    : null;

  let discount = 0;
  if (promo) {
    if (promo.type === 'percent') {
      discount = Math.round(subtotal * (promo.value / 100));
    } else {
      discount = promo.value;
    }
    discount = Math.min(subtotal, Math.max(0, discount));
  }

  const total = Math.max(0, subtotal - discount + ADMIN_FEE);
  return {
    plan,
    promo,
    subtotal,
    discount,
    adminFee: ADMIN_FEE,
    total
  };
}

export function validateAuthInput({ mode, alias = '', email = '', password = '' }) {
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanAlias = String(alias).trim();
  const cleanPass = String(password);

  if (mode === 'register' && cleanAlias.length < 2) {
    return { valid: false, error: 'Nama alias minimal 2 karakter.' };
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { valid: false, error: 'Masukkan alamat email yang valid.' };
  }
  if (cleanPass.length < 6) {
    return { valid: false, error: 'Kata sandi minimal 6 karakter.' };
  }
  return {
    valid: true,
    alias: cleanAlias.slice(0, 24) || 'Ilmuwan Muda',
    email: cleanEmail,
    password: cleanPass
  };
}

export function getStorageAdapter(customStorage) {
  if (customStorage) return customStorage;
  if (typeof globalThis.localStorage !== 'undefined') return globalThis.localStorage;
  const mem = new Map();
  return {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v))
  };
}

export function createStore(storageInput) {
  const storage = getStorageAdapter(storageInput);

  function getAccountsMap() {
    try {
      return JSON.parse(storage.getItem(ACCOUNTS_DB_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveAccountsMap(map) {
    storage.setItem(ACCOUNTS_DB_KEY, JSON.stringify(map));
  }

  function getActiveUserKey() {
    return storage.getItem(ACTIVE_SESSION_KEY) || 'guest-local';
  }

  function setActiveUserKey(key) {
    storage.setItem(ACTIVE_SESSION_KEY, key);
  }

  function loadStateForUser(userKey) {
    const accounts = getAccountsMap();
    const raw = accounts[userKey];
    const base = createDefaultState({
      userId: userKey,
      isGuest: userKey === 'guest-local'
    });
    if (!raw || typeof raw !== 'object') {
      return base;
    }
    const merged = createDefaultState({ ...base, ...raw, userId: userKey });
    merged.dailyChallenge = normalizeDailyChallenge(merged);
    merged.level = calculateLevel(merged.xp);
    return merged;
  }

  let state = loadStateForUser(getActiveUserKey());

  function save() {
    state.level = calculateLevel(state.xp);
    const key = state.userId || 'guest-local';
    const accounts = getAccountsMap();
    accounts[key] = state;
    saveAccountsMap(accounts);
  }

  return {
    getState: () => state,
    setState: (next) => {
      state = createDefaultState(next);
      save();
      return state;
    },
    save,
    getAccountsMap,
    switchAccount: (userKey) => {
      setActiveUserKey(userKey);
      state = loadStateForUser(userKey);
      save();
      return state;
    },
    awardXP: (baseAmount) => {
      const earned = calculateXpAward(baseAmount, state.isPro);
      if (earned <= 0) return { earned: 0, leveledUp: false, newLevel: state.level, newBadges: [] };
      const oldLevel = state.level;
      state.xp += earned;
      state.totalPoin += earned;
      state.level = calculateLevel(state.xp);
      const newBadges = evaluateAchievements(state);
      for (const b of newBadges) state.badge.push(b.id);
      save();
      return {
        earned,
        leveledUp: state.level > oldLevel,
        newLevel: state.level,
        newBadges
      };
    },
    syncAchievements: () => {
      const newBadges = evaluateAchievements(state);
      if (newBadges.length > 0) {
        for (const b of newBadges) state.badge.push(b.id);
        save();
      }
      return newBadges;
    },
    resetProgress: () => {
      state = createDefaultState({
        userId: state.userId,
        email: state.email,
        emailVerified: state.emailVerified,
        authProvider: state.authProvider,
        isGuest: state.isGuest,
        namaAlias: state.namaAlias
      });
      save();
      return state;
    }
  };
}
