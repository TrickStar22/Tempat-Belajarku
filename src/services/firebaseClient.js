import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { getTodayDateString } from '../utils/formatters.js';

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const OperationType = Object.freeze({
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write'
});

export function handleFirestoreError(error, operationType, path) {
  const currentUser = auth.currentUser;
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid ?? null,
      email: currentUser?.email ?? null,
      emailVerified: currentUser?.emailVerified ?? null,
      isAnonymous: currentUser?.isAnonymous ?? null,
      tenantId: currentUser?.tenantId ?? null,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId ?? null,
          email: provider.email ?? null
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

/* ============================================================================
   AUTH OPERATIONS (Google Popup & Email/Password)
   ============================================================================ */

export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider);
  return credential.user;
}

export async function signInWithEmail(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function registerWithEmail(alias, email, password) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const cleanAlias = String(alias || '').trim().slice(0, 24) || 'Ilmuwan Muda';
  await updateProfile(credential.user, { displayName: cleanAlias });
  try {
    await sendEmailVerification(credential.user);
  } catch {
    // Tetap lanjutkan pembuatan akun meski pengiriman email verifikasi tertunda
  }
  return credential.user;
}

export async function resendVerificationEmail() {
  if (!auth.currentUser) return false;
  await sendEmailVerification(auth.currentUser);
  return true;
}

export async function reloadCurrentUser() {
  if (!auth.currentUser) return null;
  await auth.currentUser.reload();
  return auth.currentUser;
}

export async function logoutFirebase() {
  if (auth.currentUser) {
    await signOut(auth);
  }
}

export function subscribeAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

export function mapFirebaseAuthError(error) {
  const code = error && typeof error === 'object' ? error.code : '';
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Jendela login Google ditutup sebelum selesai. Silakan coba lagi.';
    case 'auth/popup-blocked':
      return 'Pop-up login diblokir oleh browser. Izinkan pop-up untuk melanjutkan masuk dengan Google.';
    case 'auth/cancelled-popup-request':
      return 'Permintaan login sebelumnya dibatalkan. Silakan klik tombol Masuk dengan Google lagi.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email atau kata sandi tidak cocok. Periksa kembali atau gunakan Masuk dengan Google.';
    case 'auth/email-already-in-use':
      return 'Email ini sudah terdaftar. Silakan masuk melalui tab Masuk Akun atau gunakan Google.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter kombinasi huruf dan angka.';
    case 'auth/invalid-email':
      return 'Format alamat email tidak valid.';
    case 'auth/operation-not-allowed':
      return 'Login Email/Kata Sandi belum diaktifkan di Firebase Console. Gunakan "Masuk dengan Google" atau aktifkan penyedia Email/Password di Firebase Authentication.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan login. Tunggu beberapa saat sebelum mencoba lagi.';
    case 'auth/network-request-failed':
      return 'Koneksi internet bermasalah. Periksa jaringan Anda lalu coba lagi.';
    default:
      return error instanceof Error && error.message
        ? `Gagal autentikasi: ${error.message}`
        : 'Terjadi kesalahan saat masuk ke akun Firebase.';
  }
}

/* ============================================================================
   FIRESTORE SANITIZATION & CLOUD SYNC
   ============================================================================ */

function sanitizeStringArray(arr, maxLen) {
  if (!Array.isArray(arr)) return [];
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    if (typeof item === 'string' && item.length > 0 && !seen.has(item)) {
      seen.add(item);
      out.push(item.slice(0, 80));
      if (out.length >= maxLen) break;
    }
  }
  return out;
}

function buildUserProgressFields(state, fallbackAlias = 'Penjelajah Sains') {
  const rawAlias = String(state.namaAlias || fallbackAlias || 'Penjelajah Sains').trim();
  const namaAlias = (rawAlias || 'Penjelajah Sains').slice(0, 24);
  const xp = Math.min(10000000, Math.max(0, Math.round(Number(state.xp || 0))));
  const level = Math.min(100000, Math.max(1, Math.floor(xp / 100) + 1));
  const totalPoin = Math.min(10000000, Math.max(0, Math.round(Number(state.totalPoin || 0))));
  const rawDate = String(state.dailyChallenge?.tanggal || getTodayDateString()).slice(0, 20);
  const tanggal = rawDate.length >= 8 ? rawDate : getTodayDateString();

  return {
    namaAlias,
    isPro: Boolean(state.isPro),
    proPlanName: String(state.proPlanName || '').slice(0, 80),
    xp,
    level,
    totalPoin,
    badge: sanitizeStringArray(state.badge, 20),
    materiSelesai: sanitizeStringArray(state.materiSelesai, 40),
    kuisSelesai: sanitizeStringArray(state.kuisSelesai, 100),
    simulasiDicoba: sanitizeStringArray(state.simulasiDicoba, 20),
    dailyChallenge: {
      tanggal,
      selesai: Boolean(state.dailyChallenge?.selesai)
    }
  };
}

