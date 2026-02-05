# Terminal B: Projects + Team Pages

## Your Role
You are one of 3 parallel terminals working on Wave 2. The other terminals are:
- **Terminal A**: Building Home + About pages
- **Terminal C**: Building Blog + Contact + Donate pages

DO NOT edit any files that belong to the other terminals.

## Your Branch
Create from `jared/public-pages`:
```bash
git checkout jared/public-pages
git checkout -b jared/pages-projects-team
```

## Files You SHOULD Edit (whitelist)
- `frontend/src/components/public/pages/PublicProjectsPage.jsx`
- `frontend/src/components/public/pages/TeamPage.jsx`

## Files You Must NOT Edit (blacklist)
- `App.jsx` (already has all routes)
- `publicSiteData.js` (already has all data)
- `tailwind.config.js` (already configured)
- Any file in `layout/` or `shared/` (already built)
- Any page file not in your whitelist

## Content Sources
- Projects: `/root/Jared/Stats Website/Jared Reference/Scripts/projects.html`
- Team: `/root/Jared/Stats Website/Jared Reference/Scripts/team.html`

## Available Shared Components
Import from `../shared/`:
- `PageHero` - For the hero section at top of pages
- `SectionHeader` - For section titles
- `FeaturedProjectCard` - For featured project cards
- `ScrollAnimateWrapper` - For scroll animations
- `TeamCard` - For team member cards (has compact mode for members)

## Available Data
Import from `../../../data/publicSiteData`:
- `projectsPageData` - Hero content, filters
- `featuredProjectsData` - Featured projects array
- `ongoingProjectsData` - Ongoing projects array
- `earlyStageProjectsData` - Early stage projects
- `teamData` - All team members by category (leadership, labLeads, members, partners)
- `ctaData` - CTA sections

## What To Build

### PublicProjectsPage.jsx
1. **Page Hero** - Use PageHero component
2. **Filter Buttons** - All / Completed / Ongoing (can be simple client-side filter)
3. **Featured Projects Section** - Large cards with full details
4. **Ongoing Projects Section** - Grid of smaller project cards
5. **Early Stage Section** - Pills/tags with icons for early-stage projects
6. **CTA Section** - "Have a project in mind?"

### TeamPage.jsx
1. **Page Hero** - Use PageHero component
2. **Leadership Section** - 4 leadership cards (full TeamCard)
3. **Lab Leads Section** - 2 lab lead cards (full TeamCard)
4. **Active Members Section** - 12 compact member cards (TeamCard with compact prop)
5. **Professional Partners Section** - Partner cards
6. **Join CTA** - "Join Our Team" section

## Icon Mapping
Use lucide-react icons. Common mappings:
- `FlaskConical` for flask/research
- `Building2` for building
- `Building` for city
- `Heart` for heart
- `Anchor` for anchor

## When You're Done
1. Run `npm run dev` and verify `/projects` and `/team` render correctly
2. Test project filter functionality
3. Check responsive behavior
4. Commit your changes:
```bash
git add frontend/src/components/public/pages/PublicProjectsPage.jsx frontend/src/components/public/pages/TeamPage.jsx
git commit -m "Build Projects and Team pages with full content"
```
5. Push: `git push -u origin jared/pages-projects-team`
6. Let the user know you're done so they can merge
