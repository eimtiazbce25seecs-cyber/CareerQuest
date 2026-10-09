'use client';
import { Fragment } from 'react';
import { ArrowRight, Check, ShieldCheck, Sprout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProgress } from '@/components/providers/progress-provider';
import { CareerCard, CharacterCards, SenseiPanel, useNav } from '@/components/quest/common';
import { CHARACTERS } from '@/lib/data/characters';
import { cn } from '@/lib/utils';

const STEPS = ['Discover', 'Explore', 'Simulate', 'Reflect', 'Evolve', 'Plan'];

export function JourneyView() {
  const { progress, discovered, hasSignal, ranked, level } = useProgress();
  const { go } = useNav();
  const character = progress.character !== null ? CHARACTERS[progress.character] : null;
  const planStarted = Object.values(progress.tasks).some(t => t.length > 0);
  const current = planStarted ? 5 : progress.evidence.length ? 4 : discovered ? 2 : hasSignal ? 1 : 0;
  const doneUpTo = progress.evidence.length ? 3 : discovered ? 1 : 0;

  return <>
    <section className="hero" aria-label="Welcome to CareerQuest">
      <img src="/images/quest-world.jpg" width={1536} height={640} alt="A curious explorer and a wise owl discovering floating islands of career possibilities" />
      <div className="hero-copy">
        <div className="eyebrow"><Sprout size={14} />Your journey to Ikigai</div>
        <h2>Find your spark.<br />Forge your path.</h2>
        <p>Discover what you love, try who you could be, and build a future that feels like you.</p>
        <Button onClick={() => go('discovery')}>{discovered ? 'Revisit your discovery' : progress.answers.length ? 'Continue your quest' : 'Begin your discovery'} <ArrowRight /></Button>
      </div>
    </section>
    <ol className="journey" aria-label="Journey stages" style={{ listStyle: 'none', margin: 0, padding: '0 4px 22px' }}>
      {STEPS.map((step, i) => <Fragment key={step}>
        {i > 0 && <li aria-hidden="true" className="journey-line" />}
        <li className={cn('journey-step', i === current && 'current', i < current && i <= doneUpTo && 'done')} aria-current={i === current ? 'step' : undefined}>
          <div className="step-circle">{i < current && i <= doneUpTo ? <Check size={14} /> : i + 1}</div><span>{step}</span>
        </li>
      </Fragment>)}
    </ol>
    <div className="content-grid">
      <div>
        <section>
          {character ? (
            <div className="character-compact">
              <div className="avatar"><img src={character.image} alt="" /></div>
              <div style={{ flex: 1 }}><h3>{character.name}</h3><p>Level {level.level} {level.title}. {character.tag}</p></div>
              <Button variant="outline" size="sm" onClick={() => go('profile')}>Change</Button>
            </div>
          ) : <>
            <div className="section-heading"><div><h2>Every adventure starts with a character.</h2><p>Which one feels most like you? There’s no wrong choice.</p></div></div>
            <CharacterCards />
            <p className="character-note"><ShieldCheck />Your character is a starting point, not a label. Your path evolves as you explore.</p>
          </>}
        </section>
        <section className="matches-section">
          <div className="section-heading">
            <div><h2>{hasSignal ? 'Your top possibilities' : 'A peek at your possibilities'}</h2><p>{hasSignal ? 'Early matches from your answers. Keep exploring.' : 'Choose a character to start matching.'}</p></div>
            <Button variant="link" className="h-auto p-0 text-sm" onClick={() => go('careers')}>Explore all <ArrowRight /></Button>
          </div>
          <div className="career-grid">{ranked.slice(0, 3).map(r => <CareerCard key={r.career.id} career={r.career} score={hasSignal ? r.score.overall : null} label={progress.evidence.length ? 'Updated with your feedback' : 'A possible path for you'} />)}</div>
        </section>
      </div>
      <SenseiPanel />
    </div>
  </>;
}
