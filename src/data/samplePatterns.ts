import type { JugglingPattern } from '../types/Pattern';

// Sample data for testing - we'll replace this with scraped data from passing.zone
export const samplePatterns: JugglingPattern[] = [
  {
    id: '1',
    title: 'Basic 3-Count',
    description: 'The most fundamental passing pattern',
    category: 'Passing Patterns',
    tags: ['basic', 'beginner', '3-count'],
    url: 'https://passing.zone/patterns/basic-3-count',
    difficulty: 'Beginner',
    jugglers: 2
  },
  {
    id: '2',
    title: 'Chocolate Bar',
    description: 'A fun two-person pattern with crossing throws',
    category: 'Passing Patterns',
    tags: ['intermediate', 'chocolate', 'crossing'],
    url: 'https://passing.zone/patterns/chocolate-bar',
    difficulty: 'Intermediate',
    jugglers: 2
  },
  {
    id: '3',
    title: 'Why Not',
    description: 'A classic 3-person pattern',
    category: 'Passing Patterns',
    tags: ['3-person', 'classic', 'why-not'],
    url: 'https://passing.zone/patterns/why-not',
    difficulty: 'Advanced',
    jugglers: 3
  },
  {
    id: '4',
    title: 'Typewriter',
    description: 'Sequential pattern that looks like typing',
    category: 'Passing Patterns',
    tags: ['sequential', 'typewriter', 'visual'],
    url: 'https://passing.zone/patterns/typewriter',
    difficulty: 'Intermediate',
    jugglers: 2
  },
  {
    id: '5',
    title: 'Martin\'s One-Count',
    description: 'Every throw is a pass in this intense pattern',
    category: 'Passing Patterns',
    tags: ['1-count', 'intense', 'advanced'],
    url: 'https://passing.zone/patterns/martins-one-count',
    difficulty: 'Expert',
    jugglers: 2
  }
]; 