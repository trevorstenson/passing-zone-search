import type { JugglingPattern } from '../types/Pattern';

// Sample data for testing - we'll replace this with scraped data from passing.zone
export const samplePatterns: JugglingPattern[] = [
  {
    id: '1',
    title: '3-3-10',
    description: 'Basic three-count passing pattern for two jugglers using ten clubs.',
    url: 'https://passing.zone/pattern/3-3-10',
    author: 'Unknown',
    tags: ['3-count', 'beginner', 'clubs'],
    categories: ['Passing Patterns'],
    jugglerCount: 2,
    difficulty: 'Beginner'
  },
  {
    id: '2',
    title: '6-count',
    description: 'Six count passing pattern - every right hand is a pass.',
    url: 'https://passing.zone/pattern/6-count',
    author: 'Unknown',
    tags: ['6-count', 'beginner', 'clubs'],
    categories: ['Passing Patterns'],
    jugglerCount: 2,
    difficulty: 'Beginner'
  },
  {
    id: '3',
    title: 'Why Not',
    description: 'Advanced seven club passing pattern with various heights.',
    url: 'https://passing.zone/pattern/why-not',
    author: 'Martin Frost',
    tags: ['7-club', 'advanced', 'manipulation'],
    categories: ['Passing Patterns'],
    jugglerCount: 2,
    difficulty: 'Advanced'
  },
  {
    id: '4',
    title: 'Funky Bookends',
    description: 'Creative pattern with unusual timing and feeds.',
    url: 'https://passing.zone/pattern/funky-bookends',
    author: 'Aidan Burns',
    tags: ['funky', 'bookends', 'intermediate'],
    categories: ['Passing Patterns'],
    jugglerCount: 3,
    difficulty: 'Intermediate'
  },
  {
    id: '5',
    title: 'Beast',
    description: 'Very difficult synchronous passing pattern for experienced jugglers.',
    url: 'https://passing.zone/pattern/beast',
    author: 'Unknown',
    tags: ['sync', 'difficult', 'beast'],
    categories: ['Passing Patterns'],
    jugglerCount: 2,
    difficulty: 'Expert'
  }
]; 