export function getPrimaryAuthProvider(user) {
  if (!user) return 'local';
  const pid = user.providerData?.[0]?.providerId || 'firebase';
  return String(pid).slice(0, 40);
}

export async function syncUserProgressToFirestore(user, state) {
  if (!user || !user.emailVerified) return null;

  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);
  const fields = buildUserProgressFields(state, user.displayName || 'Ilmuwan Sains');

  let existingSnap;
  try {
    existingSnap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }

  if (!existingSnap.exists()) {
    const createPayload = {
      userId: user.uid,
      ...fields,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    try {
      await setDoc(userRef, createPayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, userPath);
    }
  } else {
    const updatePayload = {
      ...fields,
      updatedAt: serverTimestamp()
    };
    try {
      await updateDoc(userRef, updatePayload);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, userPath);
    }
  }

  await syncPrivateAccountToFirestore(user);
  return fields;
}

export async function syncPrivateAccountToFirestore(user) {
  if (!user || !user.emailVerified || !user.email) return;

  const privatePath = `users/${user.uid}/private/account`;
  const privateRef = doc(db, 'users', user.uid, 'private', 'account');
  const email = String(user.email).trim().slice(0, 160);
  const authProvider = getPrimaryAuthProvider(user);

  let snap;
  try {
    snap = await getDoc(privateRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, privatePath);
  }

  if (!snap.exists()) {
    try {
      await setDoc(privateRef, {
        userId: user.uid,
        email,
        authProvider,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, privatePath);
    }
  } else {
    const prev = snap.data();
    if (prev.email !== email || prev.authProvider !== authProvider) {
      try {
        await updateDoc(privateRef, {
          email,
          authProvider,
          updatedAt: serverTimestamp()
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, privatePath);
      }
    }
  }
}

export async function saveTransactionToFirestore(user, tx) {
  if (!user || !user.emailVerified || !tx || !tx.invoiceId) return;

  const invoiceId = String(tx.invoiceId).replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 64);
  const txPath = `users/${user.uid}/transactions/${invoiceId}`;
  const txRef = doc(db, 'users', user.uid, 'transactions', invoiceId);

  const validPlanId = ['monthly', 'yearly', 'lifetime'].includes(tx.planId) ? tx.planId : 'yearly';

  const payload = {
    invoiceId,
    userId: user.uid,
    planId: validPlanId,
    planName: String(tx.planName || 'DoodleLab PRO').slice(0, 80),
    subtotal: Math.min(10000000, Math.max(0, Number(tx.subtotal || 0))),
    discount: Math.min(10000000, Math.max(0, Number(tx.discount || 0))),
    adminFee: Math.min(100000, Math.max(0, Number(tx.adminFee || 0))),
    total: Math.min(10000000, Math.max(0, Number(tx.total || 0))),
    method: String(tx.method || 'QRIS').slice(0, 80),
    status: 'LUNAS (Paid)',
    paidAt: String(tx.paidAt || new Date().toLocaleString('id-ID')).slice(0, 64),
    createdAt: serverTimestamp()
  };

  try {
    await setDoc(txRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, txPath);
  }
}

export async function loadUserFromFirestore(user) {
  if (!user || !user.emailVerified) {
    return { exists: false, progress: null, transactions: [] };
  }

  const userPath = `users/${user.uid}`;
  const userRef = doc(db, 'users', user.uid);

  let userSnap;
  try {
    userSnap = await getDoc(userRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, userPath);
  }

  if (!userSnap.exists()) {
    return { exists: false, progress: null, transactions: [] };
  }

  const txCollectionPath = `users/${user.uid}/transactions`;
  const txQuery = query(
    collection(db, 'users', user.uid, 'transactions'),
    where('userId', '==', user.uid)
  );

  let transactions = [];
  try {
    const txSnap = await getDocs(txQuery);
    transactions = txSnap.docs
      .map((d) => d.data())
      .sort((a, b) => {
        const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, txCollectionPath);
  }

  return {
    exists: true,
    progress: userSnap.data(),
    transactions
  };
}
