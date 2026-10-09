import type { Career } from '@/lib/types';

export type Week = { id: string; title: string; description: string; tasks: { id: string; text: string }[] };

/** A 30-day plan (4 weeks × 3 steps) tailored to one career. */
export function buildRoadmap(career: Career): Week[] {
  return [
    { id: 'w1', title: 'Follow your curiosity', description: 'Look closer at the work behind the job title.', tasks: [
      { id: 'w1t1', text: `Read three real ${career.name.toLowerCase()} job descriptions` },
      { id: 'w1t2', text: 'Write down the tasks you would enjoy and the ones you wouldn’t' },
      { id: 'w1t3', text: `Watch a day-in-the-life interview with a ${career.name.toLowerCase()}` },
    ] },
    { id: 'w2', title: 'Learn one foundational skill', description: 'Make room for three short practice sessions.', tasks: [
      { id: 'w2t1', text: `Choose a free beginner resource for ${career.skill}` },
      { id: 'w2t2', text: 'Complete three 20-minute practice sessions' },
      { id: 'w2t3', text: 'Note what feels energizing or difficult' },
    ] },
    { id: 'w3', title: 'Make something small', description: 'A tiny project is a useful piece of evidence.', tasks: [
      { id: 'w3t1', text: `Pick a small project: ${career.project}` },
      { id: 'w3t2', text: 'Create a first version, even if it’s rough' },
      { id: 'w3t3', text: 'Ask someone for specific feedback' },
    ] },
    { id: 'w4', title: 'Reflect and choose your next step', description: 'Keep what fits. Be curious about what doesn’t.', tasks: [
      { id: 'w4t1', text: 'Improve your project using the feedback' },
      { id: 'w4t2', text: 'Talk to a student or professional in the field' },
      { id: 'w4t3', text: 'Revisit your career matches and set a new goal' },
    ] },
  ];
}

export const onetUrl = (career: Career) => `https://www.onetonline.org/find/quick?s=${encodeURIComponent(career.onet)}`;

export const JOURNAL_PROMPTS = [
  'What gave you energy this week, and what drained it?',
  'Which task from a simulation or roadmap would you happily do again?',
  'What’s one thing you’re curious about that you haven’t told anyone?',
  'Which career surprised you most, and why?',
  'What would you try if you knew you couldn’t fail?',
  'What would the you of a year from now thank you for starting today?',
];
