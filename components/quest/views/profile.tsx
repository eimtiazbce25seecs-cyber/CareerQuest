'use client';
import { useState } from 'react';
import { Award, Download, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/components/providers/auth-provider';
import { useProgress } from '@/components/providers/progress-provider';
import { CharacterCards } from '@/components/quest/common';
import { buildReport, download } from '@/lib/report';

export function ProfileView() {
  const { user, rename, logOut, deleteAccount, openAuth } = useAuth();
  const { progress, dispatch, badges, level, xp } = useProgress();
  const [name, setName] = useState(user?.name ?? '');
  const [confirm, setConfirm] = useState<'reset' | 'delete' | null>(null);
  if (!user) return null;
  const earned = badges.filter(b => b.earned).length;

  return <div className="stack">
    {user.guest && <div className="banner"><span>You’re exploring as a guest. Create an account to keep your progress under your name.</span><Button size="sm" onClick={() => openAuth('signup')}>Create account</Button></div>}
    <section className="workspace">
      <h2 style={{ marginTop: 0 }}>Level {level.level} {level.title}</h2>
      <div className="quest-progress" style={{ marginTop: 0 }}><div className="progress-track"><div className="progress-fill" style={{ width: `${level.intoLevel / level.perLevel * 100}%` }} /></div><span>{xp} XP</span></div>
      {!user.guest && <div className="field" style={{ maxWidth: 360 }}><label htmlFor="display-name">Display name</label><div className="flex gap-2"><input id="display-name" className="text-input" value={name} onChange={e => setName(e.target.value)} /><Button variant="outline" disabled={name.trim().length < 2 || name.trim() === user.name} onClick={() => rename(name)}>Save</Button></div><span className="hint">{user.email}</span></div>}
    </section>
    <section className="workspace">
      <div className="eyebrow"><Award size={14} />Badges · {earned} of {badges.length}</div>
      <div className="badge-grid mt-4">{badges.map(b => <div key={b.id} className={`badge ${b.earned ? 'earned' : ''}`}><div className="medal"><Award size={20} /></div><strong>{b.name}</strong><small>{b.earned ? 'Earned' : b.hint}</small></div>)}</div>
    </section>
    <section className="workspace"><h2 style={{ marginTop: 0 }}>Your character</h2><p>Switch any time. Your discovery answers stay the same.</p><CharacterCards compact /></section>
    <section className="workspace">
      <h2 style={{ marginTop: 0 }}>Your data</h2>
      <div className="pill-row">
        <Button variant="outline" onClick={() => download('careerquest-report.md', buildReport(user.name, progress))}><Download />Download my report</Button>
        <Button variant="outline" onClick={() => download('careerquest-data.json', JSON.stringify(progress, null, 2), 'application/json')}><Download />Export my data</Button>
        <Button variant="outline" onClick={() => setConfirm('reset')}>Reset my progress</Button>
        <Button variant="outline" onClick={logOut}><LogOut />{user.guest ? 'Leave guest mode' : 'Log out'}</Button>
        {!user.guest && <Button variant="outline" onClick={() => setConfirm('delete')}><Trash2 />Delete account</Button>}
      </div>
    </section>
    <Dialog open={confirm !== null} onOpenChange={o => !o && setConfirm(null)}>
      <DialogContent>
        <DialogHeader><DialogTitle>{confirm === 'delete' ? 'Delete your account?' : 'Reset your progress?'}</DialogTitle><DialogDescription>{confirm === 'delete' ? 'This removes your account and everything saved on this device. It can’t be undone.' : 'This clears your character, answers, simulations, journal, and roadmap. Your account stays.'}</DialogDescription></DialogHeader>
        <div className="flex gap-3 justify-end"><Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button><Button onClick={() => { if (confirm === 'delete') deleteAccount(); else dispatch({ type: 'reset' }); setConfirm(null); }}>{confirm === 'delete' ? 'Delete account' : 'Reset progress'}</Button></div>
      </DialogContent>
    </Dialog>
  </div>;
}
