export interface JugglingPattern {
  id: string;
  title: string;
  description?: string;
  excerpt?: string; // Short description/preview
  url: string;
  
  // Metadata from passing.zone
  author?: string;
  publishedDate?: string;
  lastModified?: string;
  
  // Categorization
  categories: string[]; // e.g., ["NEW PATTERNS", "3 JUGGLERS", "PATTERNS"]
  tags: string[]; // e.g., ["manipulation", "scrambled", "beginner"]
  
  // Pattern specifics
  jugglerCount?: number | null; // Number of jugglers (extracted from categories)
  difficulty?: string | null; // Derived from tags or content
  patternType?: string; // e.g., "manipulation", "siteswap", "roundabout"
  
  // Search optimization
  searchableContent?: string; // Combined title + description + tags for better search
}

// Helper types for scraping
export interface ScrapedPatternData {
  title: string;
  url: string;
  excerpt: string;
  author: string;
  date: string;
  categories: string[];
  tags: string[];
} 