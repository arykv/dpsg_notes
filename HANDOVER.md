# All Nighter — handover

Everything a new session needs to pick this up. Written 28 July 2026.

> **Read `VISION.md` first.** This file is the technical state of the repo; that
> one is the product direction, and it is newer. Where they disagree — most
> importantly on the answer-sheet paywall, which no longer exists — `VISION.md`
> wins.

---

## 1. What this is

**All Nighter** — a free CBSE study site for Class 10, 11 and 12. Every NCERT chapter,
honest exam strategy, calculators, and a directory of checked free resources.

The positioning is the whole point: *everything you need at 11pm the night before.* Aryan was
a last-minute studier and scored 95.2% and 92.8% anyway. The site says that out loud, which no
competitor will.

| | |
|---|---|
| Live | https://allnighter.in |
| Repo | `github.com/arykv/allnighter` — renamed 28 Jul 2026 (old URLs redirect) |
| Local | `~/Documents/dpsg-notes` |
| Hosting | Vercel, project `allnighter` under `arykvs-projects`, auto-deploys from `main` |
| Old domain | `dps-gandhinagar.in` — GitHub Pages, orphan `legacy-domain` branch, one `noindex` page. See §8 |
| Vercel CLI | installed, logged in as `arykv` |

---

## 2. Who it's for and by

**Aryan Rao Kaveti**, Class of 2026, DPS Gandhinagar (Ambapur).

**Born 03/04/2009 — he is 17 until April 2027.** This blocks every payment gateway: Razorpay and
all Indian equivalents require the account holder to be 18+ with PAN. A parent must be the
registered holder, or paid features wait. *Do not plan revenue features around him signing up.*

### His results — both verified against real marksheets

**Class 12, 2026 — 92.8%**

| Subject | Theory | Prac/IA | Total |
|---|---|---|---|
| Computer Science | 68 | 30 | 98 |
| English Core | 76 | 20 | 96 |
| Mathematics | 71 | 20 | 91 |
| Physics | 60 | 30 | 90 |
| Chemistry | 59 | 30 | 89 |

**Class 10, 2024 — 95.2%** (best of five, Hindi dropped)

Computer Applications 98 · Social Science 96 · Science 95 · Maths 94 · English 93 · Hindi 89

### The moderation evidence — the strongest asset on the project

His OSM (evaluated answer sheets) versus his marksheet:

| Subject | OSM raw | Marksheet | Diff |
|---|---|---|---|
| Chemistry | **52** | 59 | **+7** |
| Physics | **58** | 60 | **+2** |
| Maths | 71 | 71 | 0 |
| Computer Science | 68 | 68 | 0 |
| English | 76 | 76 | 0 |

Three exact matches prove the OSM "Total Marks" field really is the theory total — so Chemistry
and Physics genuinely gained marks. **Documented proof that CBSE moderation is real.** Almost
nobody has both documents and thinks to compare them.

**Shipped 28 Jul 2026 at `/results`** — both marksheets rebuilt as components plus this
comparison, with the headline the numbers give you: **+9 marks, 91.0% → 92.8%.** Every figure on
that page is computed from the per-subject marks in `src/data/results.ts`, so a typo shows up as a
wrong percentage rather than as a quiet lie. `MY_RESULTS` now derives from there too.

Per `VISION.md`, this is no longer "one asset" — it is the site's front door, and the pillar it
opens ("what happens to your paper after you hand it in") is the top content priority.

---

## 3. Hard constraints

### Privacy — never publish

- Roll numbers: `11611774` (Class 12), `11112965` (Class 10)
- Parents' names: Indu Rao Kaveti, Kaveti Laxminarayana Rao
- Date of birth: 03/04/2009

These appear in the marksheet screenshots and PDFs he shared. Marksheets must be **rebuilt as
components** from the numbers above, never shown as screenshots. A redacted crop is fine as proof.

### Design — he rejected the first attempt as "looks AI generated"

That version was: near-black canvas, one mint accent, radial glow blob, faint grid. **Do not drift
back toward that.** The approved direction is an Indian school register:

