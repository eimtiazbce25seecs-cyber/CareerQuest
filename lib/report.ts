import { CAREERS, careerById } from '@/lib/data/careers';
import { CHARACTERS } from '@/lib/data/characters';
import { classifyEvidence, rankCareers, traitValues } from '@/lib/scoring';
import { TRAITS, TRAIT_LABELS, type Progress } from '@/lib/types';

export function buildReport(name: string, p: Progress): string {
  const traits = traitValues(p.character, p.answers);
  const ranked = rankCareers(traits, p.evidence);
  const lines: string[] = [];
  lines.push(`# CareerQuest report for ${name}`, '', `Generated ${new Date().toLocaleDateString()}`, '');
  lines.push('## Starting character', p.character !== null ? `${CHARACTERS[p.character]?.name}. A starting point, not a label.` : 'Not chosen yet.', '');
  lines.push('## Preference profile (self-reported)', ...TRAITS.map(t => `- ${TRAIT_LABELS[t]}: ${traits[t]}/100`), '');
  lines.push('## Career fit', ...ranked.map((r, i) => `${i + 1}. ${r.career.name}: ${r.score.overall}% fit (${r.delta >= 0 ? '+' : ''}${r.delta} from simulations)`), '');
  lines.push('## Evidence from simulations');
  if (!p.evidence.length) lines.push('No simulations completed yet.');
  p.evidence.forEach(ev => {
    const c = classifyEvidence(ev);
    lines.push(`- ${careerById(ev.careerId)?.name ?? ev.careerId}: enjoyment ${ev.enjoyment}/5, confidence ${ev.confidence}/5. ${c.label}.`);
  });
  lines.push('', '## Roadmap progress');
  CAREERS.forEach(c => { const n = p.tasks[c.id]?.length ?? 0; if (n) lines.push(`- ${c.name}: ${n}/12 steps`); });
  lines.push('', '---', 'Scores are prototype estimates from self-reported answers, not validated assessments or employment forecasts.');
  return lines.join('\n');
}

export function download(filename: string, content: string, type = 'text/markdown') {
  const url = URL.createObjectURL(new Blob([content], { type: `${type};charset=utf-8` }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
