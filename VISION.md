# All Nighter — product direction

Settled 28 July 2026, between Aryan and Claude, working from
`All_Nighter_Strategy_Vision.md`. This supersedes that draft wherever they
disagree — and they disagree in several important places.

`HANDOVER.md` is the technical state of the repo. **This file is why.** When the
two conflict, this one is newer.

---

## 1. Positioning

> **All Nighter isn't where you study all year. It's where you go when you didn't.**

Rejected: *"the operating system for CBSE students."* It's startup language, it
demands infinite breadth, and it fights the one question that governs this
project — *does this save a stressed student time?*

The positioning above is defensible precisely because **no coaching company can
honestly say it.** PW, Vedantu and Unacademy are built on long-term subscription
engagement; "you can survive this in one night" destroys their model. Aryan
scored 95.2% and 92.8% as a last-minute studier, twice. That asymmetry is the
entire moat, and it is not clonable.

### The governing principle

> **Don't become broader. Become deeper.**

Own one emotional moment completely: the student who has just realised the exam
is tomorrow and needs someone trustworthy. Expansion means going deeper into the
CBSE exam machine, not sideways into more boards.

---

## 2. The signature experience — "Pull an all nighter"

The strategy draft listed nine features: *How Cooked Am I · Can I Still Score
90 · Need 33 Marks · Panic Meter · Marks Predictor · Survival Kit Generator · If
You Only Have 2 Hours · Emergency Revision Mode · Last Night Planner.*

**They are all one feature.** Every one takes *(what you've got, how long you've
got)* and returns *(an honest verdict, a plan)*. Nine names would be nine
shallow toys on a Tools page. Build one thing instead.

The brand name becomes the verb. One button:

```
Tomorrow's exam?  Let's survive it.
[ Pull an all nighter → ]
```

Three questions — **three taps, not three text fields.** At 11pm on a phone in
the dark, typing is a tax:

| Question | Interaction |
|---|---|
| Which paper? | Tap a subject chip |
| When is it? | Pre-filled from the CBSE date sheet, one tap to confirm |
| How prepared are you? | Three honest options, not a slider |

Then the site empties out: countdown, hour-by-hour plan to the exam, and *inside
that plan* the chapters, formula sheets, PYQs and videos for those hours.
Nothing else on screen.

### Two rules for the verdict

1. **Never flatter.** If they're cooked, say cooked. The credibility of this
   entire site is that it doesn't lie about marks — that has to hold here too.
2. **Never hopeless.** Brutal about the situation, never about the person. There
   is always a plan, even if the plan is small.

### The sleep recommendation is the most important part

A study site telling you to stop studying and go to bed is the moment a student
screenshots it and sends it to a friend. It is also just true. Do not soften it
into a suggestion.

---

## 3. Moderation is the front door, not a feature

The strategy draft listed "moderation evidence" as one bullet among eleven. It is
the only unclonable, search-winnable asset this project owns. Nobody else in
India has both documents and thought to line them up.

`/results` ships the evidence: **+9 marks across five papers, 91.0% → 92.8%,
three subjects matching exactly.**

The pillar it opens — **"what actually happens to your paper after you hand it
in"** — is the highest-priority content on the roadmap. It is unowned, it answers
high-anxiety queries with no authoritative answer anywhere (`is cbse moderation
real`, `does cbse give grace marks`), and it is *reassuring*, which is the
emotional job this site does.

Material already in hand from the Computer Science script: the barcode, the QR
stamp on every page, the examiner's green ticks and red circles, the "Blank Page"
stamps, the rough-work page, the OSM ordering window, and the +7 on Chemistry.

---

## 4. Answer sheets — decided, and it reverses the earlier plan

**There is no paywall. There was never going to be a working one.**

| | |
|---|---|
| **Free, all five subjects** | The analysis — annotations, why each mark was awarded, why marks were lost, how he'd answer it today, what moderation did |
| **Free, published in full** | The scans themselves, redacted |

**Reversed again, 28 Jul 2026, and Aryan was right.** Both of us had argued the
scans should stay private. His counter: *"otherwise how will students trust me"* —
evidence nobody can look at isn't evidence. `/paper` makes a lot of claims about
what CBSE does to a paper, and a skeptical student had only our word for them.

