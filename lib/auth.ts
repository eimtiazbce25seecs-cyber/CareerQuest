import { clearProgress, hasProgress, loadProgress, saveProgress, store } from '@/lib/storage';

/**
 * Browser-only accounts for the demo.
 * Passwords are salted and hashed with PBKDF2 (WebCrypto), and accounts live in this browser's localStorage.
 * That is fine for a prototype, but it is NOT a substitute for server-side auth: swap this module
 * for Supabase Auth, Auth.js, or Clerk when you need accounts that follow people across devices.
 * Everything else in the app only talks to the functions exported here.
 */

export type User = { id: string; name: string; email: string; guest: boolean; createdAt: string };
type StoredUser = { id: string; name: string; email: string; salt: string; hash: string; createdAt: string };

export const GUEST: User = { id: 'guest', name: 'Guest explorer', email: '', guest: true, createdAt: '' };

export class AuthError extends Error {}

const ITERATIONS = 150_000;
const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromB64 = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

async function hashPassword(password: string, saltB64: string): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new AuthError('Your browser can’t create accounts here. Try a recent browser over HTTPS.');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = fromB64(saltB64);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: salt.buffer as ArrayBuffer, iterations: ITERATIONS, hash: 'SHA-256' }, key, 256);
  return toB64(new Uint8Array(bits));
}

const users = () => store.read<StoredUser[]>('users', []);
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const publicUser = (u: StoredUser): User => ({ id: u.id, name: u.name, email: u.email, guest: false, createdAt: u.createdAt });

export function validateSignUp(name: string, email: string, password: string): string | null {
  if (name.trim().length < 2) return 'Tell us what to call you (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address, like name@example.com.';
  if (password.length < 8) return 'Use at least 8 characters for your password.';
  return null;
}

export function getSessionUser(): User | null {
  const session = store.read<{ userId: string } | null>('session', null);
  if (!session) return null;
  if (session.userId === GUEST.id) return GUEST;
  const found = users().find(u => u.id === session.userId);
  return found ? publicUser(found) : null;
}

export async function signUp(input: { name: string; email: string; password: string; character: number | null }): Promise<User> {
  const problem = validateSignUp(input.name, input.email, input.password);
  if (problem) throw new AuthError(problem);
  const email = normalizeEmail(input.email);
  if (users().some(u => u.email === email)) throw new AuthError('That email already has an account. Try logging in instead.');

  const salt = toB64(crypto.getRandomValues(new Uint8Array(16)));
  const stored: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    salt,
    hash: await hashPassword(input.password, salt),
    createdAt: new Date().toISOString(),
  };
  if (!store.write('users', [...users(), stored])) throw new AuthError('Your browser blocked saving the account. Check that storage isn’t disabled.');

  // Keep anything the person did as a guest, then seed the chosen character.
  const base = hasProgress(GUEST.id) && getSessionUser()?.guest ? loadProgress(GUEST.id) : loadProgress(stored.id);
  saveProgress(stored.id, { ...base, character: base.character ?? input.character });
  if (getSessionUser()?.guest) clearProgress(GUEST.id);

  store.write('session', { userId: stored.id });
  return publicUser(stored);
}

export async function logIn(emailInput: string, password: string): Promise<User> {
  const found = users().find(u => u.email === normalizeEmail(emailInput));
  const failure = new AuthError('Email or password is incorrect.');
  if (!found) {
    await hashPassword(password, toB64(new Uint8Array(16))); // keep timing similar whether or not the email exists
    throw failure;
  }
  if ((await hashPassword(password, found.salt)) !== found.hash) throw failure;
  store.write('session', { userId: found.id });
  return publicUser(found);
}

export function continueAsGuest(): User {
  store.write('session', { userId: GUEST.id });
  return GUEST;
}

export function logOut() {
  store.remove('session');
}

export function updateName(userId: string, name: string): User | null {
  const list = users();
  const found = list.find(u => u.id === userId);
  if (!found || name.trim().length < 2) return null;
  found.name = name.trim();
  store.write('users', list);
  return publicUser(found);
}

export function deleteAccount(userId: string) {
  store.write('users', users().filter(u => u.id !== userId));
  clearProgress(userId);
  store.remove('session');
}
