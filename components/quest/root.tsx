'use client';
import { Sprout } from 'lucide-react';
import { AuthProvider, useAuth } from '@/components/providers/auth-provider';
import { ProgressProvider } from '@/components/providers/progress-provider';
import { AuthScreen } from '@/components/auth/auth-screen';
import { AppShell } from '@/components/quest/app-shell';

function Gate() {
  const { user, ready, panel } = useAuth();
  if (!ready) return <div className="splash" role="status"><div><Sprout size={32} />Loading your quest…</div></div>;
  if (!user || panel) return <AuthScreen key={panel ?? 'auth'} />;
  return <ProgressProvider key={user.id} userId={user.id}><AppShell /></ProgressProvider>;
}

export default function Root() {
  return <AuthProvider><Gate /></AuthProvider>;
}
