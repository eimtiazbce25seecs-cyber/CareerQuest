'use client';
import { createContext, useContext, useEffect, useMemo, useReducer, useState, type Dispatch, type ReactNode } from 'react';
import { loadProgress, saveProgress } from '@/lib/storage';
import { QUESTIONS } from '@/lib/data/questions';
import { computeBadges, computeXp, levelInfo, rankCareers, traitValues, type Badge, type Ranked } from '@/lib/scoring';
import { emptyProgress, type Evidence, type JournalEntry, type Progress, type Trait } from '@/lib/types';

type Action =
  | { type: 'hydrate'; progress: Progress }
  | { type: 'character'; index: number | null }
  | { type: 'answer'; choice: number }
  | { type: 'restartDiscovery' }
  | { type: 'evidence'; evidence: Evidence }
  | { type: 'toggleTask'; careerId: string; taskId: string }
  | { type: 'journalAdd'; entry: JournalEntry }
  | { type: 'journalRemove'; id: string }
  | { type: 'planCareer'; careerId: string }
  | { type: 'explored'; careerId: string }
  | { type: 'reset' };

function reducer(state: Progress, action: Action): Progress {
  switch (action.type) {
    case 'hydrate': return action.progress;
    case 'character': return { ...state, character: action.index };
    case 'answer': return state.answers.length >= QUESTIONS.length ? state : { ...state, answers: [...state.answers, action.choice] };
    case 'restartDiscovery': return { ...state, answers: [] };
    case 'evidence': return { ...state, evidence: [...state.evidence, action.evidence] };
    case 'toggleTask': {
      const current = state.tasks[action.careerId] ?? [];
      const next = current.includes(action.taskId) ? current.filter(id => id !== action.taskId) : [...current, action.taskId];
      return { ...state, tasks: { ...state.tasks, [action.careerId]: next } };
    }
    case 'journalAdd': return { ...state, journal: [action.entry, ...state.journal] };
    case 'journalRemove': return { ...state, journal: state.journal.filter(e => e.id !== action.id) };
    case 'planCareer': return { ...state, planCareer: action.careerId };
    case 'explored': return state.explored.includes(action.careerId) ? state : { ...state, explored: [...state.explored, action.careerId] };
    case 'reset': return emptyProgress();
  }
}

type ProgressContextValue = {
  progress: Progress;
  dispatch: Dispatch<Action>;
  loaded: boolean;
  traits: Record<Trait, number>;
  discovered: boolean;
  hasSignal: boolean;
  ranked: Ranked[];
  xp: number;
  level: ReturnType<typeof levelInfo>;
  badges: Badge[];
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [progress, dispatch] = useReducer(reducer, undefined, emptyProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch({ type: 'hydrate', progress: loadProgress(userId) });
    setLoaded(true);
  }, [userId]);

  useEffect(() => {
    if (loaded) saveProgress(userId, progress);
  }, [progress, loaded, userId]);

  const value = useMemo<ProgressContextValue>(() => {
    const traits = traitValues(progress.character, progress.answers);
    const xp = computeXp(progress);
    return {
      progress, dispatch, loaded, traits,
      discovered: progress.answers.length >= QUESTIONS.length,
      hasSignal: progress.character !== null || progress.answers.length > 0,
      ranked: rankCareers(traits, progress.evidence),
      xp, level: levelInfo(xp), badges: computeBadges(progress),
    };
  }, [progress, loaded]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
