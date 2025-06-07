#!/usr/bin/env node

import axios from 'axios';
import * as cheerio from 'cheerio';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PassingZoneScraper {
  constructor() {
    this.baseUrl = 'https://passing.zone/category/patterns/';
    this.patterns = [];
    this.delay = 1000; // 1 second delay between requests to be respectful
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchPage(url) {
    try {
      console.log(`Fetching: ${url}`);
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PassingZoneSearchBot/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error.message);
      return null;
    }
  }

  extractPatternFromArticle($, article) {
    const $article = $(article);
    
    // Extract basic info
    const titleElement = $article.find('h1, h2, .entry-title, header h1, header h2').first();
    const title = titleElement.text().trim();
    
    // Get the link - look for various possible selectors
    let url = titleElement.find('a').attr('href') || 
              $article.find('a[href*="/"]').first().attr('href') ||
              $article.find('header a').attr('href');
    
    // Make sure URL is absolute
    if (url && !url.startsWith('http')) {
      url = url.startsWith('/') ? `https://passing.zone${url}` : `https://passing.zone/${url}`;
    }

    // Extract excerpt/description
    const excerpt = $article.find('.entry-content, .excerpt, p').first().text().trim();
    
    // Extract author
    const author = $article.find('.author, .by-author, [class*="author"]').text().trim() ||
                   $article.find('a[href*="/author/"]').text().trim() ||
                   'Unknown';

    // Extract date
    const dateText = $article.find('.date, .published, time, [class*="date"]').text().trim();
    
    // Extract categories - look for category links or text
    const categories = [];
    $article.find('a[href*="/category/"], .categories a, [class*="categor"] a').each((i, el) => {
      const cat = $(el).text().trim();
      if (cat && !categories.includes(cat)) {
        categories.push(cat);
      }
    });

    // Extract tags - look for tag links or text
    const tags = [];
    $article.find('a[href*="/tag/"], .tags a, [class*="tag"] a').each((i, el) => {
      const tag = $(el).text().trim();
      if (tag && !tags.includes(tag)) {
        tags.push(tag);
      }
    });

    // Only return if we have essential data
    if (title && url) {
      return {
        title: title,
        url: url,
        excerpt: excerpt || '',
        author: author || 'Unknown',
        date: dateText || '',
        categories: categories,
        tags: tags
      };
    }
    
    return null;
  }

  async scrapePage(pageUrl) {
    const html = await this.fetchPage(pageUrl);
    if (!html) return [];

    const $ = cheerio.load(html);
    const patterns = [];

    // Look for article patterns with various selectors
    const articleSelectors = [
      'article',
      '.post', 
      '.entry',
      '[class*="post"]',
      'main article',
      '.content article'
    ];

    let articlesFound = false;
    for (const selector of articleSelectors) {
      const articles = $(selector);
      if (articles.length > 0) {
        console.log(`Found ${articles.length} articles using selector: ${selector}`);
        articlesFound = true;
        
        articles.each((index, article) => {
          const pattern = this.extractPatternFromArticle($, article);
          if (pattern) {
            patterns.push(pattern);
          }
        });
        break; // Stop after finding articles with first successful selector
      }
    }

    if (!articlesFound) {
      console.log('No articles found with standard selectors, trying alternative approach...');
      
      // Alternative: look for any links to pattern pages
      $('a[href*="passing.zone"]').each((i, el) => {
        const $link = $(el);
        const href = $link.attr('href');
        const text = $link.text().trim();
        
        // Skip navigation, footer, and other non-pattern links
        if (text && text.length > 3 && 
            !href.includes('/category/') && 
            !href.includes('/author/') &&
            !href.includes('/tag/') &&
            !text.toLowerCase().includes('read more') &&
            !text.toLowerCase().includes('home') &&
            !text.toLowerCase().includes('contact')) {
          
          patterns.push({
            title: text,
            url: href.startsWith('http') ? href : `https://passing.zone${href}`,
            excerpt: '',
            author: 'Unknown',
            date: '',
            categories: [],
            tags: []
          });
        }
      });
    }

    return patterns;
  }

  async discoverPages() {
    const html = await this.fetchPage(this.baseUrl);
    if (!html) return [this.baseUrl];

    const $ = cheerio.load(html);
    let maxPage = 1;

    // Look for pagination links to find the highest page number
    const paginationSelectors = [
      '.pagination a',
      '.page-numbers a',
      'a[href*="/page/"]',
      '.nav-links a'
    ];

    for (const selector of paginationSelectors) {
      $(selector).each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        
        if (href && href.includes('/page/')) {
          // Extract page number from URL
          const urlMatch = href.match(/\/page\/(\d+)\//);
          if (urlMatch) {
            const pageNum = parseInt(urlMatch[1]);
            if (pageNum > maxPage) {
              maxPage = pageNum;
            }
          }
        }
        
        // Also check link text for page numbers
        if (text && /^\d+$/.test(text)) {
          const pageNum = parseInt(text);
          if (pageNum > maxPage) {
            maxPage = pageNum;
          }
        }
      });
    }

    // Generate all page URLs from 1 to maxPage
    const pages = [];
    for (let i = 1; i <= maxPage; i++) {
      if (i === 1) {
        pages.push(this.baseUrl); // First page is the base URL
      } else {
        pages.push(`${this.baseUrl}page/${i}/`);
      }
    }

    console.log(`Discovered ${maxPage} total pages to scrape`);
    return pages;
  }

  processPatterns(rawPatterns) {
    const processed = [];
    const seenUrls = new Set();

    rawPatterns.forEach(pattern => {
      // Skip duplicates
      if (seenUrls.has(pattern.url)) {
        return;
      }
      seenUrls.add(pattern.url);

      // Extract juggler count from categories or title
      let jugglerCount = null;
      const jugglerRegex = /(\d+)\s*(juggler|person)/i;
      
      // Check categories first
      pattern.categories.forEach(cat => {
        const match = cat.match(/(\d+)\s+JUGGLER/);
        if (match) {
          jugglerCount = parseInt(match[1]);
        }
      });

      // Check title if not found in categories
      if (!jugglerCount) {
        const titleMatch = pattern.title.match(jugglerRegex);
        if (titleMatch) {
          jugglerCount = parseInt(titleMatch[1]);
        }
      }

      // Determine pattern type from tags/categories
      let patternType = 'general';
      const allTerms = [...pattern.tags, ...pattern.categories].map(t => t.toLowerCase());
      
      if (allTerms.some(t => t.includes('manipulation'))) patternType = 'manipulation';
      else if (allTerms.some(t => t.includes('siteswap'))) patternType = 'siteswap';
      else if (allTerms.some(t => t.includes('roundabout'))) patternType = 'roundabout';
      else if (allTerms.some(t => t.includes('scrambled'))) patternType = 'scrambled';

      // Determine difficulty
      let difficulty = null;
      if (allTerms.includes('beginner') || allTerms.includes('super easy')) difficulty = 'Beginner';
      else if (allTerms.includes('intermediate')) difficulty = 'Intermediate';
      else if (allTerms.includes('advanced')) difficulty = 'Advanced';
      else if (allTerms.includes('expert')) difficulty = 'Expert';

      // Create searchable content
      const searchableContent = [
        pattern.title,
        pattern.excerpt,
        ...pattern.tags,
        ...pattern.categories,
        pattern.author
      ].filter(Boolean).join(' ').toLowerCase();

      processed.push({
        id: pattern.url.split('/').filter(Boolean).pop() || `pattern-${processed.length}`,
        title: pattern.title,
        description: pattern.excerpt,
        excerpt: pattern.excerpt,
        url: pattern.url,
        author: pattern.author,
        publishedDate: pattern.date,
        categories: pattern.categories,
        tags: pattern.tags,
        jugglerCount: jugglerCount,
        difficulty: difficulty,
        patternType: patternType,
        searchableContent: searchableContent
      });
    });

    return processed;
  }

  async scrapeAll() {
    console.log('Starting passing.zone scrape...');
    
    // Discover all pages
    const pages = await this.discoverPages();
    
    const allPatterns = [];
    
    for (let i = 0; i < pages.length; i++) {
      const pageUrl = pages[i];
      console.log(`Scraping page ${i + 1}/${pages.length}: ${pageUrl}`);
      
      const patterns = await this.scrapePage(pageUrl);
      allPatterns.push(...patterns);
      
      console.log(`Found ${patterns.length} patterns on this page`);
      
      // Be respectful with delays
      if (i < pages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Process and deduplicate
    const processedPatterns = this.processPatterns(allPatterns);
    
    console.log(`\nScraping complete!`);
    console.log(`Total patterns found: ${processedPatterns.length}`);
    
    return processedPatterns;
  }

  async saveData(patterns) {
    const outputDir = path.join(__dirname, '..', 'src', 'data');
    const outputFile = path.join(outputDir, 'patterns.json');
    
    try {
      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(outputFile, JSON.stringify(patterns, null, 2));
      console.log(`Data saved to: ${outputFile}`);
      
      // Also create a TypeScript version
      const tsContent = `import type { JugglingPattern } from '../types/Pattern';

// Auto-generated from scraping passing.zone
// Last updated: ${new Date().toISOString()}
export const passingZonePatterns: JugglingPattern[] = ${JSON.stringify(patterns, null, 2)};
`;
      
      const tsFile = path.join(outputDir, 'passingZonePatterns.ts');
      await fs.writeFile(tsFile, tsContent);
      console.log(`TypeScript file created: ${tsFile}`);
      
      return { jsonFile: outputFile, tsFile };
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  }
}

// Run the scraper
async function main() {
  const scraper = new PassingZoneScraper();
  
  try {
    const patterns = await scraper.scrapeAll();
    const files = await scraper.saveData(patterns);
    
    console.log('\n✅ Scraping completed successfully!');
    console.log(`📊 Scraped ${patterns.length} patterns`);
    console.log(`📁 Files created:`);
    console.log(`   - ${files.jsonFile}`);
    console.log(`   - ${files.tsFile}`);
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
} 