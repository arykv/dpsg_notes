# All Nighter — handover

Everything a new session needs to pick this up. Written 28 July 2026.

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
| Repo | `github.com/arykv/dpsg_notes` — **not yet renamed** to `allnighter` |
| Local | `~/Documents/dpsg-notes` |
| Hosting | Vercel, project `allnighter` under `arykvs-projects`, auto-deploys from `main` |
| Old domain | `dps-gandhinagar.in` — still on GitHub Pages serving a **stale copy**, must become a redirect |
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
nobody has both documents and thinks to compare them. This is not yet on the site and should be.

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

### Content-complete v1 — no backend needed
1. **Trust section** — both marksheets as components + the moderation comparison. *Highest value,
   still not built.* Needs: which OSM pages he'll show redacted.
2. **Book shelf** — MTG and others, with the required Amazon Associates disclosure.
   Needs: exact titles from him.
3. **Wall charts** — the list already exists in `strategy.ts`; turn 3 into designed A3 PDFs,
   free to download. Class 10 SST maps, Class 10 Maths formulae, organic conversions.
4. **Hindi guide** — he deferred this; ask when ready.

### No backend required either — worth knowing
- **Study Mode** — ambient background, focus timer, full-screen reading
- **The Desk** — drag-and-drop binder assembly, saved to `localStorage`

### Blocked or needs decisions
- **OSM answer sheets — decided 28 Jul 2026.** *Computer Science (98) goes up free in full.*
  The other four (Physics, Chemistry, Maths, English) are paywalled.

  Source PDFs are in `~/Downloads`, not yet in the repo:

  | Subject | File | Pages |
  |---|---|---|
  | Computer Science | `5CB3A505-527F-49BA-B866-87C1B07A0241-2.pdf` | 35 |
  | Physics | `1E6C7DA5-BF1C-49F3-99B0-637F5231BEAF.pdf` | 35 |
  | Chemistry | `0DF9A2C7-1765-4F8A-BC96-70A5D5C59566.pdf` | 35 |
  | Mathematics | `1D11A343-8B06-45AB-94B1-FF70D3FC6C0E.pdf` | 43 |
  | English Core | `A8C772D1-B5C5-41D9-8237-9F21ACA3BAAB-2.pdf` | 35 |

  Page 1 of each is the **question-wise marks summary** as real text — no name, no roll number,
  just a barcode. It's the most interesting page and the safest to show, so it's the natural
  free preview for the paywalled four. Pages 2+ are pure scans of his handwriting.

  **Outstanding before publishing the CS one: nobody has visually inspected pages 2–35.** Extract
  the page images (`pip install 'pypdf[image]'`) and look for a roll number or name written on
  the booklet. Do not publish unchecked.

  Two blockers on the paywall itself: a paywall on a static site is cosmetic — anything under
  `public/` is fetchable by URL, so paid PDFs must stay out of the deployment entirely. And he
  can't take payments until April 2027. So build: CS free, marks-summary previews for the rest,
  and an email-capture instead of a checkout.

  Standing advice he's heard once: sell the **analysis** (reconstructed, annotated, typeset)
  rather than raw scans. CBSE releases these for personal verification, and the typeset version
  is more useful anyway.
- **Print pre-orders**, **contributor uploads + ₹25/copy royalties** (needs a backend),
  **multi-school**.

### Admin still outstanding
- `dps-gandhinagar.in` → add to Vercel as a redirect (currently a stale Pages copy — duplicate
  content risk)
- Google Search Console + sitemap submission — never done, for either domain
- Rename the repo to `allnighter`

---

## 9. Working style

He moves fast, sends corrections mid-turn, and expects things built rather than discussed. He
catches wrong details and calls them out — verify before shipping, especially anything with a
name or a URL attached. Deploy after each meaningful change; he checks the live site.
