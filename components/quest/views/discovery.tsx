'use client';
import { ArrowRight, Check, Compass } from 'lucide-react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/components/providers/progress-provider';
import { Owl, SenseiPanel, useNav } from '@/components/quest/common';
import { QUESTIONS } from '@/lib/data/questions';
import { dominantTraits } from '@/lib/scoring';
import { TRAITS, TRAIT_LABELS } from '@/lib/types';

export function DiscoveryView() {
  const { progress, dispatch, discovered, traits } = useProgress();
  const { go } = useNav();
  const index = progress.answers.length;
  const question = QUESTIONS[index];
  const chartData = TRAITS.map(t => ({ trait: TRAIT_LABELS[t], value: traits[t] }));
  const top = dominantTraits(traits, 2).map(t => TRAIT_LABELS[t].toLowerCase());

  return <div className="content-grid">
    <section className="workspace">
      <div className="eyebrow"><Compass size={14} />Discovery quest</div>
      {!discovered && question ? <>
        <div className="quest-progress"><div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-valuenow={index}><div className="progress-fill" style={{ width: `${index / QUESTIONS.length * 100}%` }} /></div><span>{index + 1} of {QUESTIONS.length}</span></div>
        <div className="sensei-top"><div className="owl"><Owl /></div><div><h3>Yuki asks…</h3><p>{index > 0 ? 'Let’s look a little deeper.' : 'Go with what feels natural.'}</p></div></div>
        <h2>{question.title}</h2>
        <div className="answer-options">{question.answers.map((a, i) => <Button key={a.text} variant="outline" className="answer" onClick={() => dispatch({ type: 'answer', choice: i })}><span className="answer-number">{String.fromCharCode(65 + i)}</span>{a.text}<ArrowRight className="ml-auto" /></Button>)}</div>
        <p className="text-xs">These are reflection prompts, not a validated personality test. Your progress saves automatically.</p>
      </> : <>
        <div className="flex items-center gap-3 mt-6"><div className="career-icon tone-mint"><Check /></div><h2 className="my-0">A little more you. A little more clarity.</h2></div>
        <p>Your answers lean toward <strong>{top.join(' and ')}</strong>. Let’s see how that feels in real work.</p>
        <div className="radar-wrap"><ResponsiveContainer width="100%" height="100%"><RadarChart data={chartData} outerRadius="70%"><PolarGrid stroke="var(--border)" /><PolarAngleAxis dataKey="trait" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} /><Radar dataKey="value" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.18} /></RadarChart></ResponsiveContainer></div>
        <p className="text-xs">Student-reported preferences. Illustrative, not a diagnosis.</p>
        <div className="flex flex-wrap gap-3 mt-6"><Button onClick={() => go('careers')}>Meet your career matches <ArrowRight /></Button><Button variant="outline" onClick={() => dispatch({ type: 'restartDiscovery' })}>Try the quest again</Button></div>
      </>}
    </section>
    <SenseiPanel />
  </div>;
}