- Bottle-green *ground* (not black), warm paper in light mode
- Faint horizontal ruling on a 30px rhythm across the whole page
- One red margin line down the left of the content column (`.register`)
- Marigold is the marking colour — used **only** for what is live right now
- Type: Bricolage Grotesque (display) / Archivo (UI) / Azeret Mono (data)
- Light = notebook page. Dark = register cover.

### Product decisions he made and reversed course on

- **No uploads, no database.** He explicitly killed a Supabase upload flow after it was scoped.
  Contributions come by email to `dpsgnotes@gmail.com`.
- **Links, not re-hosting.** NCERT chapters and outside material link to their original hosts.
- **Uday's 8 handwritten PDFs are archived** to `archive/notes/`, removed from the site "for now".
  Restoring one = move the PDF back to `public/notes/` and paste its entry into `resources.ts`.
- **Freemium line:** *free to read, paid to hold.* Nothing gets paywalled that is currently free;
  money only ever comes from printed objects and human effort.

---

## 4. Verified YouTube channels — check before changing

**Lookalike and empty channels are everywhere here.** An HTTP 200 plus a plausible `og:title` is
**not** verification — several dead accounts have exactly the expected name. Always also check the
page for `"doesn't have any content"`, and prefer asking Aryan for the handle.

### Class 11–12
| Subject | Channel |
|---|---|
| Physics, Chemistry | `@AshuGhai11th12th` (Ashu Ghai sir) |
| Mathematics | `@AshuGhai11th12th` (Ushank Ghai sir — same channel) |
| Chemistry (2nd) | `@NCERTWallahClass12PW` |
| English — writing & long answers | `@GrandAcad` |
| English — literature | `@EnglishClassesbyTaniyaSharma` |
| Python | `@programmingwithmosh` |
| Physics practicals | `@experientialphysics` (his own school teacher) |

### Class 10
| Subject | Channel |
|---|---|
| Science | `@AshuGhai9th10th` |
| Science (2nd) | `@Exphub` (Prashant Kirad) |
| Mathematics | `@AshuGhai9th10th` (Ushank sir) |
| Mathematics (2nd) | `@RitikMishraClass9-10`, also `@PW-Foundation` |
| Social Science | `@DigrajSinghRajputOfficial` |
| Social Science (2nd) | `@SunlikeStudy` |
| English | `@StudentsHeaven` |

Umbrella channel: `@ScienceAndFunEducation`

### Known-wrong handles — do not use
`@PrashantKirad` (empty) · `@DigrajSingh` (empty) · `@UshankGhai` (empty) ·
`@ScienceandFun` (a *different* channel) · `@NCERTWallah` (a different channel) ·
`@thegrandacademy`, `@TaniyaSharma` (wrong people)

---

## 5. Technical gotchas — all learned the hard way

1. **Truncated PDF downloads still start with `%PDF`.** The NCERT builder must check for a
   trailing `%%EOF` and retry, or text extraction silently produces garbage titles.
2. **`AnimatePresence mode="wait"` with `Suspense` nested inside causes blank pages.** A lazy
   route that suspends mid-exit-animation leaves AnimatePresence holding an unmounted child.
   `Suspense` must wrap `AnimatePresence`, not the reverse. There is also a `RouteErrorBoundary`.
3. **Vite copies `public/` into every build target.** The SSR build must set
   `copyPublicDir: false` or it duplicates the entire assets folder.
4. **`renderToString` cannot await Suspense.** `entry-server.tsx` renders up to 4 passes,
   checking for the skeleton, so lazy routes resolve.
5. **Radix Accordion content needs `forceMount`** or collapsed chapters are invisible to crawlers.
6. **Prerendered routes must exist as `dist/<route>/index.html`.** Vercel checks the filesystem
   before rewrites, so the SPA fallback only catches unprerendered paths.
7. `scripts/build-ncert.py` shells out to `curl` — this machine sits behind a TLS-intercepting
   proxy that Python's cert store doesn't trust.

---

## 6. Architecture

