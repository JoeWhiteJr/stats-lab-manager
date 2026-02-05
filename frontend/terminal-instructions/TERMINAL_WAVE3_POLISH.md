# Wave 3: Search, Polish, Responsive QA

## Prerequisites
Before starting this work, ensure all 3 Wave 2 sub-branches have been merged into `jared/public-pages`:
- `jared/pages-home-about` (Terminal A)
- `jared/pages-projects-team` (Terminal B)
- `jared/pages-blog-contact-donate` (Terminal C)

## Your Branch
Work directly on `jared/public-pages`:
```bash
git checkout jared/public-pages
git pull origin jared/public-pages
```

## Your Tasks

### 1. Build SearchModal Component
Create `frontend/src/components/public/shared/SearchModal.jsx`:
- Modal overlay with search input
- Search through projects, team members, pages
- Keyboard navigation (Escape to close)
- Display categorized results

Create `frontend/src/hooks/useSearchModal.js`:
- Open/close state
- Search query state
- Search logic using publicSiteData

### 2. Connect Search to PublicNavbar
Edit `frontend/src/components/public/layout/PublicNavbar.jsx`:
- Import and use SearchModal
- Wire up search button to open modal
- Handle search input in mobile menu

### 3. Add Document Titles
Edit each page component to set document.title:
- HomePage: "Woodberry Center for Analytical Insights | Stats Lab"
- AboutPage: "About Us | Woodberry Center for Analytical Insights"
- PublicProjectsPage: "Projects | Woodberry Center for Analytical Insights"
- TeamPage: "Our Team | Woodberry Center for Analytical Insights"
- BlogPage: "Blog & Research | Woodberry Center for Analytical Insights"
- ContactPage: "Contact Us | Woodberry Center for Analytical Insights"
- DonatePage: "Donate | Woodberry Center for Analytical Insights"

Use useEffect to set title on mount.

### 4. Responsive QA Pass
Test at these breakpoints:
- 480px (mobile)
- 768px (tablet)
- 1024px (laptop)
- 1400px (desktop)

Check for:
- Text overflow
- Image sizing
- Grid column adjustments
- Navigation usability
- Button touch targets
- Form input sizes

### 5. Fix Any Visual Issues
- Missing hover states
- Inconsistent spacing
- Color contrast issues
- Focus states for accessibility

### 6. Link Audit
Verify all internal links work:
- Navigation links
- CTA buttons
- Footer links
- Team contact links

## When You're Done
1. Run `npm run dev` and test all routes
2. Test search functionality
3. Test at all breakpoints
4. Commit your changes:
```bash
git add -A
git commit -m "Add search modal, document titles, and responsive polish"
git push origin jared/public-pages
```
5. Let the user know Wave 3 is complete
