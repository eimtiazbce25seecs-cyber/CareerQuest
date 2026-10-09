'use client';
import { ExternalLink, Map } from 'lucide-react';
import { useProgress } from '@/components/providers/progress-provider';
import { CAREERS } from '@/lib/data/careers';
import { buildRoadmap, onetUrl } from '@/lib/roadmap';

export function RoadmapView() {
  const { progress, ranked, dispatch } = useProgress();
  const careerId = progress.planCareer ?? ranked[0]!.career.id;
  const career = CAREERS.find(c => c.id === careerId) ?? CAREERS[0]!;
  const done = progress.tasks[career.id] ?? [];
  const weeks = buildRoadmap(career);

  return <section className="workspace">
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div className="eyebrow"><Map size={14} />Your 30-day career roadmap</div>
      <label className="text-sm flex items-center gap-3">My direction
        <select value={career.id} onChange={e => dispatch({ type: 'planCareer', careerId: e.target.value })} className="rounded-md border bg-background p-2 text-foreground">{CAREERS.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select>
      </label>
    </div>
    <h2>Your next chapter: {career.name}</h2>
    <p>A flexible starting plan. Make it yours as you learn more. <a className="text-primary underline inline-flex items-center gap-1" href={onetUrl(career)} target="_blank" rel="noreferrer">Real task data on O*NET <ExternalLink size={13} /></a></p>
    <div className="quest-progress"><div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={12} aria-valuenow={done.length}><div className="progress-fill" style={{ width: `${done.length / 12 * 100}%` }} /></div><span>{done.length}/12 steps</span></div>
    {weeks.map((week, i) => <div className="plan-week" key={week.id}>
      <div className="week-number">{i + 1}</div>
      <div><h3>Week {i + 1}: {week.title}</h3><p>{week.description}</p>
        {week.tasks.map(task => <label className="plan-task" key={task.id}><input type="checkbox" checked={done.includes(task.id)} onChange={() => dispatch({ type: 'toggleTask', careerId: career.id, taskId: task.id })} /><span>{task.text}</span></label>)}
      </div>
    </div>)}
    <p className="text-xs mt-4">Week 4 covers days 22–30. Your progress is saved for each career.</p>
  </section>;
}
