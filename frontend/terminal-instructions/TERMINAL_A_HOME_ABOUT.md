# Terminal A: Home + About Pages

## Your Role
You are one of 3 parallel terminals working on Wave 2. The other terminals are:
- **Terminal B**: Building Projects + Team pages
- **Terminal C**: Building Blog + Contact + Donate pages

DO NOT edit any files that belong to the other terminals.

## Your Branch
Create from `jared/public-pages`:
```bash
git checkout jared/public-pages
git checkout -b jared/pages-home-about
```

## Files You SHOULD Edit (whitelist)
- `frontend/src/components/public/pages/HomePage.jsx`
- `frontend/src/components/public/pages/AboutPage.jsx`

## Files You Must NOT Edit (blacklist)
- `App.jsx` (already has all routes)
- `publicSiteData.js` (already has all data)
- `tailwind.config.js` (already configured)
- Any file in `layout/` or `shared/` (already built)
- Any page file not in your whitelist

## Content Sources
- Home: `/root/Jared/Stats Website/Jared Reference/Scripts/index.html`
- About: `/root/Jared/Stats Website/Jared Reference/Scripts/about.html`

## Available Shared Components
Import from `../shared/`:
- `PageHero` - For the hero section at top of About page
- `SectionHeader` - For section titles with optional label and subtitle
- `ServiceCard` - For service grid items
- `FeaturedProjectCard` - For featured project cards on home
- `ScrollAnimateWrapper` - For scroll animations
- `TeamCard` - For team member preview on home

## Available Data
Import from `../../../data/publicSiteData`:
- `siteInfo` - Organization name, tagline, contact
- `heroData` - Home hero content
- `statsData` - Stats numbers (7+ projects, etc.)
- `partnersData` - Partner logos
- `aboutSummaryData` - About summary for home
- `servicesData` - Service cards
- `featuredProjectsData` - Featured projects for home
- `teamHighlightsData` - Team preview for home
- `aboutPageData` - Full About page content
- `ctaData` - Call-to-action sections

## What To Build

### HomePage.jsx
1. **Hero Section** - Full-width with background, title, tagline, description, two CTA buttons, stats row, partner logos
2. **About Summary** - Image + text grid with highlights list
3. **Featured Projects** - 3 featured project cards
4. **Team Preview** - Image + text grid (reversed) with team stats
5. **Services Grid** - 6 service cards in grid
6. **CTA Section** - Full-width call-to-action

### AboutPage.jsx
1. **Page Hero** - Use PageHero component
2. **Mission Section** - Title, lead text, description
3. **About Cards Grid** - 4 cards (What We Do, What We Can Do, What We're Looking For, Membership)
4. **Partners Section** - Partner logo grid
5. **CTA Section** - Ready to work with us?

## Icon Mapping
Use lucide-react icons. Common mappings:
- `TrendingUp` for chart-line
- `CheckCircle` for check-circle
- `Users` for users
- `Building2` for building

## When You're Done
1. Run `npm run dev` and verify `/` and `/about` render correctly
2. Test navigation between home and about
3. Check responsive behavior
4. Commit your changes:
```bash
git add frontend/src/components/public/pages/HomePage.jsx frontend/src/components/public/pages/AboutPage.jsx
git commit -m "Build Home and About pages with full content"
```
5. Push: `git push -u origin jared/pages-home-about`
6. Let the user know you're done so they can merge