```
src/
  data/       resources · subjects · ncert(.json) · links · channels · schedule
              · strategy · tools · legacy-routes · types
  lib/        search (Fuse) · marks (CBSE maths) · seo · hooks · motion · theme
  components/ layout · ui primitives · PeriodBar · ResourceCard · CommandPalette
              · RouteErrorBoundary
  routes/     Home · Library · Viewer · Chapters · Resources · Tools · SchoolDay
              · Strategy · About · NotFound
  entry-server.tsx    prerender entry
scripts/
  build-ncert.py      regenerates src/data/ncert.json from ncert.nic.in
  prerender.mjs       renders routes to HTML, writes sitemap + JSON-LD
```

Build: `tsc --noEmit && vite build && vite build --ssr … --outDir .ssr && node scripts/prerender.mjs`

10 prerendered routes. Deployment is **2.6MB** since the PDFs were archived.

---

## 7. What's built

Home (search-first, live period bar) · Chapters (395 chapters, 52 books, Class 10/11/12) ·
Strategy (his full exam philosophy) · Resources (verified channels both years, checked links) ·
Tools (6 CBSE calculators) · School day (editable bell timings) · About · ⌘K palette ·
prerendering + JSON-LD + sitemap · legacy `.html` redirects · error boundary · dark/light · mobile

---

## 8. What's next

> Sequencing now lives in `VISION.md` §10 (Wave 0 → 4). Traffic work comes before features.

### Content-complete v1 — no backend needed
1. ~~**Trust section**~~ — **done**, `/results`. See §2.
1b. ~~**The answer-script pillar**~~ — **done**: `/paper`, plus both scripts published in full.
1c. ~~**Subject guides**~~ — **all five live** at `/guide/:slug`, with an index at `/guide`.
   Weightage is asserted at build time to sum to the paper total.
1d. ~~**Pull an all nighter**~~ — **live** at `/tonight`, and it leads the home page.
2. ~~**Book shelf**~~ — **live** at `/books`. No affiliate links, ever: he can't hold an
   Associates account at 17, and after April 2027 the better reason still stands.

**Still open:** wall charts (3 designed A3 PDFs), the parent one-pager, deadline-alert
emails (needs a backend, which conflicts with the no-backend rule — decide before building),
and SEO/Search Console, which is deferred by his explicit decision until the site is done.
3. **Wall charts** — the list already exists in `strategy.ts`; turn 3 into designed A3 PDFs,
   free to download. Class 10 SST maps, Class 10 Maths formulae, organic conversions.
4. **Hindi guide** — he deferred this; ask when ready.

### No backend required either — worth knowing
- **Study Mode** — ambient background, focus timer, full-screen reading
- **The Desk** — drag-and-drop binder assembly, saved to `localStorage`

