# Content Improvements Plan — friluftsliv.nu

## Context

A content review by three perspectives — a friluftsliv domain expert, a brand-design expert, and a UX expert — concluded that **friluftsliv.nu currently delivers a high-quality led-databas with a friendly tone, but under-delivers on its own brand promise of *orientation*: "In Swedish nature, you will always know where to start."** The site is strong at *"choose a route"* but weak at *"drömma → välja område → planera logistik → veta vad som gäller här"*.

The information that closes this gap (allemansrätten, eldningsförbud, ren-områden, season nuance, fjällsäkerhet, overnight chain on long hikes, real filters on Utforska) is **brand-completing, not brand-stretching**. The risk lives in *framing* — keeping the voice calm, the visual treatment quiet, and the page structure breathing.

This plan organizes the work into eight phases ordered by ROI / implementation-complexity ratio. Each phase ships independently. Phases 6–7 carry the highest user-visible impact and are intentionally placed after the lower-complexity content work that establishes patterns they extend.

---

## Summary of findings (cross-cut)

**Content gaps (domain).** No allemansrätten anywhere. No area-specific regler on `/omraden/[id]` (the very reason that page exists). No fjällsäkerhet pointer on exposed routes. Long-hike pages don't show which stuga you sleep in between stages. Utforska has no real filters (region/säsong/svårighet/distans/utan bil). No seasonal entry point on the home page. No friluftsliv-basics hub for beginners.

**Voice risk (brand).** Avoid news-register ("just nu!"), warning-register ("säkerhet" as fear), bureaucratic-register ("förbud"), and expert-register (no "Avancerad" difficulty). All new content stays *Jordnära · Inbjudande · Tydlig · Lugn · Meningsfull*. Ember is the one earned accent — reserved for an actively-live eldningsförbud surface only.

**Structure (UX).** IA is sound; enrich don't restructure. Three high-leverage shifts: faceted Utforska, vertical itinerary on long hikes, and one standardized "Innan du går" section pattern across all detail pages. Use the existing `DetailPageAnchors` component to absorb new content without crowding any one page.

**What we will *not* do.** Drop these from scope:
- Per-route mobile-coverage data (high maintenance, low decision-value at route level — single line on foundation page covers it).
- Per-route packlista (site has no editorial authority for it yet; better as season-themed articles later).
- "Säkerhet" / "Viktigt" / "Avancerad" labels anywhere (brand-breaking).
- Eldningsförbud as a sitewide banner (only contextual surface).
- Adding "Friluftsliv" to global nav (over-elevates; lives under Om oss).

---

## Phases (ordered by ROI / complexity)

### Phase 1 — Foundation page `/friluftsliv` *(highest ROI, lowest complexity)*

Editorial hub that detail pages can link to with one verb-phrase. Removes the duplication problem (each detail page would otherwise need to repeat regler/säsong/säkerhet).

- **New route:** `src/app/friluftsliv/page.tsx` (server component).
- **New section components** under `src/components/sections/friluftsliv/`:
  - `AllemansrattenSection.tsx`
  - `EldningSection.tsx` (incl. how to learn the current förbud status)
  - `RenbetesSection.tsx` (hund-regler, respekt)
  - `MyggSection.tsx` (när och var, kort)
  - `VattenSection.tsx` (på fjället, längs leder)
  - `FjallsakerhetSection.tsx` (links to SMHI Fjäll, Naturvårdsverket, 114 14)
- **Layout:** identical chrome to `/om` — `PageLayout`, large Fraunces 300 headings, generous whitespace, photography-led.
- **Page heading:** *"Innan du går"* (NOT "Säkerhet", NOT "Viktigt"). Subheading: *"Sju saker som är bra att veta om svensk natur."*
- **Add to footer** `Innehåll` column: *Innan du går* → `/friluftsliv`.
- **Add to home** `Vad du hittar här`-row (fourth pillar card): *Innan du går*.

