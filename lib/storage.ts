import { emptyProgress, type Progress } from '@/lib/types';

const PREFIX = 'careerquest:';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false; // private mode or quota exceeded: the app still works, it just won't persist
  }
}

function remove(key: string) {
  try { window.localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
}

export const store = { read, write, remove };

export function loadProgress(userId: string): Progress {
  const saved = read<Partial<Progress> | null>(`progress:${userId}`, null);
  return { ...emptyProgress(), ...(saved && saved.v === 1 ? saved : {}) };
}

export const saveProgress = (userId: string, progress: Progress) => write(`progress:${userId}`, progress);
export const clearProgress = (userId: string) => remove(`progress:${userId}`);
export const hasProgress = (userId: string) => read<unknown>(`progress:${userId}`, null) !== null;
