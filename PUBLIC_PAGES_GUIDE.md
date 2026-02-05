# Stats Lab Public Pages Integration Guide

## Project Context

This project combines **Jared's static public-facing website** with **Joe's stats-lab-manager React app**.

- **Public routes** (what visitors see): Home, About, Projects, Team, Blog, Contact, Donate
- **Protected routes** (what logged-in members see): Dashboard, Projects Manager, Settings

Both coexist in the same React app. Public pages have their own layout (`PublicLayout`) with a green navbar and full footer. Joe's app keeps its existing `Layout` with sidebar navigation.

---

## Architecture Decisions

| Decision | Choice |
|----------|--------|
| **Routing** | Public pages OUTSIDE `ProtectedRoute`. Public: `/`, `/about`, `/projects`, `/team`, `/blog`, `/contact`, `/donate`. Joe's: `/dashboard`, `/login`, `/register`, etc. |
| **Colors** | Both palettes coexist. Jared's: `pub-green-*` / `pub-tan-*`. Joe's: `primary-*`. |
| **Icons** | Standardize on `lucide-react`. Map Font Awesome icons to lucide equivalents. |
| **Fonts** | Inter (shared). Playfair Display for public headings (`font-display`). Outfit for Joe's app headings. |
| **Content** | All hardcoded text in `frontend/src/data/publicSiteData.js`. |
| **Images** | Use existing URLs with `onError` fallback. Local images in `public/images/public-site/`. |
| **Layout** | Public: `PublicLayout` (green navbar + full footer). Joe's: existing `Layout` (sidebar). |

---

## Branch Structure

- **Main branch for this work**: `jared/public-pages`
- **Wave 2 sub-branches** (created from `jared/public-pages`):
  - `jared/pages-home-about` (Terminal A)
  - `jared/pages-projects-team` (Terminal B)
  - `jared/pages-blog-contact-donate` (Terminal C)

---

## Color Token Mapping

**Jared's CSS Variables → Tailwind Classes:**

| CSS Variable | Tailwind Class |
|--------------|----------------|
| `--primary-dark: #275d38` | `pub-green-700` |
| `--primary: #4a7c59` | `pub-green-600` |
| `--primary-light: #6b9b7a` | `pub-green-500` |
| `--accent: #8b734a` | `pub-tan-600` |
| `--accent-light: #a8956d` | `pub-tan-500` |
| `--accent-dark: #6e5a3a` | `pub-tan-700` |

---

## Font Awesome to Lucide-React Icon Mapping

| Font Awesome | Lucide React | Usage |
|--------------|--------------|-------|
| `fa-chart-line` | `TrendingUp` | Logo |
| `fa-search` | `Search` | Search button |
| `fa-envelope` | `Mail` | Email |
| `fa-phone` | `Phone` | Phone |
| `fa-map-marker-alt` | `MapPin` | Address |
| `fa-clock` | `Clock` | Hours |
| `fa-building` | `Building2` | Organization |
| `fa-university` | `GraduationCap` | University |
| `fa-users` | `Users` | Team |
| `fa-user` | `User` | Single person |
| `fa-user-graduate` | `GraduationCap` | Student |
| `fa-check-circle` | `CheckCircle` | Checkmarks |
| `fa-check` | `Check` | List checks |
| `fa-poll` | `BarChart3` | Survey |
| `fa-laptop-code` | `MonitorSmartphone` | UX |
| `fa-project-diagram` | `Workflow` | Process |
| `fa-brain` | `Brain` | Psychometrics |
| `fa-calculator` | `Calculator` | Stats |
| `fa-flask` | `FlaskConical` | Research |
| `fa-briefcase` | `Briefcase` | Case studies |
| `fa-graduation-cap` | `GraduationCap` | Tutorials |
| `fa-bullhorn` | `Megaphone` | Updates |
| `fa-newspaper` | `Newspaper` | Blog |
| `fa-heart` | `Heart` | Donate |
| `fa-hands-helping` | `HandHelping` | Community |
| `fa-chart-pie` | `PieChart` | Analytics |
| `fa-chalkboard-teacher` | `Presentation` | Training |
| `fa-bullseye` | `Target` | What we do |
| `fa-tools` | `Wrench` | Capabilities |
| `fa-rocket` | `Rocket` | Startup |
| `fa-city` | `Building` | City |
| `fa-cogs` | `Settings` | Software |
| `fa-anchor` | `Anchor` | Navy |
| `fa-share-alt` | `Share2` | Share |
| `fab fa-linkedin` | `Linkedin` | LinkedIn |
| `fab fa-twitter` | `Twitter` | Twitter |
| `fab fa-github` | `Github` | GitHub |