### Blocked or needs decisions
- **OSM answer sheets — decision REVERSED, see `VISION.md` §4.** There is no paywall and no
  published scans. **The analysis is free for all five subjects; the original scans are never
  published.** Nobody wants to buy 35 pages of someone else's handwriting — they want to
  understand how marks are awarded. The analysis was always the product; the scans were only ever
  the evidence. (The earlier plan — CS free in full, the other four paywalled — also contradicted
  "everything essential stays free", and a paywall on a static site is cosmetic regardless.)

  **Privacy check on Computer Science is COMPLETE** (28 Jul 2026). All 35 pages rendered and
  visually inspected, and the cover QR decoded — it is `817445528`, the same barcode already
  printed as text on page 1. No name, no roll number, no parents' names, no DOB anywhere in the
  document. The per-page QR stamps are ~25px of scan data and are undecodable by anyone.
  Page 1 also independently confirms the moderation table: it prints `Total Marks: 68` for CS,
  matching the marksheet's theory column exactly.

  Useful method note for the other four: `pymupdf` renders pages (`page.get_pixmap(dpi=105)`) and
  OpenCV's `QRCodeDetector` decodes the cover QR at 600 dpi. Page 1 of each script is real text,
  so `page.get_text()` reads the marks summary directly.

  Source PDFs are in `~/Downloads`, and stay out of the repo:

  | Subject | File | Pages |
  |---|---|---|
  | Computer Science | `5CB3A505-527F-49BA-B866-87C1B07A0241-2.pdf` | 35 |
  | Physics | `1E6C7DA5-BF1C-49F3-99B0-637F5231BEAF.pdf` | 35 |
  | Chemistry | `0DF9A2C7-1765-4F8A-BC96-70A5D5C59566.pdf` | 35 |
  | Mathematics | `1D11A343-8B06-45AB-94B1-FF70D3FC6C0E.pdf` | 43 |
  | English Core | `A8C772D1-B5C5-41D9-8237-9F21ACA3BAAB-2.pdf` | 35 |

  Page 1 of each is the **question-wise marks summary** as real text — no name, no roll number,
  just a barcode. Pages 2+ are pure scans of his handwriting.

  **All five are inspected, redacted and published** at `/paper/script/:slug` — 183 pages.
  `STAMP_BAND` is 0.27; English's scans skew enough to put the stamp at y≈0.21. Inspect every page individually
  before generating anything — that is how the one real mistake was caught.

  `scripts/redact.py <pdf> <outdir> <slug>` does the work and verifies itself. Its stamp filter is
  built from measured geometry (31 real stamps: width 33-38px at 1700px, aspect 1.06-1.29, fill
  0.80-0.93), because a loose filter matched Physics's blue mark chips and would have blacked out
  the marks. Expect **exactly one box per page except pages 3 and 4**; anything else means the
  filter needs re-checking against that subject.

  What gets built from these: **educational walkthroughs, typeset.** Per question — what was
  asked, what he wrote, what the examiner did to it, why the mark went the way it did, and how
  he'd answer it today. Free, all five subjects. The scans stay private and stay out of `git`.
- **Print pre-orders**, **contributor uploads + ₹25/copy royalties** (needs a backend),
  **multi-school**.

### Admin still outstanding

- ~~`dps-gandhinagar.in`~~ — **done 28 Jul 2026.** It was not merely stale: GitHub Pages was
  serving a *stuck deployment of the whole site*, frozen at whatever the last (since-deleted)
  workflow run built. It 404'd on every route added after it and competed with allnighter.in for
  the same content. Pages now publishes the orphan **`legacy-domain`** branch — one page saying
  who owns the domain, `noindex, follow` on every page, `404.html` so old deep links land
  somewhere human. Editing it: push to `legacy-domain`; don't merge `main` into it and don't
  delete its `CNAME`. Note the Pages API does **not** rebuild when you change the source branch —
  `gh api -X POST repos/<owner>/<repo>/pages/builds` after any change.

- **Google Search Console — still not done, and it needs Aryan's Google login.** Everything on
  our side is ready: `robots.txt` allows everything and points at the sitemap, `sitemap.xml` is
  regenerated on every build with all 12 routes, every route is prerendered with its own title,
  description, canonical and OG card. The remaining steps are:

  1. <https://search.google.com/search-console> → add a **Domain** property for `allnighter.in`
     (domain, not URL-prefix — it covers www and both protocols in one).
  2. It will give a **TXT record** to add at the registrar. That's the only verification method
     for a domain property.
  3. Sitemaps → submit `sitemap.xml`.
  4. URL Inspection → request indexing for `/`, `/results` and `/paper` by hand. Those three are
     the pages worth ranking first.
  5. **Do not add `dps-gandhinagar.in` as a property to get it indexed** — it's deliberately
     `noindex` now. Only add it if you want to use *Removals* to flush the old URLs faster; they
     will drop out on their own as Google recrawls and hits the 404s.

- Rename the repo to `allnighter` — deliberately left until last, because renaming can disturb
  Vercel's Git connection and it isn't worth risking a working deploy pipeline mid-session.
  After renaming: `git remote set-url origin …`, then push a trivial commit and confirm Vercel
  still builds. If it doesn't, reconnect the repo in the Vercel dashboard.

---

## 9. Working style

He moves fast, sends corrections mid-turn, and expects things built rather than discussed. He
catches wrong details and calls them out — verify before shipping, especially anything with a
name or a URL attached. Deploy after each meaningful change; he checks the live site.
