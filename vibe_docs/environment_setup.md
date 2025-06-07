# Environment Setup Guide

## Tech Stack
- Language: Node.js 20.9.0
- Framework: Vite + React + TypeScript
- Styling: Tailwind CSS 4.1.8
- Search: Fuse.js 7.1.0
- Scraping: Cheerio 1.0.0 + Axios 1.9.0

## Prerequisites
- Node.js 20+ (use `nvm use 20`)
- npm 10+

## Setup Instructions
1. **Install Node 20**: `nvm use 20`
2. **Install dependencies**: `npm install`
3. **Configure Tailwind**: Already configured with PostCSS

## How to Run
### Development
```bash
npm run dev
# Opens at http://localhost:5173/
```

### Data Scraping
```bash
npm run scrape
# Scrapes latest patterns from passing.zone
# Updates src/data/passingZonePatterns.ts
```

### Production Build
```bash
npm run build
npm run preview
```

### Linting
```bash
npm run lint
```

## Environment Variables
- None required for basic functionality

## Data Updates
- Run `npm run scrape` regularly to fetch latest patterns
- Script is respectful with 1-second delays between requests
- Creates both JSON and TypeScript files in src/data/
- Automatically deduplicates and processes pattern metadata

## Project Structure
```
src/
├── components/
│   └── PatternSearch.tsx    # Main search component
├── data/
│   ├── patterns.json        # Raw scraped data
│   ├── passingZonePatterns.ts # TypeScript export
│   └── samplePatterns.ts    # Original sample data
├── types/
│   └── Pattern.ts           # TypeScript interfaces
└── App.tsx                  # Main app component

scripts/
└── scrape-passing-zone.js   # Web scraper for passing.zone
```

## Common Issues and Solutions

### PostCSS/Tailwind Errors
- Make sure `@tailwindcss/postcss` is installed
- Check postcss.config.js uses correct plugin name

### Node Version Issues  
- Use Node 20: `nvm use 20`
- Avoid Node 16 for modern packages

### Scraping Issues
- Respect rate limits (1-second delay implemented)
- Check passing.zone structure hasn't changed
- Verify axios/cheerio dependencies 