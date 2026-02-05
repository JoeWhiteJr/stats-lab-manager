# Terminal C: Blog + Contact + Donate Pages

## Your Role
You are one of 3 parallel terminals working on Wave 2. The other terminals are:
- **Terminal A**: Building Home + About pages
- **Terminal B**: Building Projects + Team pages

DO NOT edit any files that belong to the other terminals.

## Your Branch
Create from `jared/public-pages`:
```bash
git checkout jared/public-pages
git checkout -b jared/pages-blog-contact-donate
```

## Files You SHOULD Edit (whitelist)
- `frontend/src/components/public/pages/BlogPage.jsx`
- `frontend/src/components/public/pages/ContactPage.jsx`
- `frontend/src/components/public/pages/DonatePage.jsx`

## Files You Must NOT Edit (blacklist)
- `App.jsx` (already has all routes)
- `publicSiteData.js` (already has all data)
- `tailwind.config.js` (already configured)
- Any file in `layout/` or `shared/` (already built)
- Any page file not in your whitelist

## Content Sources
- Blog: `/root/Jared/Stats Website/Jared Reference/Scripts/blog.html`
- Contact: `/root/Jared/Stats Website/Jared Reference/Scripts/contact.html`
- Donate: `/root/Jared/Stats Website/Jared Reference/Scripts/donate.html`

## Available Shared Components
Import from `../shared/`:
- `PageHero` - For the hero section (use variant="donate" for donate page)
- `SectionHeader` - For section titles
- `ScrollAnimateWrapper` - For scroll animations
- `FaqAccordion` - For FAQ section on contact page
- `DonationAmountSelector` - For donation amount buttons

## Available Hooks
Import from `../../../hooks/`:
- `useContactForm` - Form state management for contact form

## Available Data
Import from `../../../data/publicSiteData`:
- `blogPageData` - Blog coming soon content, preview cards, newsletter
- `contactPageData` - Hero, form fields, intro
- `faqData` - FAQ items for contact page
- `donatePageData` - Hero, impact cards, donation options, transparency stats
- `siteInfo` - Contact info (email, phone, address)

## What To Build

### BlogPage.jsx
1. **Page Hero** - Use PageHero component
2. **Coming Soon Message** - Icon, title, lead text
3. **Preview Cards** - 4 cards showing what's coming
4. **Newsletter Signup** - Email input + subscribe button
5. **Social Follow** - LinkedIn follow button

### ContactPage.jsx
1. **Page Hero** - Use PageHero component
2. **Two-Column Layout:**
   - Left: Contact info (email, phone, address, hours), map placeholder
   - Right: Contact form (name, email, org, subject dropdown, message)
3. **FAQ Section** - Use FaqAccordion component with faqData

### DonatePage.jsx
1. **Page Hero** - Use PageHero with variant="donate"
2. **Intro Section** - Title and lead text
3. **Impact Cards** - 4 impact cards in grid
4. **Donation Options** - 3 cards side by side:
   - One-time gift with DonationAmountSelector
   - Monthly giving with DonationAmountSelector (featured with badge)
   - Corporate sponsorship with benefits list
5. **Other Ways to Support** - 4-item grid
6. **Transparency Section** - Stats showing fund allocation

## Icon Mapping
Use lucide-react icons. Common mappings:
- `Newspaper` for newspaper
- `FlaskConical` for flask
- `Briefcase` for briefcase
- `GraduationCap` for graduation-cap
- `Megaphone` for bullhorn
- `Mail` for envelope
- `Phone` for phone
- `MapPin` for map-marker-alt
- `Clock` for clock
- `Heart` for heart
- `HandHelping` for hands-helping
- `PieChart` for chart-pie
- `Presentation` for chalkboard-teacher

## When You're Done
1. Run `npm run dev` and verify `/blog`, `/contact`, and `/donate` render correctly
2. Test contact form validation
3. Test donation amount selection
4. Check responsive behavior
5. Commit your changes:
```bash
git add frontend/src/components/public/pages/BlogPage.jsx frontend/src/components/public/pages/ContactPage.jsx frontend/src/components/public/pages/DonatePage.jsx
git commit -m "Build Blog, Contact, and Donate pages with full content"
```
6. Push: `git push -u origin jared/pages-blog-contact-donate`
7. Let the user know you're done so they can merge
