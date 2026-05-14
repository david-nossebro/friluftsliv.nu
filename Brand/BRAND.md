# friluftsliv.nu — Brand

> The accessible Swedish home for the outdoors.

This document is the canonical source of truth for the friluftsliv.nu brand:
strategy, audience, personality, voice, and high-level visual direction. It is
written for designers, writers, and engineers who build the product. When this
file conflicts with the code or with other design documents, this file wins
until they are reconciled.

Detailed visual specifications live in their own files. See
[Governance](#9-governance) for the full inventory.

---

## 1. Strategy

### Mission
**Open the Swedish outdoors to everyone who feels drawn to it.**

We are not building a fitness app, a competition platform, or a guidebook for
experts. We are building the door.

### Vision
A Sweden where the outdoors is never out of reach — regardless of where you
live, how fit you are, or how much you already know.

### Positioning
friluftsliv.nu is **the accessible Swedish home for the outdoors** — the site
that opens nature's door to first-timers, weekenders, and lifelong
friluftslivare alike.

### Brand promise
In Swedish nature, you will always know where to start.

We do not promise the experience itself — nature provides that. We promise
orientation: a clear, trustworthy place to begin, every time.

### Tagline
> **Välkommen till den svenska naturen.**

One line. Do not pair it with a second beat. The welcome is the whole
statement — adding more dilutes it. The brand promise belongs elsewhere
(meta descriptions, about page, press copy), not on its coattails.

Why this tagline:
- *Välkommen till…* makes the brand the threshold, not the destination — the
  honest framing for a guide product.
- It quietly invokes **allemansrätten**: nature is already open; we are just
  saying so out loud. No competitor outside Sweden can claim that resonance.
- It is unhurried. No verb is pushed at the user.

### Differentiation

| Competitor | Their position | Our gap to own |
|---|---|---|
| AllTrails | Global scale | Local Swedish knowledge & language |
| Komoot | Route planning, sporty | Accessible to all fitness levels |
| Naturkartan | Nature data, scientific | Warm, human, easy to use |
| ut.no | Norwegian equivalent | The Swedish home — built for here |
| STF | Institutional authority | Lighter, faster, more modern |

**Own:** *The accessible Swedish home.* The site that feels like it was made
by someone who grew up here and genuinely wants you to get outside —
whatever your level.

---

## 2. Audience

**Who it is for:** anyone who feels drawn to the Swedish outdoors.

We do not segment by skill level, age, fitness, or nationality. The product
must work equally well for:

- A 28-year-old in Stockholm planning their first weekend hike
- A family of four choosing a stuga for sportlovet
- A 67-year-old who has walked the Kungsleden three times and wants something
  shorter this year
- A visitor from Berlin or Singapore who wants to understand what
  *friluftsliv* actually means and how to try it

**The 12-and-70 test:** every page of copy must be readable and welcoming to
both a 12-year-old and a 70-year-old. If it would alienate either, rewrite it.

**Implications for design and copy:**
- No skill-level jargon as default vocabulary (*advanced, expert, technical*
  appear only as user-facing filters, never as praise or aspiration).
- No assumed cultural knowledge. If a Swedish concept appears
  (*allemansrätten*, *fjällvandring*, *vindskydd*), explain it in plain
  language the first time, then trust the reader.
- Filter surfaces (distance, difficulty, terrain, season, overnight options)
  are treated as first-class navigation, because matching the right outing to
  the right user is what makes the product feel personal.

---

## 3. Personality

| Trait | What it means |
|---|---|
| **Grounded** | Solid and trustworthy as the trails we map. No hype, no exaggeration — honest, reliable information for every outing. |
| **Inviting** | Nature belongs to everyone. We open the door wide — to the seasoned hiker, the weekend cyclist, and the first-time paddler alike. |
| **Clear** | Like a well-marked trail, the experience is never confusing. Information is structured, purposeful, and easy to act on. |
| **Calm** | The quiet confidence of a forest on a still morning. We do not shout; we guide. We reassure rather than overwhelm. |
| **Purposeful** | Every feature, every page, every word serves one goal: getting the user outside. Form follows function. |

**Read these as a system, not a menu.** A choice that scores high on Calm but
violates Clear is the wrong choice. A choice that is Inviting but not Grounded
is marketing copy, not brand voice.

---

## 4. Voice & Tone

**Speak like** a knowledgeable friend who has hiked every trail and slept in
every cabin — and genuinely wants you to as well. Direct, warm, never
corporate.

**Not like** over-enthusiastic marketing copy that treats the user as a
consumer rather than an explorer.

### Principles

- Use second person — **du / dig** — always.
- Prefer active verbs.
- Keep sentences short. Two short sentences beat one long one.
- Swedish before English in all UI copy.
- The 12-and-70 test ([§2](#2-audience)) applies to every line.

### Language to prefer

| Use | Instead of |
|---|---|
| Hitta din rutt | Optimera din vandring |
| Planera övernattningen | Boka boende |
| Ge dig av | Påbörja äventyret |
| Visa på karta | Visualisera rutten |
| Spara | Lägg till i favoriter |
| Stuga | Boendealternativ |
| Tur, rutt, led | Track, segment |

### Language to avoid

- **Efficiency framing.** *Planera på minuter, i en handvändning, snabbt och
  enkelt, optimera din vandring.* Nature is not a task to optimize. The
  product can be fast; the brand voice should never boast about it. Promising
  speed creates the exact stress the user is trying to escape.
- **Achievement vocabulary.** *Erövra, besegra, klara, utmaning* used as
  encouragement. The mountain is not an opponent.
- **Gamification words.** *Streak, level, badge, score, ranking.* This is not
  a fitness tracker.
- **Anglicisms when a Swedish word is just as clear.** *Hike, trail, route,
  outdoors* in body copy. (English filter labels and proper nouns are fine.)
- **Hedging and disclaimers.** *Eventuellt, möjligen, kan vara.* If something
  is uncertain, name what's uncertain and why, in one sentence.

### Bilingual rule

Swedish is the default everywhere user-facing — copy, route segments,
`aria-label`s, alt text, error messages. English appears only where the
context is explicitly international (`og:description`, future English routes,
international press). Never mix the two languages inside a single UI surface.

### Plain Swedish (accessibility of language)

Write so a 12-year-old and a 70-year-old both understand on first read.
Use vardagsord. Explain facktermer in parentheses the first time they appear
on a page. This is not "dumbing down"; it is the same discipline the brand
applies to everything else — making nature accessible includes making the
words around it accessible.

### Glossary of preferred terms

| Term | Use for | Notes |
|---|---|---|
| **tur** | A planned outing on the site | Matches URL `/turer/[id]`. |
| **rutt** | The path itself (linear or loop) | Use interchangeably with *led* where the trail is formally named. |
| **led** | A formally named trail network | E.g. *Kungsleden, Sörmlandsleden*. |
| **stuga** | Cabin or hut | Not *hytte* (Norwegian) or *cottage*. |
| **naturområde** | Protected or listed nature area | National parks, naturreservat, naturum. |
| **vandring** | Hiking on foot | |
| **paddling** | Kayak, canoe, SUP | |
| **skidåkning** | Cross-country skiing by default | Use *alpint* explicitly for downhill. |
| **friluftsliv** | The cultural concept | Never translate when the word stands alone. Italicise on first use in EN contexts. |

### Microcopy patterns

Concrete patterns. Adapt the wording; keep the shape.

- **CTA buttons:** verb + object. *Hitta din rutt. Visa på karta. Spara
  stugan. Planera turen.*
- **Search placeholder:** *Sök rutt, stuga eller område…*
- **Empty state — no results:** *Inga turer matchade. Försök med ett annat
  område eller en kortare distans.*
- **Error — map fails to load:** *Kartan kunde inte laddas just nu. Försök
  igen om en stund.* (Never blame the user; never blame "the server.")
- **Loading state:** *Hämtar rutter i [område]…* — specific, not *Loading…*.
- **Success — saved:** *Sparad. Du hittar den under Mina turer.*
- **404 / not found:** *Den här stigen leder ingenstans. Tillbaka till
  kartan?*

### Example phrases

> *Hitta din nästa rutt — oavsett om det är 3 km eller 30.*

> *Planera övernattningen. Packa ryggsäcken. Ge dig av.*

> *Naturen väntar. Vi öppnar dörren.*

---

## 5. Visual direction (high-level)

This section sets direction. Detailed tokens and rules live in the files
listed under [Governance](#9-governance).

### Logotype — The Ridgeline

The mark is three layered triangles forming a mountain ridgeline. It is
**anchored** — all three peaks share a common baseline; the mark does not
float. The peaks use **softened angles** (no spikes) so the mark feels
welcoming rather than intimidating. The three layers use the three palette
greens (Birch, Moss, Pine). No colors are introduced for the mark alone.

- Wordmark minimum: 20 px tall.
- Mark-only minimum: 16 × 14 px (favicon).
- Variants: `default`, `reversed`, `mark-only`, `all-white`. Use
  `mark-only` on tight surfaces (favicon, app icon, share badges).
- **Never** use the colored `default` variant on Moss, Pine, or Birch
  surfaces (contrast fails). Use `reversed` or `all-white` instead.

Full anatomy, clearspace, color variants, and misuse rules:
[`Design/logotype-ridgeline-final.html`](../Design/logotype-ridgeline-final.html).
Component implementation:
[`src/components/brand/Logo.tsx`](../src/components/brand/Logo.tsx).

### Color

Nine core hues (Pine, Moss, Birch, Mist, Sky, Earth, Ember, Snow, Ink) plus
an extended tonal range (Pine-dark/light, Moss-light, Birch-pale, Mist-dark,
Sky-dark, Earth-light, Ember-dark/deep, Ink-soft, Stone, Stone-light).

- **Primary:** Pine `#2C4A3E` — headers, primary buttons, key UI.
- **Accent:** Ember `#D97B4F` — CTAs and highlights only. Use sparingly; it
  is the only warm color in the system and earns its weight by being rare.
- **Muted text:** Stone `#5F7568` — meta, captions, secondary labels.
- **Background:** Snow `#F8FAF7` (page), Mist `#EFF4EC` (cards/sections).

Activity-coded route lines use Moss (hike), Earth (bike/MTB), Sky (paddle),
Birch (ski). Defined once; never improvised at the component level.

Token names and full extended palette: [`src/app/globals.css`](../src/app/globals.css).
Visual reference: [`Design/design-system.html`](../Design/design-system.html).

### Typography

Two typefaces. No exceptions.

- **Fraunces** — variable serif. Display and headings. Light weight (300)
  for editorial calm; never bold.
- **DM Sans** — variable humanist sans. Body, UI, labels. Weights 300 / 400 /
  500.
- Maximum **2 typefaces** in the entire product.
- Maximum **4 type sizes** on any single page.
- Body line-height **1.6–1.7**. Heading line-height **1.1**.
- Large, confident headings + lightweight body text. Never the other way
  around.

Full type scale and weights: [`src/app/globals.css`](../src/app/globals.css)
under `@theme`.

### Imagery

**Use:**
- Real people in real Swedish landscapes.
- Natural light — golden hour, mist, blue hour.
- Wide, breathing compositions with negative space.
- All four seasons (snow, autumn colour, summer green, spring thaw).
- Mixed ages and group sizes — families, friends, solo walkers.
- Lightly desaturated. Let nature's own palette lead.

**Avoid:**
- Stock-photo perfection and posed smiles.
- Heavy Instagram filters or artificial colour grading.
- Only elite athletes or extreme conditions.
- City environments or built infrastructure.
- Lone hero-on-summit clichés that alienate beginners.

**Sourcing:** external image hosts must be allowlisted in
[`next.config.ts`](../next.config.ts) (`images.remotePatterns`). Currently
only `images.unsplash.com`. A long-term Swedish-specific photography plan is
an open gap — see [§10](#10-gap-report).

### Motion

Motion serves navigation and feedback — never decoration. One orchestrated
page-load reveal per page. Transitions use `--ease-out` by default for
responsive arrivals. Always respect `prefers-reduced-motion`: animations
collapse to instant.

> If an animation makes the product feel busier, remove it.

Token names (`--duration-fast/base/slow`, `--ease-out/in/io`) and animation
rules: [`src/app/globals.css`](../src/app/globals.css) and
[`Design/design-system.html`](../Design/design-system.html).

---

## 6. Accessibility & inclusivity

Accessibility is not an aspiration here. It is the floor.

- **Contrast:** WCAG 2.2 AA (4.5:1 for body text, 3:1 for large/UI text) is
  non-negotiable. AAA where comfortable for body copy.
- **Never rely on colour alone** to communicate state, category, or meaning.
  Activity-coded route lines must always be paired with an icon or label.
- **Focus:** every interactive element has a visible focus ring (2 px solid
  Moss, 2 px offset). Never `outline: none` without a replacement.
- **Touch targets:** ≥ 44 × 44 px on mobile. Spacing between targets ≥ 8 px.
- **Motion:** respect `prefers-reduced-motion`. The project's CSS already
  collapses animations to 0 ms in that mode — keep it that way.
- **Alt text:** every non-decorative image has descriptive Swedish alt text.
  Decorative images use empty `alt=""`. Photos of routes describe the
  landscape, not the photographer's impression of it.
- **Language accessibility:** plain Swedish. See [§4](#plain-swedish-accessibility-of-language).
- **Dark mode:** not the default. This is a daylight, outdoors product. A
  dark variant may exist for accessibility but is opt-in.

Automated guardrails already in place: `eslint-plugin-jsx-a11y`,
`vitest-axe`'s `toHaveNoViolations`, Lighthouse mobile a11y assertion at
0.95 minimum. **Do not regress these.**

---

## 7. Do's & Don'ts

### Do

- Lead with the **map or search** as the hero — the product *is* the utility.
- Use **generous whitespace.** Let content breathe like a forest clearing.
- Design **thumb-first** — bottom navigation, large tap targets, fast
  filters. Most planning happens on phones.
- Keep navigation **shallow** — two taps maximum to reach a route or cabin.
- Show **elevation, distance, and difficulty** at a glance on every route
  card.
- Use **simple, universal icons** for activities (hike, bike, paddle, ski).
- Use **rounded but not cartoonish** UI components (radius 6–10 px).
- Apply **subtle terrain textures** on landing sections for depth.
- **Trust the photography.** Let it fill the space without heavy UI overlay.
- Use the **Ridgeline mark** as the unmistakable visual signature wherever
  the brand needs to be claimed.

### Don't

- Don't use **dark mode as default** — daylight product.
- Don't use **energy-drink gradients** or aggressive sports-app aesthetics.
- Don't **crowd the map UI** with overlays and toolbars.
- Don't use **more than 2 typefaces** or 4 type sizes per page.
- Don't let the design **alienate beginners** — no "expert only" visual
  language.
- Don't animate **for the sake of it.** Motion must serve navigation or
  feedback.
- Don't use **heavy drop shadows** (opacity ≤ 10 %). Surfaces stay
  flat-ish.
- Don't rely on **colour alone.**
- Don't **over-gamify** with badges, streaks, levels, or scores.
- Don't let **ads or promoted content** visually blend with organic results.
- Don't claim **speed** in brand copy. (See [§4 Language to avoid](#language-to-avoid).)

---

## 8. Brand in product behavior

The product behaviour itself is part of the brand. These are the rules where
brand and product design meet — keep them in mind for any new surface.

- **The map is the heart.** It must be fast, uncluttered, and work on poor
  mobile connections. Overlays are minimal and dismissible. Route lines use
  activity-coded colours, never a single default.
- **Route and cabin cards** show thumbnail · activity icon · distance ·
  elevation gain · difficulty pill · region. Nothing more at list level.
  Details expand on tap.
- **Filters are first-class citizens**, not an afterthought. Activity,
  difficulty, region, overnight option, and season are reachable in one
  step.
- **Cabins and overnight listings** are treated like route cards —
  visual-first, scannable. Booking or info CTA is clearly separated from
  content.
- **Loading is honest.** *Hämtar rutter i Skåne…*, never a spinner alone.
- **Errors never blame the user.** They name what failed and offer the next
  step.

---

## 9. Governance

### Source of truth

- **Strategy, voice, high-level visual direction:** this file.
- **Design tokens** (colour, type scale, spacing, radius, shadow, motion):
  [`src/app/globals.css`](../src/app/globals.css) under `@theme {}`.
- **Logotype rules** (anatomy, clearspace, variants, misuse):
  [`Design/logotype-ridgeline-final.html`](../Design/logotype-ridgeline-final.html).
- **Design system reference** (every layer, with examples):
  [`Design/design-system.html`](../Design/design-system.html).
- **Logotype implementation:**
  [`src/components/brand/Logo.tsx`](../src/components/brand/Logo.tsx).
- **Allowed external image hosts:**
  [`next.config.ts`](../next.config.ts) (`images.remotePatterns`).
- **Working agreements for agents** (engineering conventions):
  [`CLAUDE.md`](../CLAUDE.md), [`AGENTS.md`](../AGENTS.md).
- **Forward-looking tooling charter:** [`TECHSTACK.md`](../TECHSTACK.md).

### Brand owner
David (currently the sole owner). Brand decisions are made here.

### Changing a brand decision
1. Update this file first.
2. Propagate to design-system HTML and `globals.css` tokens.
3. Update affected components.
4. When this file disagrees with code, this file wins until reconciled.

### What does **not** live here
- Component implementations and stories — `src/components/**` + Storybook.
- Detailed Lighthouse thresholds — `lighthouserc.mobile.js`,
  `lighthouserc.desktop.js`.
- Domain seed data — `src/data/`.

---

## 10. Gap report

Decided but not yet built, or still genuinely open:

- **Photography plan.** Currently relying on Unsplash. A Swedish-specific
  library (commissioned or curated stock) is needed before launch at scale.
- **Email and transactional brand.** No template exists. Will need one once
  Resend is wired (per [`TECHSTACK.md`](../TECHSTACK.md)).
- **OG and social image system.** No canonical templates yet. Should
  feature the Ridgeline mark prominently and follow type/colour rules.
- **Activity-colour mapping.** Direction is set (Moss / Earth / Sky /
  Birch) but not yet codified in a single component or spec.
- **English parity.** Scope and copy strategy for international users not
  yet defined. Default remains Swedish-first.
- **Dark mode.** Direction is "not default." A future opt-in variant for
  accessibility is unspecified.
- **Tone-of-voice examples for harder surfaces.** Error states beyond the
  map, billing/booking confirmations (when they exist), legal copy.

These are honest open questions, not failures. Decide them as the product
encounters them.
