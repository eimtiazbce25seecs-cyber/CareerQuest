'use client';
import { useState } from 'react';
import { ArrowRight, BookOpen, Play, Trash2, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/components/providers/progress-provider';
import { useNav } from '@/components/quest/common';
import { careerById } from '@/lib/data/careers';
import { CHARACTERS } from '@/lib/data/characters';
import { JOURNAL_PROMPTS } from '@/lib/roadmap';
import { classifyEvidence } from '@/lib/scoring';

export function ReflectionView() {
  const { progress, ranked, discovered, dispatch } = useProgress();
  const { go, startSim } = useNav();
  const [text, setText] = useState('');
  const prompt = JOURNAL_PROMPTS[progress.journal.length % JOURNAL_PROMPTS.length]!;
  const last = progress.evidence[progress.evidence.length - 1];
  const lastCareer = last ? careerById(last.careerId) : undefined;
  const chart = ranked.slice(0, 5).map(r => ({ name: r.career.name.replace('Environmental ', 'Env. '), Initial: r.baseline.overall, Now: r.score.overall }));

  return <div className="stack">
    <div className="detail-grid">
      <section className="workspace">
        <div className="eyebrow"><TrendingUp size={14} />Your evolving career fit</div>
        <h2>Experience changes the picture.</h2>
        <p>{progress.evidence.length ? 'Your simulation ratings are now part of your career matches.' : 'Try a simulation to add a new piece of evidence to your path.'}</p>
        <div className="chart-wrap" role="img" aria-label="Initial versus current fit for your top five careers"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart} layout="vertical" margin={{ left: 10, right: 10 }}><CartesianGrid horizontal={false} stroke="var(--border)" /><XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} /><YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 12, fill: 'var(--foreground)' }} /><Tooltip /><Legend /><Bar dataKey="Initial" fill="var(--lilac-strong)" radius={[0, 4, 4, 0]} isAnimationActive={false} /><Bar dataKey="Now" fill="var(--primary)" radius={[0, 4, 4, 0]} isAnimationActive={false} /></BarChart></ResponsiveContainer></div>
        {ranked.slice(0, 5).map((r, i) => <div className="report-rank" key={r.career.id}><div><h3>{i + 1}. {r.career.name}</h3><p>{r.baseline.overall}% initial → {r.score.overall}% now</p></div><span className="fit-badge">{r.delta > 0 ? '+' : ''}{r.delta} pts</span></div>)}
        {lastCareer && last && <div className="consequence"><strong className="text-sm">Why it moved</strong><p>Your latest {lastCareer.name} day felt {last.enjoyment >= 4 ? 'energizing' : last.enjoyment <= 2 ? 'less enjoyable' : 'neutral'}. Confidence is self-reported, not a measure of skill. Careers that share themes shift a little too.</p></div>}
        <div className="flex gap-3 flex-wrap mt-4"><Button onClick={() => go('plan')}>Build my 30-day plan <ArrowRight /></Button><Button variant="outline" onClick={() => startSim(null)}><Play />{progress.evidence.length ? 'Explore another day' : 'Try your first simulation'}</Button></div>
      </section>
      <section className="workspace">
        <div className="eyebrow"><BookOpen size={14} />Evidence timeline</div>
        <h2>The moments behind your matches</h2>
        <div className="evidence-item"><strong>{progress.character !== null ? `${CHARACTERS[progress.character]!.name} selected` : 'No character chosen yet'}</strong><p>Starting preference · Tentative, self-reported</p></div>
        {discovered && <div className="evidence-item"><strong>Discovery quest completed</strong><p>Eight reflection prompts shaped your preference profile.</p></div>}
        {[...progress.evidence].reverse().map(ev => { const c = classifyEvidence(ev); const career = careerById(ev.careerId); return <div className="evidence-item" key={ev.id}>
          <strong>{career?.name ?? ev.careerId} · Simulation</strong>
          <p><span className="signal">{c.label}</span></p>
          <p>Enjoyment {ev.enjoyment}/5 · Confidence {ev.confidence}/5. {c.note}</p>
          <details className="text-sm mt-2"><summary className="cursor-pointer text-primary">View your decisions</summary>{ev.decisions.map((d, i) => <p key={i}><strong>Scene {d.scene + 1}:</strong> {d.text}</p>)}</details>
        </div>; })}
      </section>
    </div>
    <section className="workspace">
      <div className="eyebrow"><BookOpen size={14} />My journal</div>
      <h2>{prompt}</h2>
      <label htmlFor="journal" className="sr-only">Journal entry</label>
      <textarea id="journal" className="custom-answer" placeholder="Write a few honest sentences. Only you can see this." maxLength={1200} value={text} onChange={e => setText(e.target.value)} />
      <Button className="mt-3" disabled={!text.trim()} onClick={() => { dispatch({ type: 'journalAdd', entry: { id: crypto.randomUUID(), at: new Date().toISOString(), prompt, text: text.trim() } }); setText(''); }}>Save entry</Button>
      {progress.journal.map(e => <div className="journal-entry" key={e.id}>
        <div className="flex justify-between items-center gap-3"><small>{new Date(e.at).toLocaleDateString()} · {e.prompt}</small><Button variant="ghost" size="icon" aria-label="Delete entry" onClick={() => dispatch({ type: 'journalRemove', id: e.id })}><Trash2 /></Button></div>
        <p>{e.text}</p>
      </div>)}
    </section>
  </div>;
}
