# Wave 4: Testing, CI, and Pull Request

## Prerequisites
Wave 3 must be complete (search, polish, responsive QA).

## Your Branch
Work directly on `jared/public-pages`:
```bash
git checkout jared/public-pages
git pull origin jared/public-pages
```

## Your Tasks

### 1. Create Test Files
Match existing test patterns in `frontend/src/tests/`.

Create these test files in `frontend/src/components/public/__tests__/`:

#### PublicNavbar.test.jsx
- Renders logo and navigation links
- Mobile menu toggle works
- Active link styling
- Search button present

#### HomePage.test.jsx
- Renders hero section
- Renders all main sections
- CTA buttons have correct links

#### routing.test.jsx
- All public routes render without errors
- Navigation between pages works
- Protected routes redirect to login

#### SearchModal.test.jsx
- Opens and closes correctly
- Search input works
- Results display correctly
- Keyboard navigation (Escape to close)

#### ContactPage.test.jsx
- Form renders all fields
- Validation works
- Submit button present
- FAQ accordion works

### 2. Verify CI Workflow
Check `.github/workflows/` for existing CI config.
Ensure:
- Tests run on PR
- Build succeeds
- Linting passes

### 3. Run Tests Locally
```bash
cd frontend
npm test
```

Fix any failing tests.

### 4. Run Build
```bash
npm run build
```

Ensure no build errors.

### 5. Open Pull Request
```bash
gh pr create --base main --head jared/public-pages --title "Add public-facing website pages" --body "## Summary
Adds 7 public-facing pages for the Woodberry Center website:
- Home page with hero, projects preview, team preview, services
- About page with mission, capabilities, partners
- Projects page with featured/ongoing/early-stage projects
- Team page with leadership, lab leads, members
- Blog page with coming soon + newsletter
- Contact page with form and FAQ
- Donate page with impact cards and donation options

## Technical Changes
- New PublicLayout with green navbar and footer
- New Tailwind color tokens (pub-green, pub-tan)
- Playfair Display font for headings
- Shared components library
- Complete publicSiteData.js with all content
- Search modal functionality
- Document title management
- Responsive design at 480/768/1024/1400px

## Testing
- Added tests for public components
- All tests pass locally
- Build succeeds

## Routes
- Public: /, /about, /projects, /team, /blog, /contact, /donate
- Protected (unchanged): /dashboard, /login, /register
"
```

### 6. Monitor CI
Wait for CI checks to pass. Fix any issues.

## When You're Done
1. All tests pass
2. Build succeeds
3. PR is open
4. CI checks pass
5. Let the user know the PR URL and status
