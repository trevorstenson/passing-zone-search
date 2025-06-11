import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { JugglingPattern } from '../types/Pattern';

import { Badge } from '@/components/ui/badge';
import { Search, ExternalLink } from 'lucide-react';

interface PatternSearchProps {
  patterns: JugglingPattern[];
}

interface SearchResult {
  item: JugglingPattern;
  score?: number;
}

export function PatternSearch({ patterns }: PatternSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Configure Fuse.js for optimal fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(patterns, {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'description', weight: 0.2 },
        { name: 'searchableContent', weight: 0.3 },
        { name: 'tags', weight: 0.1 },
        { name: 'categories', weight: 0.05 },
        { name: 'author', weight: 0.05 }
      ],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [patterns]);

  // Perform search whenever query changes
  useEffect(() => {
    if (query.trim() === '') {
      setResults(patterns.map(item => ({ item })));
    } else {
      const searchResults = fuse.search(query);
      setResults(searchResults);
    }
    setSelectedIndex(-1);
  }, [query, fuse, patterns]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handlePatternClick(results[selectedIndex].item.url);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex]);

  const handlePatternClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="app-container">
      <div className="w-full max-w-none sm:max-w-none md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 lg:mb-4 leading-tight">
            Passing Zone Pattern Search
          </h1>
          {/* <p className="text-slate-400 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-2 sm:px-0">
            Find juggling patterns with smart fuzzy search - typos welcome!
          </p> */}
        </div>

        {/* Search Input - Mobile-First Responsive with Inter Font */}
        <div className="w-full sm:max-w-lg md:max-w-2xl lg:w-2/3 xl:w-2/3 mx-auto mb-4 sm:mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search patterns..."
              className="w-full h-12 sm:h-14 lg:h-16 pl-12 sm:pl-14 pr-4 sm:pr-6 py-3 sm:py-4 text-base sm:text-lg font-medium bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg shadow-sm focus:outline-none"
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif'
              }}
            />
          </div>
        </div>

        {/* Search Stats */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
            <span className="text-slate-300 text-xs sm:text-sm">
              {query.trim() === '' 
                ? `Showing all ${patterns.length} patterns`
                : `Found ${results.length} patterns matching "${query}"`
              }
            </span>
          </div>
        </div>

        {/* Results - Mobile-Friendly Cards */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          {results.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 sm:p-8 text-center" style={{ backgroundColor: '#1e293b', borderColor: '#475569' }}>
              <div className="text-slate-300 text-base sm:text-lg mb-2">
                No patterns found for "{query}"
              </div>
              <p className="text-slate-400 text-sm sm:text-base">
                Try a different search term or check for typos
              </p>
            </div>
          ) : (
            results.map(({ item }, index) => (
              <div
                key={item.id}
                className={`group rounded-lg sm:rounded-xl pt-2 pb-3 px-3 sm:pt-3 sm:pb-4 sm:px-4 cursor-pointer transition-all duration-200 border touch-manipulation ${
                  index === selectedIndex 
                    ? 'bg-slate-700 border-slate-500 shadow-lg' 
                    : 'bg-slate-800 hover:bg-slate-600 border-slate-700 hover:border-slate-500 hover:shadow-xl'
                }`}
                style={{ 
                  backgroundColor: index === selectedIndex ? '#334155' : '#1e293b',
                  borderColor: index === selectedIndex ? '#64748b' : '#475569'
                }}
                onClick={() => handlePatternClick(item.url)}
              >
                <div className="flex items-start justify-between gap-2 sm:gap-3 md:gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white group-hover:text-blue-300 mt-1 transition-colors duration-200 mb-1 sm:mb-2 leading-tight break-words">
                      {item.title}
                    </h3>
                    
                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 overflow-hidden">
                        {item.tags.slice(0, 6).map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="text-xs bg-slate-900 text-slate-400 hover:bg-slate-700 transition-colors border-slate-700 max-w-28 sm:max-w-48 md:max-w-none truncate"
                            style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderColor: '#475569' }}
                            title={`#${tag}`}
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {item.tags.length > 6 && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-slate-900 text-slate-400 border-slate-700 flex-shrink-0"
                            style={{ backgroundColor: '#0f172a', color: '#94a3b8', borderColor: '#475569' }}
                          >
                            +{item.tags.length - 6} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                                    {/* Action Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500 group-hover:text-slate-300 transition-colors duration-200" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 