**Voice samples** (drop into copy work — already brand-checked):
- *"Allemansrätten är friheten att vara i naturen — och ansvaret att lämna den orörd. Du får gå, paddla och tälta nästan överallt, så länge du inte stör och inte förstör."*
- *"Innan du går: kolla vädret hos SMHI Fjäll och titta på Naturvårdsverkets fjällsäkerhet. Skriv ned vart du ska — och säg till någon."*

**Critical files:**
- `src/app/friluftsliv/page.tsx` (new)
- `src/components/sections/friluftsliv/*.tsx` (new)
- `src/components/layout/SiteFooter.tsx` (add link)
- `src/components/sections/AboutContentHighlightsSection.tsx` (add fourth pillar)

---

### Phase 2 — About page: name allemansrätten *(high ROI, trivial complexity)*

The about page currently never says the word *allemansrätten*. For a brand built on accessibility to Swedish nature, this is the single biggest voice-omission on the site.

- Edit `src/components/sections/AboutMissionSection.tsx` to weave allemansrätten into the existing *"Tanken bakom"* — one sentence, no new section.
- Optional: extend `AboutContentHighlightsSection` to mention the new `/friluftsliv` hub as a fourth content pillar (done in Phase 1).

**Critical files:**
- `src/components/sections/AboutMissionSection.tsx`

---

### Phase 3 — Standardize detail-page section vocabulary + anchors *(high ROI, low complexity)*

