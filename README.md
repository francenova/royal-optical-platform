# Royal Optical — Platform

Unified Next.js 15 (App Router, TypeScript, Tailwind v4) project for:
- `/` — public landing page
- `/studio` — Sanity Studio (embedded)
- `/dashboard` — clinic management dashboard

## Status of this pass

**Working now:**
- Full Next.js project scaffold — builds clean (`npm run build`) and runs (`npm run dev`).
- `/` — the complete landing page, ported from the mobile + desktop HTML files:
  Header, Hero, Founder/Clinic, Studio Gallery, Services (15 items), Catalog
  (Frames/Lenses/Contacts tabs), Curated Collections, Testimonials, FAQ,
  Contact/Booking + Map, CTA, Footer, floating WhatsApp button — plus the
  scroll-reveal system, counters, parallax, and the sticky-header/progress-bar
  behavior from the original.
- `/dashboard` — the complete Royal Optical clinic management app, ported 1:1 from
  the original Vite/React project: Dashboard, Patients, Patient Profile, Patient
  Visit (exam workflow), Prescription (print/PDF), Medicine Inventory, Reports,
  Settings. Same behavior as before — client-side state seeded from
  `lib/initialData.ts`, no login, no persistence beyond the browser tab yet.

**Placeholders, not yet built:**
- `/studio` — reserved route only. Needs an actual Sanity project (project ID +
  dataset) before it can embed the real Studio.

## Decisions made in this pass (worth knowing)

1. **Dashboard navigation was kept as-is.** The original app switches "pages" via
   a string in React Context rather than real URLs. Rather than risk breaking
   the 8-page, ~8,000-line app while also refactoring navigation, this pass
   preserves that behavior exactly, mounted at the single `/dashboard` route.
   Recommended follow-up: split into real routes (`/dashboard/patients`,
   `/dashboard/patients/[id]`, etc.) for shareable URLs and native browser
   back/forward. See the comment at the top of
   `components/dashboard/DashboardShell.tsx`.
2. **Tailwind v4**, CSS-first config. `app/globals.css` has two `@theme`
   sections: the landing page's Material-Design-3-style tokens (colors, type,
   spacing) ported from the HTML files' config, and the dashboard keeps its own
   slate/indigo defaults — deliberate, since the dashboard is an internal tool,
   not public branding.
3. **The 4 sections where mobile and desktop used genuinely different
   interaction patterns** (Studio Gallery, Catalog's Frames row, Curated
   Collections, Testimonials) keep their breakpoint-specific pattern rather
   than being unified into one — see the reasoning notes from the design
   discussion. A shared `<Carousel>` component
   (`components/landing/Carousel.tsx`) handles the mobile swipeable version
   in all four; desktop keeps its own bento grid / fixed grid / click-to-expand
   selector / vertical marquee respectively.
4. **Two token conflicts between the mobile and desktop HTML files** were
   resolved in favor of the desktop file's mobile-breakpoint values (section
   padding: 64px not 56px; a few font sizes were 2–4px larger) — it reads as
   the more deliberately maintained "complete" responsive system. Easy to
   adjust in `app/globals.css`'s `@theme` block if you'd rather match the
   standalone mobile file instead.
5. **One data inconsistency was fixed, not preserved**: the original desktop
   file's testimonial marquee duplicated each person with a *different* photo
   for the seamless-loop copy. `components/landing/Testimonials.tsx` uses one
   canonical photo per person everywhere, which is what the marquee duplication
   should have done in the first place.
6. **Dropped unused dashboard dependencies**: `@google/genai`, `express`,
   `dotenv` — none were actually used anywhere in the app code.
7. **Two real type errors were fixed** in the dashboard code, not stylistic
   ones — Vite's original build never type-checked (`tsc` was a separate,
   non-blocking `lint` script), so these were always present but invisible.
   Next.js's build type-checks by default and caught them (see git blame /
   diffs on `lib/types.ts` and `components/dashboard/pages/ReportsPage.tsx`
   if you want the specifics).
8. **All images are still on the original ephemeral `lh3.googleusercontent.com`
   AI-prototyping URLs.** These need to move to real hosted assets (Sanity's
   image pipeline, once that's wired up) before this goes to production —
   they are not guaranteed to stay available long-term.

## A note on this environment's build check

This project was built and validated in a sandboxed environment whose network
allowlist doesn't include `fonts.googleapis.com`, so `next/font/google` (used
for Anton, Source Sans 3, and Space Mono in `app/layout.tsx`) couldn't
actually fetch the font files here. Everything else was fully validated: a
production build with fonts temporarily stubbed out compiled with zero errors
across every route, and `next dev` was smoke-tested live for `/`, `/dashboard`,
and `/studio` (all HTTP 200, real content confirmed, no error markers). With
normal internet access — which Antigravity will have — `next/font/google` is
standard, widely-used Next.js functionality and should just work.

## Running it

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` (landing page), `http://localhost:3000/dashboard`
(full app), `http://localhost:3000/studio` (Sanity placeholder).

## Next steps (per the project plan)

1. Create the Sanity project → wire up `/studio` and pull landing content from it.
2. Create the Supabase project → replace `AppContext`'s local state with real
   tables, add Supabase Auth for `/dashboard` login.
3. Move all landing page images from the ephemeral AI-prototyping URLs to real
   hosted assets.
4. SEO pass once the landing page is fully content-managed via Sanity.