**Computer Science and Physics are up in full** at `/paper/script/:slug` — 70
pages between them. Only three things are covered, and all three identify the
*script* rather than the candidate: the page-1 barcode, the cover's office-use
block (QR plus IDEN/BAG/CHK), and the scanning centre's per-page stamp.
Handwriting, marks, ticks, crosses and corrections are untouched — covering those
would defeat the purpose.

The no-paywall part stands and is not revisitable: it contradicted *"everything
essential stays free"*, and a paywall on a static site is cosmetic anyway —
anything under `public/` is fetchable by URL. Nobody was going to buy 35 pages of
someone else's handwriting. What changed is only whether the scans are published,
not whether they're sold. They are not sold.

This supersedes HANDOVER.md §8's "Computer Science free in full, the other four
paywalled."

**Before any other subject goes up, every one of its pages must be looked at
individually.** Computer Science and Physics have been; Chemistry, Maths and
English have not. This is not a formality, and it has now caught two separate
problems: the first CS run boxed three chunks of a real answer, and the CS-era
filter matched up to twelve of Physics's blue mark chips per page. Both would
have censored the evidence rather than protecting anyone.

**Privacy checks complete for Computer Science and Physics** — all 70 pages
inspected 28 Jul 2026, plus the CS cover QR decoded (`817445528`, the same
barcode already printed as text on page 1). No name, no roll number, no parents'
names, no DOB anywhere in either document. That is what made publishing them
possible.

The source PDFs still stay out of git; what ships is the redacted render under
`public/script/`, produced by `scripts/redact.py`. That script re-runs QR
detection over its own output at two scales and exits non-zero if anything still
decodes, so a bad render fails the build rather than reaching the site.

---

## 5. What we don't build

**No AI chatbot. No AI answer evaluator.** Students already have ChatGPT, Gemini,
Claude and Perplexity free in their pocket, and all four are better than anything
we'd ship. It saves zero time versus what they have, it costs money per query on
a project with ₹0 revenue, and one confidently wrong answer burns the only asset
we own. Our advantage is curation, honesty and knowing what a student actually
needs — not intelligence.

**No parent section.** A tab written for parents collides with a voice built on
*"I've been through this."* Instead: **one printable page, no tab.** The student
sends it to their mum. That makes it a gift the student gives rather than a room
the site keeps — and unlike a tab, it travels through family WhatsApp.

**No school-ambassador programme yet.** Build the product first and see whether
students want to contribute. Don't engineer a community before product-market
fit.

---

## 6. Notes stay handwritten, wrapped in HTML

A handwritten note's value *is* the handwriting; converting it to a webpage
destroys what made it worth having. But PDF-only is invisible to Google.

So each note gets a page that carries: **a summary, the topics covered, quick
navigation, and a download button** — with the handwritten document as the
primary content. Authenticity intact, discoverability fixed.

(Currently moot: Uday's 8 handwritten PDFs are archived to `archive/notes/` and
off the site. This is the pattern to apply when notes return.)

---

## 7. Email — 5 to 10 a year, every one earning its place

No newsletter. Nobody reads a newsletter. Send only:

- The OSM ordering window opening — **and closing**
- Date sheet released
- A major new moderation article
- A significant new calculator
- A new printable revision kit

This is the one email a CBSE student genuinely wants, it's time-critical, nothing
else on the internet does it well, and **it returns every year on its own.** Frame
every capture on the site as deadline alerts, never as "subscribe".

---

## 8. Voice

Useful is the floor. Memorable is the goal. The small moments are what students
remember:

> *"You're medium rare."*
> *"Go sleep. Seriously."*
> *"You've done enough for tonight."*
> *"Drink some water."*

Honest, warm, never a motivational poster. Never *"wake up at 5 AM."* Always
*"I've already been through this, here's exactly what you need."*

Imperfection builds trust: his worst paper, the methods that failed, the marks
that were bad. Keep publishing those.

---

## 9. Growth