---

## File Structure

```
frontend/src/
├── components/
│   └── public/
│       ├── layout/
│       │   ├── PublicLayout.jsx
│       │   ├── PublicNavbar.jsx
│       │   └── PublicFooter.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── AboutPage.jsx
│       │   ├── PublicProjectsPage.jsx
│       │   ├── TeamPage.jsx
│       │   ├── BlogPage.jsx
│       │   ├── ContactPage.jsx
│       │   └── DonatePage.jsx
│       └── shared/
│           ├── PageHero.jsx
│           ├── SectionHeader.jsx
│           ├── ServiceCard.jsx
│           ├── FeaturedProjectCard.jsx
│           ├── ScrollAnimateWrapper.jsx
│           ├── TeamCard.jsx
│           ├── FaqAccordion.jsx
│           └── DonationAmountSelector.jsx
├── data/
│   └── publicSiteData.js
├── hooks/
│   ├── useScrollAnimation.js
│   └── useContactForm.js
└── styles/
    └── public-overrides.css
```

---

## Component Conventions

1. **Functional components** with arrow functions
2. **Tailwind CSS classes** for styling (no inline styles except for dynamic values)
3. **`Link` from react-router-dom** for internal navigation (not `<a>` tags)
4. **lucide-react icons** (not Font Awesome)
5. **Props destructuring** at function signature
6. **No default exports** except for page components

---

## Content Data Location

All page content lives in `frontend/src/data/publicSiteData.js`:
- `siteInfo` - Organization name, tagline, contact info
- `navigation` - Nav links
- `heroData` - Hero section content
- `statsData` - Hero stats (7+ projects, 22+ members, etc.)
- `partnersData` - Partner organizations
- `servicesData` - Service cards
- `featuredProjectsData` - Featured project cards
- `teamData` - All team members by category
- `faqData` - FAQ items
- `impactData` - Donation impact cards
- `donationAmounts` - Donation amount buttons
- `blogPreviewData` - Blog preview cards

---

## Terminal Assignments

| Terminal | Wave | Files to Edit | Branch |
|----------|------|---------------|--------|
| A | 2 | `HomePage.jsx`, `AboutPage.jsx` | `jared/pages-home-about` |
| B | 2 | `PublicProjectsPage.jsx`, `TeamPage.jsx` | `jared/pages-projects-team` |
| C | 2 | `BlogPage.jsx`, `ContactPage.jsx`, `DonatePage.jsx` | `jared/pages-blog-contact-donate` |
| Wave 3 | 3 | `SearchModal.jsx`, `PublicNavbar.jsx`, responsive polish | `jared/public-pages` |
| Wave 4 | 4 | Test files, CI verification, PR | `jared/public-pages` |

---

## Reference Files

Original HTML files are in: `/root/Jared/Stats Website/Jared Reference/Scripts/`

- `index.html` - Home page
- `about.html` - About page
- `projects.html` - Projects page
- `team.html` - Team page
- `blog.html` - Blog page
- `contact.html` - Contact page
- `donate.html` - Donate page
- `styles.css` - Original CSS (for reference only)

---

## How to Verify Your Work

1. Start dev server: `cd frontend && npm run dev`
2. Check your routes render correctly
3. Verify navigation works between public pages
4. Verify `/dashboard` still redirects to login (Joe's protected routes work)
5. Check responsive at 480px, 768px, 1024px, 1400px

---

## When You're Done

1. Commit your changes with descriptive message
2. Push your branch
3. Let the user know you're done so they can merge sub-branches
