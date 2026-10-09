import type { Character } from '@/lib/types';

export const CHARACTERS: Character[] = [
  { id: 'creator', name: 'The Creator', initials: 'CR', tag: 'Imagination in motion', description: 'You see possibilities everywhere. You love making things and expressing your ideas.', traits: ['Creative', 'Expressive'], tone: 'coral', image: '/images/creator.jpg', seed: { creative: 5, adventurous: 1 } },
  { id: 'thinker', name: 'The Thinker', initials: 'TH', tag: 'Curiosity goes deep', description: 'You enjoy figuring things out. A quiet space and a good challenge are your happy place.', traits: ['Analytical', 'Independent'], tone: 'mint', image: '/images/thinker.jpg', seed: { analytical: 5, independent: 3 } },
  { id: 'connector', name: 'The Connector', initials: 'CO', tag: 'Better, together', description: 'You come alive around people. Bringing a team together feels natural to you.', traits: ['Social', 'Collaborative'], tone: 'yellow', image: '/images/connector.jpg', seed: { social: 5, purposeful: 3 } },
  { id: 'explorer', name: 'The Explorer', initials: 'EX', tag: 'What’s around the corner?', description: 'You’re always up for something new. You learn best by jumping in and trying it.', traits: ['Curious', 'Adaptable'], tone: 'lilac', image: '/images/explorer.jpg', seed: { adventurous: 5, creative: 1, independent: 1 } },
];
