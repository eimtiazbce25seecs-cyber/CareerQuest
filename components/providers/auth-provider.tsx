'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import * as auth from '@/lib/auth';
import type { User } from '@/lib/auth';

type Panel = 'login' | 'signup' | null;
type AuthContextValue = {
  user: User | null;
  ready: boolean;
  panel: Panel;
  openAuth: (mode: Exclude<Panel, null>) => void;
  closeAuth: () => void;
  signUp: (input: { name: string; email: string; password: string; character: number | null }) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  guest: () => void;
  logOut: () => void;
  rename: (name: string) => void;
  deleteAccount: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

// Supabase fires auth events on token refresh and tab focus. Keep the same object when
// nothing changed, so components that depend on `user` don't reload their data.
const same = (a: User | null, b: User | null) =>
  a?.id === b?.id && a?.name === b?.name && a?.email === b?.email && a?.guest === b?.guest;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);

  const update = useCallback((next: User | null) => {
    setUser(prev => (same(prev, next) ? prev : next));
    setReady(true);
  }, []);

  // The session lives in the browser, so it is restored after mount and kept in sync afterwards.
  useEffect(() => {
    auth.getSessionUser().then(update);
    return auth.onAuthChange(update);
  }, [update]);

  const signUp = useCallback<AuthContextValue['signUp']>(async input => {
    setUser(await auth.signUp(input));
    setPanel(null);
  }, []);
  const logIn = useCallback<AuthContextValue['logIn']>(async (email, password) => {
    setUser(await auth.logIn(email, password));
    setPanel(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, ready, panel,
    openAuth: mode => setPanel(mode),
    closeAuth: () => setPanel(null),
    signUp, logIn,
    guest: () => { setUser(auth.continueAsGuest()); setPanel(null); },
    logOut: async () => {
      await auth.logOut();
      setUser(null);
      setPanel(null);
      window.history.replaceState(null, '', window.location.pathname);
    },
    rename: async name => {
      if (user && !user.guest) {
        const next = await auth.updateName(name);
        if (next) setUser(next);
      }
    },
    deleteAccount: async () => {
      if (!user || user.guest) return;
      try {
        await auth.deleteAccount(user.id);
        setUser(null);
        setPanel(null);
        window.history.replaceState(null, '', window.location.pathname);
      } catch {
        window.alert('Could not delete your account. Please try again.');
      }
    },
  }), [user, ready, panel, signUp, logIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}