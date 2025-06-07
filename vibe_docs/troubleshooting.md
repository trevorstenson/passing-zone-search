# Troubleshooting Guide

## Error Log Format
For each error, document:

### PostCSS Tailwind Plugin Error
**Date:** 2025-01-27
**Error Message:**
```
[plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. The PostCSS plugin has moved to a separate package, so to continue using Tailwind CSS with PostCSS you'll need to install `@tailwindcss/postcss` and update your PostCSS configuration.
```

**Context:** Trying to run the Vite development server with Tailwind CSS configured
**Root Cause:** Newer versions of Tailwind CSS have separated the PostCSS plugin into its own package
**Solution:**
1. Install the separate PostCSS plugin: `npm install -D @tailwindcss/postcss`
2. Update postcss.config.js to use `'@tailwindcss/postcss': {}` instead of `tailwindcss: {}`

**Prevention:** Check Tailwind CSS documentation for PostCSS configuration when setting up new projects
**Related Files:** postcss.config.js

---

### Node Version Compatibility Issues
**Date:** 2025-01-27
**Error Message:**
```
TypeError: crypto$2.getRandomValues is not a function
```

**Context:** Running with Node.js v16.20.2 and newer Vite/ESLint packages
**Root Cause:** Many modern packages require Node 18+ but we're using Node 16
**Solution:**
1. Downgraded Vite to v4.5.14 (compatible with Node 16)
2. Acknowledged warnings for ESLint packages requiring Node 18+
3. Development server works despite warnings

**Prevention:** Use Node 18+ for new projects, or check package compatibility before installation
**Related Files:** package.json, vite configuration

---

### Node Upgrade Solution (RESOLVED)
**Date:** 2025-01-27
**Error Message:**
```
ReferenceError: ReadableStream is not defined
```

**Context:** Using Node 16 with modern packages that require Node 18+
**Root Cause:** Modern packages like cheerio, axios require newer Node.js features
**Solution:**
1. Upgrade to Node 20: `nvm use 20`
2. Remove experimental flags from package.json scripts
3. All compatibility issues resolved

**Prevention:** Always use Node 18+ for new projects in 2025
**Related Files:** package.json scripts, .nvmrc (if using)

---

### Pagination Detection Bug (RESOLVED)
**Date:** 2025-01-27
**Issue:** Scraper only collecting 3 pages instead of all 23 pages
**Context:** Website shows pagination as "1 2 ... 23" but scraper was only grabbing visible links
**Root Cause:** Script was collecting visible pagination links instead of detecting max page number
**Solution:**
1. Updated discoverPages() to find highest page number from pagination
2. Generate sequential URLs from page 1 to max page number
3. Use pattern: `https://passing.zone/category/patterns/page/<number>/`

**Result:** Successfully scraped all 225 patterns across 23 pages
**Prevention:** Always check for ellipsis pagination patterns and extract max page numbers
**Related Files:** scripts/scrape-passing-zone.js

---

### shadcn/ui Import Alias Configuration
**Date:** 2025-01-27
**Error Message:**
```
No import alias found in your tsconfig.json file.
Visit https://ui.shadcn.com/docs/installation/vite to learn how to set an import alias.
```

**Context:** Trying to initialize shadcn/ui with `npx shadcn@latest init`
**Root Cause:** shadcn/ui requires TypeScript path aliases for @/* imports but they weren't configured
**Solution:**
1. Add baseUrl and paths to both tsconfig.json and tsconfig.app.json:
   ```json
   "compilerOptions": {
     "baseUrl": ".",
     "paths": {
       "@/*": ["./src/*"]
     }
   }
   ```
2. Install Node.js types: `npm install --save-dev @types/node`
3. Update vite.config.ts with path resolution:
   ```typescript
   import path from "node:path"
   import { fileURLToPath } from 'node:url'
   
   export default defineConfig({
     resolve: {
       alias: {
         "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
       },
     },
   })
   ```

**Prevention:** Always set up TypeScript path aliases when using component libraries
**Related Files:** tsconfig.json, tsconfig.app.json, vite.config.ts

---

### TypeScript Compiler Error - erasableSyntaxOnly
**Date:** 2025-01-27
**Error Message:**
```
Unknown compiler option 'erasableSyntaxOnly'.
```

**Context:** Editing tsconfig.app.json to add path aliases
**Root Cause:** `erasableSyntaxOnly` is not a valid TypeScript compiler option (possibly a typo)
**Solution:**
1. Remove the invalid `erasableSyntaxOnly` option from compilerOptions
2. Keep other valid strict mode options

**Prevention:** Validate TypeScript compiler options against official documentation
**Related Files:** tsconfig.app.json

---

### React 19 Peer Dependency Warnings (shadcn/ui)
**Date:** 2025-01-27
**Warning Message:**
```
It looks like you are using React 19. 
Some packages may fail to install due to peer dependency issues in npm
```

**Context:** Installing shadcn/ui components with React 19
**Root Cause:** Some dependencies haven't updated peer dependencies for React 19 yet
**Solution:**
1. Used `--force` flag during installation as suggested by shadcn/ui
2. Components work correctly despite warnings
3. Modern tooling handles React 19 compatibility automatically

**Prevention:** Accept that bleeding-edge React versions may have peer dependency warnings
**Related Files:** package.json dependencies

--- 