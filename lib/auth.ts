import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { clearProgress, hasProgress, loadProgress, saveProgress, store } from '@/lib/storage';

/**
 * Accounts are handled by Supabase Auth: passwords are hashed on Supabase's servers and
 * sessions are issued by Supabase. "Guest" stays browser-only: it has no Supabase session
 * and nothing is saved to the database. Everything else in the app only talks to the
 * functions exported here.
 */

export type User = { id: string; name: string; email: string; guest: boolean; createdAt: string };

export const GUEST: User = { id: 'guest', name: 'Guest explorer', email: '', guest: true, createdAt: '' };

export class AuthError extends Error {}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

function toUser(u: SupabaseUser): User {
  const name = typeof u.user_metadata?.name === 'string' ? u.user_metadata.name : '';
  return {
    id: u.id,
    name: name || u.email?.split('@')[0] || 'Explorer',
    email: u.email ?? '',
    guest: false,
    createdAt: u.created_at ?? '',
  };
}

// The guest choice is remembered in this browser only.
const guestMarked = () => store.read<{ userId: string } | null>('session', null)?.userId === GUEST.id;

export function validateSignUp(name: string, email: string, password: string): string | null {
  if (name.trim().length < 2) return 'Tell us what to call you (at least 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address, like name@example.com.';
  if (password.length < 8) return 'Use at least 8 characters for your password.';
  return null;
}

export async function getSessionUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) return toUser(data.session.user);
  return guestMarked() ? GUEST : null;
}

/** Calls back whenever the signed-in user changes (login, logout, token refresh, other tabs). */
export function onAuthChange(cb: (user: User | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user ? toUser(session.user) : guestMarked() ? GUEST : null);
  });
  return () => data.subscription.unsubscribe();
}

export async function signUp(input: { name: string; email: string; password: string; character: number | null }): Promise<User> {
  const problem = validateSignUp(input.name, input.email, input.password);
  if (problem) throw new AuthError(problem);
  const email = normalizeEmail(input.email);
  const wasGuest = guestMarked();

  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
    emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    data: { name: input.name.trim(), character: input.character },
  },
  });

  const exists = new AuthError('That email already has an account. Try logging in instead.');
  if (error) {
    if (error.code === 'user_already_exists' || /already registered/i.test(error.message)) throw exists;
    throw new AuthError('Could not create your account. Please try again.');
  }
  // With email confirmation switched on, an existing email comes back as a user with no identities.
  if (data.user && data.user.identities?.length === 0) throw exists;
  // With email confirmation switched on, there is no session until the link is clicked.
  if (!data.session || !data.user) throw new AuthError('Check your email to confirm your account, then log in.');

  // Keep anything the person did as a guest, then seed the chosen character.
  const id = data.user.id;
  const base = wasGuest && hasProgress(GUEST.id) ? loadProgress(GUEST.id) : loadProgress(id);
  saveProgress(id, { ...base, character: base.character ?? input.character });
  if (wasGuest) {
    clearProgress(GUEST.id);
    store.remove('session');
  }
  return toUser(data.user);
}

export async function logIn(emailInput: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email: normalizeEmail(emailInput), password });
  if (error || !data.user) {
    if (error?.code === 'email_not_confirmed') throw new AuthError('Confirm your email first, then log in.');
    throw new AuthError('Email or password is incorrect.');
  }
  store.remove('session'); // drop any guest marker
  return toUser(data.user);
}

export function continueAsGuest(): User {
  store.write('session', { userId: GUEST.id });
  return GUEST;
}

export async function logOut() {
  store.remove('session');
  await supabase.auth.signOut();
}

export async function updateName(name: string): Promise<User | null> {
  if (name.trim().length < 2) return null;
  const { data, error } = await supabase.auth.updateUser({ data: { name: name.trim() } });
  return error || !data.user ? null : toUser(data.user);
}

/** Deleting a Supabase user needs the secret key, so it happens on the server (app/api/account). */
export async function deleteAccount(userId: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new AuthError('Log in again to delete your account.');

  const res = await fetch('/api/account', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new AuthError('Could not delete your account. Please try again.');

  clearProgress(userId);
  store.remove('session');
  await supabase.auth.signOut({ scope: 'local' });
}