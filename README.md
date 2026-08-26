# Royal Optical — Platform

Next.js 15 (App Router, TypeScript, Tailwind v4) project for:
- `/` — public landing page
- `/studio` — Sanity Studio (embedded CMS)

The clinic management dashboard that used to live in this project has been
extracted into a separate desktop app. This repo is now scoped to just the
public site and its content management.

## What's here

- **`/`** — the full landing page: Header, Hero, Founder/Clinic, Studio
  Gallery, Services, Catalog (Frames/Lenses/Contacts tabs), Curated
  Collections, Testimonials, FAQ, Contact/Booking + Map, CTA, Footer, floating
  WhatsApp button — plus the scroll-reveal system, counters, parallax, and
  sticky-header/progress-bar behavior. All content is Sanity-backed, with
  hardcoded fallbacks in `lib/siteSettings.ts` for any section missing a
  document.
- **`/studio`** — Sanity Studio, mounted in-app. Schema types live in
  `sanity/schemaTypes/`. Singleton page sections (hero, branding, founder,
  gallery, contact, footer) can't be duplicated or deleted from the Studio UI.

## Content model

Content is split into page-section singletons (one document each) and
repeatable lists:

- Singletons: `heroSection`, `brandingSection`, `founderSection`,
  `gallerySection`, `contactSection`, `footerSection`
- Lists: `service`, `frame`, `lens`, `contactLensProduct`, `collectionItem`,
  `testimonial`, `faqItem`

`lib/siteSettings.ts` fetches each singleton and merges it over a hardcoded
`FALLBACK_*` constant, so the site still renders sensible content if a
document doesn't exist yet in Sanity.

## Known follow-ups

- Some images are still on the original ephemeral `lh3.googleusercontent.com`
  AI-prototyping URLs rather than Sanity's image pipeline — run `npm run seed`
  to upload them and back every section with real hosted assets.

## Running it

```bash
npm install
npm run dev
```

Then open `http://localhost:3000` (landing page) and
`http://localhost:3000/studio` (Sanity Studio).

Requires `.env.local` with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=          # Editor-permission token, only needed for `npm run seed`
```

## Seeding content

```bash
npm run seed
```

Idempotent — pushes the hardcoded fallback content (including uploading
images) into Sanity documents matching the IDs above. Safe to re-run; it
overwrites the same documents rather than duplicating them.
