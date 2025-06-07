import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { JugglingPattern } from '../types/Pattern';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
      threshold: 0.3, // Adjust fuzziness (0 = exact match, 1 = very fuzzy)
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
  }, [query, fuse, patterns]);

  const handlePatternClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength).trim() + '...';
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Passing Zone Pattern Search
        </h1>
        <p className="text-muted-foreground">
          Find juggling patterns with smart fuzzy search - typos welcome!
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search patterns... (e.g., 'choclate bar', '3 cout', 'typewritr')"
          className="pl-10"
        />
      </div>

      {/* Search Stats */}
      <div className="flex items-center justify-between">
        <Badge variant="secondary">
          {query.trim() === '' 
            ? `Showing all ${patterns.length} patterns`
            : `Found ${results.length} patterns matching "${query}"`
          }
        </Badge>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-muted-foreground mb-2">
                No patterns found for "{query}"
              </div>
              <p className="text-sm text-muted-foreground">
                Try a different search term or check for typos
              </p>
            </CardContent>
          </Card>
        ) : (
          results.map(({ item, score }) => (
            <Card
              key={item.id}
              className="transition-all hover:shadow-md cursor-pointer"
              onClick={() => handlePatternClick(item.url)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    {item.description && (
                      <CardDescription>
                        {truncateDescription(item.description)}
                      </CardDescription>
                    )}
                  </div>
                  {score && (
                    <Badge variant="outline" className="flex-shrink-0">
                      {Math.round((1 - score) * 100)}% match
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Pattern Details */}
                <div className="flex flex-wrap gap-2">
                  {item.difficulty && (
                    <Badge>
                      {item.difficulty}
                    </Badge>
                  )}
                  {item.jugglerCount && (
                    <Badge variant="secondary">
                      {item.jugglerCount} juggler{item.jugglerCount > 1 ? 's' : ''}
                    </Badge>
                  )}
                  {item.patternType && (
                    <Badge variant="outline">
                      {item.patternType}
                    </Badge>
                  )}
                  {item.author && (
                    <Badge variant="secondary">
                      by {item.author}
                    </Badge>
                  )}
                </div>
                
                {/* Categories */}
                {item.categories && item.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.categories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 8).map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        #{tag}
                      </Badge>
                    ))}
                    {item.tags.length > 8 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 8} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePatternClick(item.url);
                    }}
                  >
                    View Pattern
                    <ExternalLink className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 