Today, detail pages have slightly different section ordering. `DetailPageAnchors` exists but is only used on long-hike pages. Roll it out as the consistent navigation primitive on every detail page, with a fixed section order driven by planning stage (Is this me? → What's it like? → Can I get there? → Karta → Innan du går → Liknande).

- Add `DetailPageAnchors` to `RouteDetailPage`, `StageDetailPage`, `CabinDetailPage`, `AreaDetailPage`.
- Introduce a new section **"Innan du går"** on each detail page. Short — three short bullets max + one prose paragraph. If a detail has nothing special, the section is `null` (do not render an empty "inga särskilda regler").
- Content of "Innan du går":
  - Säsongs-nyans (e.g. *"Bäst juni–september. Snön kan ligga kvar på Tjäktjapasset in i juni."*)
  - Eldningsförbud-state — Phase 8 wires it live; until then, leave the slot in the layout for an editorial note when relevant.
  - Hund-policy (one line; "Hund tillåten kopplad" or "Lös hund tillåten utanför juni–augusti").
  - Vatten — only on long hikes and exposed routes (1 line).
  - Link out: *"Läs om allemansrätten"* → `/friluftsliv#allemansratten`.
  - For fjäll-flagged routes only: *"Innan du går i fjället"* link block → `/friluftsliv#fjall`.
- Visual treatment: identical to existing "Tips för turen" — Mist-backgrounded section, no border, no shadow, no warning iconography.

**Critical files:**
- `src/components/sections/DetailPageAnchors.tsx` (verify it supports all detail types)
- `src/components/sections/RouteDetailPage.tsx`
- `src/components/sections/StageDetailPage.tsx`
- `src/components/sections/CabinDetailPage.tsx`
- `src/components/sections/AreaDetailPage.tsx`
- New: `src/components/sections/BeforeYouGoSection.tsx` (shared)

---

### Phase 4 — Per-area regler block on `/omraden/[id]` *(high ROI, low complexity)*

Nationalparker and naturreservat *exist* legally because they have rules. The page that names an area must surface those rules — eld, tält, hund, fiske, bär — as a small editorial block.

- New section on `AreaDetailPage`, between *Om området* and *Utforska i området*: heading *"Här gäller"* (NOT *"Regler"*).
- Visual: bullet list of 4–6 short, declarative sentences. Mist background. No iconography.

**Voice sample:**
> Här gäller
> - Hundar ska vara kopplade hela året.
> - Eld får göras upp på fasta eldplatser.
> - Tält reses bara på markerade tältplatser.
> - Bärplockning för eget bruk är fri.
> - Ta med skräpet hem.

- **Data model:** add `rules: string[]` (or structured `rules: { eld, tält, hund, fiske, bär, övrigt }`) to `Area` in `src/types/`. Author into `src/data/areas.ts`.

**Critical files:**
- `src/types/index.ts` (Area type extension)
- `src/data/areas.ts` (author content)
- `src/components/sections/AreaDetailPage.tsx`
- New: `src/components/sections/AreaRulesSection.tsx`

---

### Phase 5 — Seasonal home module *(medium ROI, low complexity)*

Anchored editorial section on the home page that gives a *"this month"* doorway into the catalog without slipping into news-register.

- New home-page section between *Populära rutter* and *Stugor och fjällstationer*.
- Heading includes the month: *"Maj i naturen"* (or current month). Sub-line in Stone: *"Uppdateras varje månad"* (quiet, no badge).
- Two-paragraph editorial intro + 4–6 hand-picked route/area cards.
- CTA at section end: *"Se alla turer för maj"* → `/utforska?season=may` (the season facet enabled in Phase 7).
- **Hybrid pattern:** editorial section is the brand-tone moment; the link target is the data-driven facet view. Editorial part is manually authored; link target works automatically once Phase 7 lands.

**Brand guardrails:**
- NOT a carousel. NOT animated.
- NOT a feed.
- Static section, refreshed monthly.

**Critical files:**
- `src/components/sections/HomePageView.tsx`
- New: `src/components/sections/SeasonalSection.tsx`
- `src/data/seasonal.ts` (new — month-by-month editorial blocks + handpicked id lists)

---

### Phase 6 — Long-hike vertical itinerary with sleep nodes *(very high ROI, medium complexity)*

The single most impactful UX shift. Promotes the long-hike page from a stats display to a real planning tool.

Replace the existing flat stage list with a **vertical itinerary**:

```
Etapp 1   Abisko → Abiskojaure         14 km · medel
          ─── sover i Abiskojaure stuga ───
Etapp 2   Abiskojaure → Alesjaure     21 km · medel
          ─── sover i Alesjaure stuga ───
...
```

- Sleep nodes are mini-cards linking to `/stugor/[id]`.
- For long hikes with multiple cabin options per night, the sleep node lists 2–3 alternatives compactly.
- The current stage row stays a link to the stage page.
- Optional: add an "estimated daylight" field for the first day (informational, no warning copy).

**Data model:**
- Add `sleepOptionIds: string[]` to `Stage` (one or many cabin ids), OR `sleepBetween: { afterStageId: string, cabinIds: string[] }[]` on `LongHike` if sleep nodes are between stages rather than after each one.
- Author into `src/data/stages.ts` / `src/data/longHikes.ts`.

**Critical files:**
- `src/types/index.ts` (Stage and/or LongHike type extension)
- `src/data/stages.ts`, `src/data/longHikes.ts`
- `src/components/sections/LongHikeStageList.tsx` (rewrite as itinerary)
- New: `src/components/sections/SleepNode.tsx` (or compose with `CabinCard` mini variant)

---

### Phase 7 — Utforska faceted-search redesign *(very high ROI, higher complexity)*

The current 9-tab structure mixes activity / format / protection type as peers. Replace with a single faceted-search surface where **activity is the primary axis**.

**New IA:**

```
─── Hero search ─────────────────────────────────
[Sök rutt, stuga eller område…]            [Karta]

─── Aktivitet (single-select chips) ─────────────
[Alla] [Vandring] [Fjäll] [Kanot] [Skidor] [Cykel]

─── Förfina (facets) ────────────────────────────
Region · Säsong · Svårighet · Distans · Övernattning · Nås utan bil

─── Resultat ────────────────────────────────────
[Lista]  [Karta]                            72 turer
```

- **Activity** = primary axis, single-select chips, always visible.
- **Format** (dagsutflykt / långvandring) and **Stugor** become facets under *Övernattning*, not peer tabs.
- **Protection type** (nationalpark / naturreservat) **leaves `/utforska`**. Surface those as a dedicated row on the home page (*"Områden att utforska"*) and as a side-link from `/karta`. Avoids today's duplication (a route in Sarek currently appears under both "Vandring" and "Nationalparker").
- **Map/list toggle** on the result surface.
- **Mobile pattern:** facets in a bottom-sheet (shadcn `Sheet`); active filters surface as removable chips above results.
- **Difficulty labels:** keep *Lätt / Medel / Svår*. Never add *Avancerad / Expert* (brand rule).
- **Car-free facet label:** *"Nås utan bil"* (never *"Bilfritt"* — sounds ideological).
- URL-encode all facets so views are linkable (`/utforska?activity=vandring&season=may&carfree=true`).

**Critical files:**
- `src/components/search/ExploreView.tsx` (rewrite)
- `src/components/search/ExploreFilters.tsx` (rewrite)
- `src/components/search/exploreTabs.ts` (replace with facet definitions)
- `src/components/search/FacetSheet.tsx` (new)
- `src/components/search/ResultsView.tsx` (new — list/map toggle)
- `src/app/utforska/page.tsx` (URL param wiring)
- `src/data/index.ts` (extend filter helpers)

**Data prerequisites:** routes need a normalized `seasonMonths: number[]` (or similar) field, plus an explicit `carfree: boolean` flag. Author into `src/data/routes.ts` / `longHikes.ts`.

---

### Phase 8 — Live integrations design *(future-looking; design now, build later)*

Three live data sources that would materially improve the product when the backend layers exist:

1. **Eldningsförbud — MSB / länsstyrelsen.** When active for the relevant county, render a Mist-backgrounded section (with thin Ember left border) inside "Innan du går" on detail pages whose region overlaps the affected area. Body: one sentence + alternative action. *"Just nu är det eldningsförbud i Norrbotten. Använd campingkök istället."*
2. **Fjällväder — SMHI Fjäll.** On routes flagged as exposed fjäll, surface a one-line "Just nu på [Tjäktjapasset]" snippet (vind, temperatur) from SMHI's open API. If integration is brittle, fall back to a static link.
3. **Seasonal availability — internal authored seasons + transit timetables.** When stage's start point depends on a seasonal road or boat (Saltoluokta båt, Nikkaluokta-vägen), surface the seasonal window inline in *"Hur du tar dig dit"*.

**At this phase the deliverable is design, not code.** Per `TECHSTACK.md`, when these layers are introduced they should follow the charter (Inngest jobs for periodic fetches, Upstash Redis for cache, Prisma for any persisted state). Decisions for that PR:
- Cache TTL per source (eldningsförbud: hourly; fjällväder: 30 min; transit: daily).
- Failure modes — if SMHI is down, hide the snippet; never show "Could not load".

**Critical files (when built):**
- New: `src/lib/integrations/eldningsforbud.ts`, `src/lib/integrations/smhi.ts`
- Inngest function file under `src/app/api/inngest/`
- `BeforeYouGoSection.tsx` consumes the cached state

---

## Data model additions (summary across phases)

| Field | Type | Where | Phase |
|---|---|---|---|
| `Area.rules` | `string[]` (or structured) | `src/data/areas.ts` | 4 |
| `Stage.sleepOptionIds` | `string[]` | `src/data/stages.ts` | 6 |
| `LongHike.sleepBetween` | `{afterStageId, cabinIds}[]` | `src/data/longHikes.ts` | 6 (alt) |
| `Route.seasonMonths` | `number[]` | `src/data/routes.ts` | 7 |
| `Route.carfree` | `boolean` | `src/data/routes.ts` | 7 |
| `Route.terrainTags?` | `string[]` (`exposed-fjall`, `bog`, …) | `src/data/routes.ts` | 3 (for fjäll flag) / 8 |
| `Route.dogPolicy?` | `'allowed' \| 'leashed' \| 'restricted'` | `src/data/routes.ts` | 3 |
| `Area.fireRestrictionsCountyId?` | `string` | `src/data/areas.ts` | 8 |

All additions are **type extensions to existing arrays in `src/data/`** — no backend introduced until Phase 8 explicitly does so.

---

## Reused existing assets

- `DetailPageAnchors` (long-hike pages today; extend to all detail types).
- `ContentBlock` (already used for sectioning prose).
- `FilterChip` (used in `AreaDetailPage` content tabs; reused for new activity chips).
- `FacilityGrid` (cabin facilities) — repurpose pattern for area-rules iconography if desired (recommend NOT, to keep it textual and calm).
- `CabinCard` (mini variant for sleep nodes in Phase 6).
- shadcn `Sheet` (facet drawer in Phase 7) — add via `pnpm dlx shadcn@latest add sheet`.
- Brand tokens already in `globals.css` (`bg-mist`, `text-pine`, `text-stone`, `border-ember`).

---

## Verification

Per phase, before marking complete:

- `pnpm build` — typecheck + Next.js build (no separate `type-check`).
- `pnpm lint`.
- `pnpm test` — unit + a11y (`vitest-axe` `toHaveNoViolations` on new components).
- Storybook stories for every new non-trivial component (`FacetSheet`, `BeforeYouGoSection`, `AreaRulesSection`, `SleepNode`, `SeasonalSection`). Stories must include empty/loading/error states where the component reads remote data.
- Manual walk-through in `pnpm dev`:
  - **Phase 1:** Foundation page renders all seven sections; anchored deep-links work (`#allemansratten`, `#fjall`).
  - **Phase 3:** Each detail page shows new "Innan du går" section in correct order; anchor nav present on mobile (sticky-top horizontal scroll).
  - **Phase 6:** Long-hike page renders vertical itinerary; sleep nodes link to cabin pages; reading order makes planning sense.
  - **Phase 7:** Utforska facets persist via URL; mobile bottom-sheet opens and closes; map/list toggle preserves filters; active-filter chips remove individually.
  - **Phase 8:** When live data unavailable, "Innan du går" gracefully hides the affected sub-block (no error toast, no placeholder).
- `pnpm test:run` after any phase that touches layout/images (Phases 5, 6, 7) — confirms Lighthouse a11y stays ≥ 0.95 mobile.

---

## Sequencing rationale (ROI vs. complexity)

| # | Phase | Value | Complexity |
|---|---|---|---|
| 1 | Foundation page `/friluftsliv` | High | Very low (content authoring) |
| 2 | About page allemansrätten | High | Trivial |
| 3 | Standardize detail-page sections + anchors | High | Low (reorganize existing) |
| 4 | Per-area regler block | High | Low (data + small component) |
| 5 | Seasonal home module | Medium-high | Low (content + small component) |
| 6 | Long-hike vertical itinerary | Very high | Medium (data linking + rewrite) |
| 7 | Utforska faceted redesign | Very high | Medium-high (new IA + components) |
| 8 | Live integrations | Medium-high | High (new backend layers) |

Phases 1–5 establish the *content patterns* (foundation hub, "Innan du går" section, "Här gäller" block, editorial seasonal section). Phases 6–7 are the *user-visible UX wins*. Phase 8 is *durability* — connecting the static content to live data once the backend layers from `TECHSTACK.md` are introduced.

Each phase is shippable on its own. Phases 5 and 7 share a season-data dependency (`Route.seasonMonths`) — if Phase 5 ships first, the linked `/utforska?season=may` view falls back to the existing flat list until Phase 7 lands.
