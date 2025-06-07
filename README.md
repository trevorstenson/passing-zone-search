# 🎯 Passing Zone Pattern Search

A modern, responsive web app for searching juggling patterns from [passing.zone](https://passing.zone) with intelligent fuzzy search capabilities.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

## ✨ Features

- **🔍 Smart Fuzzy Search**: Find patterns even with typos and partial matches
- **📱 Mobile Responsive**: Beautiful design that works on all devices
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **⚡ Fast Performance**: Instant search results as you type
- **🏷️ Rich Metadata**: Search across titles, descriptions, categories, tags, and authors
- **🎯 Complete Dataset**: All 225+ patterns from passing.zone

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd passing-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173/
   ```

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Search**: Fuse.js (fuzzy search)
- **Data Scraping**: Cheerio + Axios

## 📊 Dataset

The app includes a complete dataset of **225 juggling patterns** scraped from passing.zone, including:

- Pattern titles and descriptions
- Author information
- Difficulty levels
- Juggler counts
- Pattern types (e.g., "3 Count", "Chocolate Bar")
- Categories and tags
- Direct links to original patterns

## 🔍 Search Features

### Intelligent Fuzzy Matching
- **Typo tolerance**: "choclate bar" → "Chocolate Bar"
- **Partial matches**: "3 cout" → "3 Count"
- **Multi-field search**: Searches across titles, descriptions, tags, categories, and authors
- **Weighted scoring**: Titles have higher priority than descriptions

### Search Tips
- Try searching for pattern names: "Chocolate Bar", "Why Not"
- Search by juggler count: "3 juggler", "4 person"
- Look for difficulty: "beginner", "intermediate", "advanced"
- Find by author: "MAJ", "Christian"
- Use categories: "Feeds", "Weaves", "Takeouts"

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   └── PatternSearch.tsx  # Main search component
├── types/
│   └── Pattern.ts    # TypeScript interfaces
├── data/
│   └── patterns.json # Scraped pattern data
└── lib/
    └── utils.ts      # Utility functions

scripts/
└── scrape-passing-zone.js  # Data scraping script

vibe_docs/           # Development documentation
```

## 🔄 Data Updates

To refresh the pattern data from passing.zone:

```bash
node scripts/scrape-passing-zone.js
```

This will:
- Scrape all pattern pages from passing.zone
- Extract metadata (titles, descriptions, authors, etc.)
- Save updated data to `src/data/patterns.json`
- Respect rate limits with automatic delays

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:
- **Card**: Pattern display containers
- **Input**: Search field with icon
- **Badge**: Tags, categories, and metadata labels
- **Button**: Action buttons and links

## 🌙 Dark Mode

The app includes built-in dark mode support through shadcn/ui's design system.

## 📱 Mobile Experience

- Responsive grid layout
- Touch-friendly buttons
- Optimized typography scaling
- Mobile-first design approach

## ⚡ Performance

- **Instant search**: Results update as you type
- **Efficient filtering**: Fuse.js optimized configuration
- **Minimal bundle**: Tree-shaken dependencies
- **Fast rendering**: React 18 concurrent features

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Configuration

- **TypeScript**: Strict mode enabled
- **ESLint**: React and TypeScript rules
- **Tailwind**: Custom theme with shadcn/ui variables
- **Vite**: Fast HMR and optimized builds

## 📋 TODO / Future Enhancements

- [ ] Search filters (difficulty, juggler count, category)
- [ ] Search suggestions/autocomplete
- [ ] Keyboard navigation
- [ ] Dark mode toggle
- [ ] Favorites/bookmarking
- [ ] Pattern comparison
- [ ] Offline functionality
- [ ] PWA features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [passing.zone](https://passing.zone) for the original pattern database
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Fuse.js](https://fusejs.io/) for the fuzzy search capabilities