**The link preview is the product.** For most WhatsApp impressions the OG card is
the entire experience. One generic sitewide image is leaving the single cheapest
win on the table — per-page cards carrying a *number* (*"+9 marks. CBSE
moderation is real."*) will outperform any feature here for an afternoon's work.

Distribution: Google, WhatsApp, Reddit, friends. Never advertising. The target
sentence is *"bro, just use All Nighter"* — which is why the flagship feature is
named so that the sentence says itself.

---

## 10. Sequence

Traffic before features. **The site currently has no Search Console submission at
all** — building experiences for zero visitors is malpractice.

### Wave 0 — unglamorous, highest ROI, days not weeks
- ~~Kill the duplicate `dps-gandhinagar.in` copy~~ — **done.** See HANDOVER §8.
- ~~Per-page OG images~~ — **done.** Every route renders its own card at build
  time, leading with a number where there's an honest one.
- Search Console + sitemap — **blocked on Aryan's Google login.** Everything on
  our side is ready; the exact steps are in HANDOVER §8.
- Rename the repo to `allnighter` — last, so a rename can't disturb Vercel's Git
  connection while there's still work shipping.

### Wave 1 — the moat
- ~~`/results`~~ — **shipped.** Both marksheets plus the moderation receipt.
- ~~"What happens to your paper after you hand it in"~~ — **shipped** at
  `/paper`. The journey, the anatomy of the booklet, the full transcribed
  question-wise marks summary, and six lessons. Its best moment is arithmetic:
  the unasterisked rows total 68, exactly the printed total, which turns the
  footnote from a claim into a proof.
- ~~The scripts themselves~~ — **Computer Science and Physics are published in
  full** at `/paper/script/:slug`, 70 pages between them, every page inspected
  individually first.
- Still to do: Chemistry, Mathematics and English scripts. Each needs its pages
  inspected one by one before anything is generated — that step is not optional
  and it is what caught the one real mistake.
- Still to do: the per-question walkthrough — what was asked, what he wrote,
  what the examiner did to it, how he'd answer it today. That one needs Aryan,
  not just the document.

### Wave 1b — subject guides *(the positioning Aryan articulated)*

> *"Free content is available, but it's scattered. I've put it all together with
> in-depth analysis."*

Curation as the product, not content as the product. **Physics and Chemistry are
live** at `/guide/:slug`. Rules that make them worth trusting are in
`src/data/guides.ts`: weightage must come from CBSE and is asserted at build
time to sum to 70, no channel goes in unverified, and where a source doesn't
settle something the page says so rather than filling the gap.

The unclonable half of each guide comes from his own script, not the web — the
half-mark findings, the question that scored zero. The web only supplies
weightage and paper structure, which every coaching site already has. **So do
the script before the guide for each remaining subject.**

Still to do: Maths, English, Computer Science guides.

### Wave 2 — the signature
Pull an all nighter.

Now unblocked in principle — two guides exist to curate from — but still thin
until more subjects land. Build it once three or four guides are up, not before,
or the plan it produces will point at nothing.

> ⚠️ **Content dependency, not yet costed.** The experience promises important
> chapters, formula sheets, PYQs and last-minute videos *per subject*. Today the
> site has NCERT chapter links and channel recommendations — no formula sheets,
> no PYQs, no ranking of which chapters actually matter. The shell is a few days'
> work and would be empty.
>
> **So: do one subject completely before widening.** Pick the highest-anxiety,
> highest-volume paper, build it end to end, prove the experience is worth
> having, then repeat. Five shallow subjects is the failure mode.

### Wave 3 — the loop
Deadline alerts · the parent one-pager · wall charts as free A3 PDFs (which
double as the first real demand test for printed products)

### Wave 4 — only if 1–3 land
Pre-orders · contributors · other boards

---

## 11. The tension to decide consciously, not drift into

The moat is **one person's honest voice with receipts.** Phase 3 of the strategy
draft was *more schools, more boards, ambassadors.*

These are in direct opposition. Fifty contributors and one honest voice cannot
coexist — scale the contributors and *"here's my worst paper"* becomes *"here's
our content,"* which is the moment the trust evaporates.

Current call: **a small permanent authority over a big generic platform.** Expand
by depth, not breadth.

Open and worth answering early: Aryan is class of 2026. Who runs this in 2028,
and does the voice survive the handover?

---

## 12. Revenue

₹0 for now, deliberately. He is 17 until April 2027, which blocks every Indian
payment gateway (18+ with PAN). That constraint is doing the strategy a favour —
build assets, not income.

When money does arrive it comes from **convenience and physical objects**: printed
revision kits, flashcards, wall charts, planners, offline packs. Never from
information. Students pay for convenience; parents pay for quality.
