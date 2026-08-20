# Lexicon

**Understand words. Remember them.**

Lexicon is a modern English dictionary and vocabulary-learning app built around the
**Core 3000** — the 3,000 most essential English words, tagged by CEFR level (A1–B2) —
and the **Word Stream**, an ambient learning mode that surfaces a new word automatically
on a timer you control.

---

## Features

- **Dictionary lookup** — search any word, see pronunciation (US/UK), part of speech,
  definitions, examples, synonyms/antonyms, collocations, phrases, word family, usage
  notes, and common mistakes. Empty sections are hidden rather than shown as blank cards.
- **Core 3000 Explorer** (`/explore`) — browse or filter by CEFR level, part of speech,
  or an A–Z index; paginated so 3,000 entries never render at once.
- **Word Stream** (`/stream`) — an immersive, auto-advancing feed with five content
  modules, switchable at the top of the page (driven by `lib/registry.ts` — the list
  grows without changing the Stream page itself):
  - **Vocabulary** — Core 3000 words, filterable by CEFR level.
  - **Phrasal Verbs** — ~448 English phrasal verbs (see below), covering C2-level breadth, filterable by
    formality.
  - **Grammar** — 66 grammar points from A1 to C2 (see below), filterable by level.
  - **Idioms** — 154 common English idioms (see below), filterable by register.
  - **Prepositions** — 96 entries (see below), filterable by type.

  All modules share: pause, resume, skip forward/back, save, mark "I know this" /
  "Learning," change the interval (15/30/45/60/90s), and keyboard shortcuts (space,
  ←/→, s, k, l — disabled while typing in an input).
- **Phrasal Verbs** (`/phrasal-verbs`) — a browsable, searchable collection of ~448
  common English phrasal verbs, each with meaning(s), plain-language definitions,
  examples, separability (`turn it off` vs. `look after it`), and formality level.
  All original content — see "Where the data comes from" below.
- **Grammar** (`/grammar`) — 66 grammar points spanning A1 to C2 across 15 categories
  (tenses, articles, modals, conditionals, passive voice, reported speech, relative
  clauses, and more), each with a plain-language explanation, structure formula,
  examples, signal words, and common mistakes. All original content.
- **Idioms** (`/idioms`) — 154 common English idioms across 13 themes (body, animals,
  food, weather, money, work, communication, and more), each with a plain-language
  meaning, examples, category, and register (informal/neutral/formal). All original
  content.
- **Prepositions** (`/prepositions`) — 96 entries: 25 core prepositions (in, on, at,
  by, with...) each broken down by usage — time, place, movement, manner — since a
  single preposition doesn't reduce to one definition, plus ~70 dependent-preposition
  collocations (`afraid of`, `interested in`, `access to`, `responsible for`, and so
  on). All original content.
- **Word of the Moment** — a compact version of the stream on the homepage.
- **Saved / Learning / History** — local progress tracking for words, phrasal verbs,
  grammar points, idioms, and prepositions, with a simple Known / Learning / Unseen
  breakdown. No account required.
- **Pronunciation** — plays provider audio when available, otherwise falls back to the
  browser's SpeechSynthesis API. Never autoplays (except in Kids Mode — see below).
- **Light & dark themes**, full keyboard accessibility, reduced-motion support, and a
  distinct editorial visual identity (not a generic AI-SaaS template).
- **Kids Mode** (`/kids`) — a separate, audio-first learning experience for young
  children (ages ~3+), deliberately not built on the adult Stream/CEFR system since
  a pre-reader's needs are genuinely different. See "Kids Mode" below.

## Kids Mode

Kids Mode is a distinct product surface, not just another content module — a
3-year-old doesn't need CEFR levels, filters, or a save/know/learning trichotomy.
It has its own visual theme (`.kids-mode` in `globals.css`: brighter palette, a
playful rounded display font, bigger touch targets), its own header with no adult
navigation, and a parent gate (a simple math question) before leaving back to the
main app.

**Three activities**, each a simple audio-first flashcard flow with big
Previous/Next arrows and an "I did it!" star button instead of complex progress
tracking:
- **First Words** (`/kids/words`) — ~85 everyday words across 11 topics (animals,
  colors, numbers, shapes, family, food, body, clothes, vehicles, weather, actions),
  each with an emoji, the word, and a short sentence.
- **ABC Letters** (`/kids/alphabet`) — all 26 letters with a phonics sound hint and
  two example words each, plus a **letter-tracing activity** (`/kids/alphabet/[letter]/trace`)
  — draw over a faint guide letter with a finger or mouse; completion is detected
  by a canvas-based coverage check (see below), not just a static image.
- **Sight Words** (`/kids/sight-words`) — the Dolch Pre-Primer list, the standard
  40-word starting point for sight-word instruction (the same legitimacy tier as
  the Oxford 3000 list — a widely-taught, freely-reused word list, not any single
  publisher's proprietary content).

**Autoplay is intentional here** — this is the one deliberate exception to the
rest of the app's "never autoplay" rule. For pre-readers, hearing a word the
instant it appears is core to the pedagogy (the same pattern used by Khan Academy
Kids, Duolingo ABC, and similar apps), not an optional extra. Every card has an
always-visible mute toggle.

**Data model**: `types/kids.ts`, `lib/kids/words.ts`, `lib/kids/alphabet.ts`,
`lib/kids/sightWords.ts` — all original content. `lib/kids/storage.ts` is a
separate, much simpler localStorage layer than the adult `ContentModule` system
(a star counter and a per-activity seen-slugs set) — Kids Mode intentionally does
not use `useModuleStream`/`useModuleProgress`/`lib/registry.ts`, since forcing the
adult Stream's filter tabs and known/learning states onto a toddler's UX would
work against the product, not for it.

**Letter tracing** (`components/kids/LetterTraceCanvas.tsx`) — a genuine drawing
interaction, not a static illustration. The glyph is rendered once, off-screen, at
full opacity to classify a 20×20 grid of cells as "letter" or "background" by
sampling alpha at each cell's center. The visible canvas shows the same glyph
faintly as a guide; as the child draws with pointer events, each stroke point
marks its grid cell as "touched." Progress is `touched-letter-cells /
total-letter-cells`; crossing ~55% triggers the completion celebration and a
star — no external tracing/handwriting library, no stored image assets.

**Parent Dashboard** (`/kids/parents`) — gated by the same parent-gate math
question (shown on page load, so direct URL access is protected too, not just the
header button), showing total stars earned and per-activity progress (words seen
out of each activity's total). Everything is derived from the same local, on-device
storage — no accounts, nothing sent anywhere.

## Young Learners (`/young-learners`)

A third, distinct tier for ages ~7-12 — a bridge between Kids Mode (pre-readers)
and the adult CEFR track. Unlike Kids Mode, this content **does** use the generic
adult `ContentModule` system (`useModuleStream` / `useModuleProgress` /
`lib/registry.ts`), registered with `track: "kids"` — a field that existed in the
architecture since the original refactor but had never actually been used until
this tier. A 7-12 year old can read, so the Stream mechanic genuinely fits; it
just needed its own calmer visual theme (`.young-mode` — cool blues/teals instead
of Kids Mode's bright primary colors) and its own simpler UI components
(`components/youngLearners/*`), since the existing Stream UI components are
styled with adult theme tokens that don't carry over.

Two modules, both fully local (no network dependency):
- **Sight Words** (`lib/youngLearners/sightWords.ts`) — 180 words across the
  Dolch Primer, 1st, 2nd, and 3rd Grade tiers — the full standard progression
  that follows Kids Mode's Pre-Primer list. Same legitimacy tier as
  Pre-Primer — a widely-taught, freely-reused word list.
- **Grammar** (`lib/youngLearners/grammar.ts`) — 28 concepts (nouns, verbs,
  adjectives, sentences, punctuation, synonyms/antonyms, contractions,
  homophones, prefixes/suffixes, irregular verbs, and more) written for a
  7-12 year old audience — simpler and more playful than the adult Grammar
  module, no CEFR references.
- **Discovery** — see below; the third module, shared with Kids Mode.

Navigation at `/young-learners/practice` is **manual, not timed** — unlike the
adult Stream's countdown, a reader controls their own pace with Previous/Next.
Under the hood this just passes a very large `intervalSeconds` to
`useModuleStream` to effectively disable its internal auto-advance, rather than
needing a hook-level change.

**Transition prompt** (`components/youngLearners/YoungTransitionPrompt.tsx`) —
once a learner has marked roughly 60% of Young Learners content (combined
across Sight Words, Grammar, and Discovery) as known, the landing page shows
a "ready for more?" banner linking to the full adult `/stream`. Makes the
handoff to the main app feel intentional and earned rather than just another
link in a footer.

## Two-factor authentication for /admin (`/mfa-setup`, `/mfa-verify`)

TOTP-based 2FA (Google Authenticator, Authy, 1Password, etc.) layered
**specifically on top of** the existing magic-link sign-in, not a
replacement for it. Magic-link stays the only sign-in method for
everyone — simplest, zero password-security surface — but reaching
`/admin` now additionally requires a verified 6-digit code this session.

**Why layered rather than a password+2FA rebuild**: the admin account is
now effectively the only account that matters (general registration is
off), which genuinely raises the value of protecting it with two real
factors — but a full password system adds its own risk surface (password
strength, reset flows, breach exposure) that a TOTP-only layer avoids
entirely. This gets the actual security benefit (two independent factors:
"something you have," the email inbox, plus "something you have," the
authenticator device) without touching the simpler flow every other
sign-in still uses.

**How it works** (`lib/admin/mfa.ts`, Supabase Auth's built-in MFA API):
- Signs in via magic link as before → `app/admin/layout.tsx` now also
  checks the session's Authenticator Assurance Level (AAL).
- **No TOTP factor enrolled yet** → redirected to `/mfa-setup` (one-time):
  scan a QR code, enter the code it generates to confirm enrollment.
- **Enrolled, but this session hasn't verified a code yet** (e.g. a fresh
  sign-in) → redirected to `/mfa-verify`: enter the current code, no
  re-enrollment needed.
- **Already verified this session** → `/admin` renders normally.
- Both new pages live **outside** `/app/admin/` deliberately — if they
  were nested under the same layout that enforces the AAL check, the
  redirect would loop on itself.

**What I could and couldn't verify from here**: `tsc`/`eslint`/build all
pass, and the redirect chain was confirmed working correctly with
Supabase unconfigured (graceful redirects, no crash) — but the actual QR
enrollment → scan → verify flow needs a real Supabase project and a real
authenticator app, neither of which this sandbox has access to. That
needs to be tested live once deployed.

**Setup**: no new SQL — Supabase's MFA API works out of the box once
Supabase itself is configured. Just sign in at `/account` as before, and
you'll be walked through `/mfa-setup` automatically the first time you
try to reach `/admin`.

## Encyclopedia image upload (`/admin/encyclopedia`)

A new `"image"` field type in the central admin schema (`types/adminContent.ts`)
— a real photo an admin uploads (e.g., AI-generated), stored in Supabase
Storage, shown larger on the article page than the emoji-only treatment
every other entry uses.

- **Genuinely optional and additive** — `DiscoveryEntry.imageUrl` is
  optional; the 150 built-in entries and every admin entry that hasn't set
  one render exactly as before (small emoji badge next to the title).
  Adding an image swaps to a larger banner (h-44 on mobile, h-52 on larger
  screens — "a bit larger, not too large," per the ask that shaped this)
  above the title instead.
- **A public storage bucket** (`content-images` — new section in
  `supabase/schema.sql`), since images render on public pages and need to
  be readable without signing in. Only signed-in users can upload/replace/
  delete, same baseline-safety-net pattern as everything else (real
  admin-only enforcement is the `ADMIN_EMAILS` check at the app layer).
- **Editing preserves the existing image if you don't upload a new one** —
  the form carries the current URL forward in a hidden field, so re-saving
  an entry without touching the photo field doesn't accidentally clear it.
- Uses `next/image` with `unoptimized` deliberately, rather than
  configuring Next's image optimizer for a specific Supabase project's
  hostname — that would hardcode one person's project URL into the app,
  breaking for anyone with a different one.
- **Scoped to Encyclopedia only for now** — the field type itself is
  generic and any module could add an `"image"` field the same way, but
  only Encyclopedia's registry entry does yet.

**Setup**, once Supabase is already configured: run the new "Storage:
content images" section of `supabase/schema.sql` in the SQL Editor (or the
whole file, if you're re-running it fresh).

## Advanced 1500 (`/advanced`, `lib/dictionary/advancedList.ts`)

A deliberately **separate** word list from Core 3000, not an extension of
it — Core 3000 was just renamed specifically to mean "the curated ~3,000-
word A1-B2 essentials," and folding C1/C2 words into that same list would
make the name immediately wrong. Same shape and lookup pattern as
`coreList.ts` (`getAdvancedEntryBySlug`, `getAdvancedEntriesByWord`,
`searchAdvancedList`), so every piece of code that already understands a
`WordSummary` works with this list unchanged.

**Current state: a first batch of 156 words (106 C1, 50 C2), not the full
~1,500-word target.** CEFR-level assignment gets genuinely fuzzier at the
advanced end — different bodies classify C1 vs. C2 slightly differently,
unlike a verifiable fact — so this shipped as a careful, honest first slice
rather than rushing 1,500 words with less confidence per entry. Every word
in this batch was validated programmatically against the full existing
2,997-word Core 3000 before shipping (zero overlap — word lists from
different sources always share common headwords, since the most frequent
English words are the most frequent English words regardless of whose
list you're looking at; that's expected, not a duplication concern).
Extending this to the full ~1,500 is real, scoped follow-up work.

**Design consistency fix**: the page originally shipped with its own,
simpler card layout (word + level badge only, 3-column grid, no A-Z index)
that visibly didn't match Core 3000's richer one (word + part of speech +
level, 4-column grid, sticky A-Z rail). Rebuilt to use the exact same card
markup and layout as Core 3000, rather than each page evolving its own
slightly-different version of the same idea.

Homepage search now checks both lists — Core 3000 results lead (the more
likely match for most queries), Advanced 1500 fills any remaining
suggestion slots, capped at 8 total suggestions either way.

## Rebrand & renames

The product is now **OffStudies**, not Lexicon — every user-facing reference
updated (header, footer, page titles/metadata, Kids Mode and Young Learners
headers, About/Quiz/Search copy). `package.json`'s internal `name` field
was deliberately left as `vocab-app` — that's a project identifier, not
user-facing branding, and changing it risks a deployment config mismatch
for no real benefit.

Two feature renames, chosen to better match what each thing actually does:
- **"Word Stream" → "Study Radio"** — "Stream" implied something actively
  scrolled or browsed; the feature actually auto-advances on its own timer
  while you do nothing, which "radio" (turn it on, let it play) describes
  far better. Deliberately not "Word Radio" — the Stream/Study Radio
  already spans all 6 adult modules via its toggle (Vocabulary, Phrasal
  Verbs, Grammar, Idioms, Prepositions, Encyclopedia), so a name centered
  on "Word" would misrepresent it.
- **"Explore" → "Core 3000"** — states plainly that this page is the
  curated 3,000-word subset, not the whole dictionary, which "Explore" left
  ambiguous now that word-page search reaches any real English word.

## Word page improvements

- **A persistent search bar** on every word detail page (`/word/[slug]`) —
  previously search only lived on the homepage, so navigating to a word
  page and wanting to look up something else meant going back first.
- **Synonyms and antonyms are now real hyperlinks** to their own word
  pages (`components/dictionary/LinkablePills.tsx`), not plain text.
  Deliberately unconditional — every synonym/antonym links out, rather
  than only linking ones that happen to match the Core 3000 list, since
  `/word/[slug]` already resolves any real English word via the network
  dictionary, not just Core 3000. Collocations, common phrases, and word
  family stay as plain (non-linked) pills, since those are frequently
  multi-word phrases where a direct word-page link would often just 404 —
  linking those would read as broken far more often than synonyms/antonyms
  do.
- **Related phrasal verbs and idioms** now appear on word pages
  (`components/dictionary/RelatedPhrasalVerbsAndIdiomsSection.tsx`,
  `lib/dictionary/wordCrossLinks.ts`) — computed, not stored, same pattern
  as the existing Encyclopedia cross-links. A phrasal verb is related when
  the word is its `baseVerb` ("give" → give up, give in, give away, give
  back, give out, give up on — a precise match, not fuzzy text
  co-occurrence); an idiom is related when the word appears as a whole
  word inside it ("time" → "in the nick of time," "time flies," but not
  "timeline"). Verified directly against the real datasets before
  shipping, not just structurally — the matching logic returns exactly
  the expected sets.

## Registration toggle (`/admin`)

An admin-controlled kill switch for new account sign-ups
(`lib/admin/settings.ts`, one row in a new `app_settings` table) —
addresses a real resource-management concern: without it, anyone visiting
`/account` can create an account, consuming Supabase's free-tier auth
limits. Toggling it off only blocks **new** sign-in attempts; anyone
already signed in keeps working normally, and it fails open (registration
stays enabled) if the settings table can't be read for any reason, so a
misconfiguration can never accidentally lock everyone out.

## Listing page pagination (`hooks/usePagination.ts`)

Every listing page (`/explore`, and the pattern ready to extend to Grammar,
Idioms, Phrasal Verbs, Prepositions, Encyclopedia) now caps how many cards
render at once — "Show more" reveals another batch, rather than rendering
the entire filtered result set immediately. Extracted into a shared hook
+ `ShowMoreButton` component so this is one implementation, not five
near-copies; the hook automatically resets to the first page whenever the
filtered count changes, so switching a filter never leaves "Show more"
looking stale.

**Worth being direct about a real limit here**: this makes the *rendered*
list bounded, but doesn't change what data reaches the browser — the full
filtered dataset is still sent to the client, "Show more" just controls
how much of it is displayed. True protection against bulk-copying a full
list requires **server-side pagination** (the server only ever sends the
current page, search/filtering run server-side) — a genuinely different,
larger architecture change than this pass, tracked as a real next step
rather than something this already solves.

## Admin content management (`/admin`)

A real, form-based way to add content without writing code or deploying —
the trigger condition from the original technical blueprint (Section 8:
"build the CMS once a non-technical person needs to add content directly")
has been met, so this is a genuine slice of that system, not the full
migration described there.

**A central system, not one admin build per module.** The first pass (since
superseded) wired up Encyclopedia alone, with its own Supabase table and its
own hand-built form. That doesn't scale to six-plus modules, so it was
rebuilt around one idea: **a content module is described once, as data, and
one generic form/list/CRUD system works for any module registered that
way** — the same "content is data, design is reusable" principle the rest
of this app is built on, applied to the admin side.

**How it works:**
- **One Supabase table** (`admin_content`: `module_id`, `slug`, a `data`
  JSONB column, see `supabase/schema.sql`) instead of a table per module.
  Each module's specific fields live inside `data`.
- **One field-schema type** (`AdminFieldDef` in `types/adminContent.ts`) —
  text / textarea / list / select / emoji — and **one registry**
  (`lib/admin/registry.ts`) where each module is a single config object
  declaring its fields, which field becomes the URL slug, and which public
  route to revalidate after a write. Adding a new module to `/admin` means
  writing one object here, not a new page set.
- **One generic form component** (`GenericEntryForm`) renders any module's
  fields from that schema. **One generic CRUD Server Action set**
  (`lib/admin/content.ts`) handles create/read/update/delete for every
  module, parameterized by `moduleId`. **One dynamic route tree**
  (`/admin/[moduleId]`, `/admin/[moduleId]/new`, `/admin/[moduleId]/[id]/edit`)
  serves every module — none of the three currently-registered modules has
  its own page files.
- **All six adult modules now registered: Encyclopedia, Grammar, Idioms,
  Vocabulary, Phrasal Verbs, Prepositions.** The first three have a
  naturally flat shape. The latter three's real data models support
  *multiple* senses/definitions per entry (a word can have several
  meanings; "in" has several usage patterns) — rather than build a more
  complex repeatable-subform field type, **admin-added entries in these
  three get exactly one sense/definition.** That covers the realistic
  common case (adding a new word or phrase with its main meaning) without
  a bigger form-engine change; entries genuinely needing multiple senses
  are still best added via code. Stated explicitly on the `/admin`
  dashboard, not hidden.
- **`lib/admin/mappers.ts`** converts a generic `{slug, data}` row into
  each module's real TypeScript shape (`DiscoveryEntry`, `GrammarPoint`,
  `IdiomEntry`, `WordEntry`, `PhrasalVerbEntry`, `PrepositionEntry`) for
  rendering — the admin system stores everything generically, but the
  public pages render through the exact same typed components every
  built-in entry uses.
- **Admin-added entries are merged with each module's static data.ts list
  at read time** — the built-in entries (150 Encyclopedia, 66 Grammar, 154
  Idioms, 2,997 Vocabulary, 448 Phrasal Verbs, 96 Prepositions) are never
  touched, edited, or migrated into the database. This was a deliberate
  risk decision: retrofitting the deeply synchronous architecture those
  static lists share with Kids Mode, Young Learners, cross-linking, and
  Quiz to be database-backed in one pass would have been a much larger,
  riskier change to make untested.
  - Each module's public listing page fetches admin entries client-side on
    load and merges them with the static list — if that fetch fails or
    Supabase isn't configured, the page still works with the built-in set.
  - Each module's detail page checks the static list first (instant, no
    network) and only queries the database if the slug isn't found there.
  - **Vocabulary is the one exception to that ordering**: admin-added
    words are checked *before* the network dictionary lookup on
    `/word/[slug]`, not after — otherwise a word an admin specifically
    added could get silently shadowed by whatever the live Free Dictionary
    API happens to return for that same word.
  - **Not yet wired up**: admin-added entries don't appear in Kids Mode,
    Young Learners, cross-linking, the adult Stream's rotation, or Quiz —
    only each module's own public browsing pages. Extending this is real,
    additional work, following the same "merge at read time" pattern.
- **Who's an admin** is a plain comma-separated email allowlist in the
  `ADMIN_EMAILS` environment variable — not a database roles table. Sign in
  at `/account` with an email on that list, then visit `/admin`.
- **Every admin page and Server Action independently re-checks** the
  signed-in user against `ADMIN_EMAILS` (`lib/admin/auth.ts`) — never
  assumes a request reaching a Server Action came from an admin page just
  because that's the only place it's linked from, since Server Actions are
  independently callable.
- Row-level security in Supabase requires `auth.uid() is not null` (any
  signed-in user) as a baseline safety net; the real admin-only enforcement
  is the application-layer email check, so a bug in one layer doesn't
  remove the other.

### Bulk add via CSV (`/admin/[moduleId]/import`)

Every module gets this for free, from the same field schema the single-entry
form uses — no per-module import code.
- **Download template** generates a CSV with the right column headers for
  that module (`lib/admin/csv.ts`'s `generateCsvTemplate`), with one example
  row showing the expected format.
- **"list" fields use a pipe (`|`) inside one cell** to hold multiple items
  (facts, examples) — a spreadsheet cell can't hold true nested structure,
  and a pipe is unlikely to collide with real content the way a comma
  would.
- **Upload** parses with PapaParse, validates every row against the same
  `AdminFieldDef[]` schema the form uses (required fields, valid `select`
  values), and reports results inline — which rows succeeded, and the
  specific reason any row was skipped — without navigating away.
- **Uses upsert**, keyed on `(module_id, slug)`: re-uploading a corrected
  file updates rows that already succeeded rather than erroring on
  duplicates, so fixing a few bad rows and re-uploading the whole file is
  the natural workflow, not "delete everything and start over."
- JSON was deliberately not offered as an alternative: a single missing
  comma or stray quote produces an opaque parse error, which undermines the
  entire point of a form-and-spreadsheet system built for a non-technical
  admin. CSV errors are far easier to spot and fix in a familiar
  spreadsheet grid.

**Setup**, once Supabase is already configured (see "Accounts & multi-device
sync" above):
1. Run `supabase/schema.sql`'s `admin_content` table definition in the
   Supabase SQL Editor. (If you already ran the earlier version of this
   file, drop the old module-specific table first: `drop table if exists
   public.encyclopedia_entries;` — it was never populated with real data.)
2. Set `ADMIN_EMAILS` to your email address.
3. Sign in at `/account`, then visit `/admin`.

## Quiz (`/quiz`, `lib/quiz/generateQuestions.ts`)

Three modes, all built from the same question-generation pipeline and no
separately-authored quiz content:
- **Random Mix** — 10 questions spread across all 6 adult modules.
- **Topic Quiz** — 10 questions from one module you pick.
- **Model Test** — a longer, fixed-composition test (4 questions × 6
  modules = 24) spanning everything evenly, with a full score breakdown by
  category at the end — the "mock exam" format.

**Questions are generated, not authored.** Every module's existing
definitions/explanations/facts double as both the correct answer for their
own entry and a distractor for every other question from that module — so
question quality and variety scale automatically as each module's content
grows, with zero additional content to write or maintain.

**Vocabulary quiz questions deliberately draw from the 20 curated
`SAMPLE_WORDS`**, not the full Core 3000 list — Core 3000 itself is only
word/slug/level/part-of-speech; full definitions come from a network
dictionary lookup. Using the curated set keeps quiz generation fully local
and instant for every module alike, with no loading state or
network-failure handling needed anywhere in the quiz flow (a meaningful
difference from the adult Word Stream, which does depend on the network for
full Core 3000 coverage).

Results show an overall score, a per-category breakdown for multi-module
quizzes, and a review list of every missed question linking back to its
source page. Nothing is persisted — a quiz is a self-contained session, not
tracked progress (the existing Save/Know/Learning system already covers
long-term tracking).

## Spaced repetition (`lib/spacedRepetition.ts`)

Every module's `selectNext` used to pick randomly within the active filter.
It now prefers items **due for review** first, falling back to the
existing random behavior when nothing is due — with **no new UI**. The
existing Save/Know/Learning buttons already capture the exact signal a
scheduler needs; marking something "Learning" or "Known" is itself a
review event.

- Marking **Learning** → due again soon (starts at 1 day, ~2.2x growth per
  subsequent review while still learning).
- Marking **Known** → due again later (starts at 4 days, 3x growth), capped
  at 6 months — long-term reinforcement rather than "never see it again."
- Clearing a status removes its schedule entirely.

Deliberately **not** a full SM-2/Anki-style algorithm, which needs a
graded (e.g. again/hard/good/easy) quality rating per review — this app's
interaction model is a 3-state toggle, so the scheduler works with what's
already there rather than requiring a UX change to add one.

Every module's `selectNext` changed in exactly the same small way: the
repeated "filter out recently-shown items, then pick randomly" tail that
used to be duplicated across 7 files was replaced with one call to
`pickWithSpacedRepetition(moduleId, pool, getSlug, recentSlugs)` — the
pool-building logic (CEFR level, category, saved/learning filters) that
makes each module distinct is completely untouched. Recording happens in
exactly one place, `useModuleProgress`'s `setStatus`, since every module
already funnels every status change through that one hook — no per-module
wiring needed. `lib/discovery/data.ts` is shared by two different modules
(Young Learners' `discovery` and the adult `encyclopedia`), so its
selection context gained a `moduleId` field to keep their schedules
independent, exactly mirroring how their save/known/learning progress was
already kept independent.

## Accounts & multi-device sync (`/account`, adult track only)

Optional. The app works exactly as it always has — fully local, no accounts
— unless a Supabase project is connected via two environment variables.
Nothing about the existing storage system changed to make this possible.

**Scope is deliberately adult-track only.** Kids Mode and Young Learners
never gained accounts, and won't — a values decision as much as a technical
one. Enforced at two independent layers: `lib/sync/progressSync.ts` only
ever reads/writes adult-track module IDs (from the registry's `track:
"adult"` modules), and `components/account/SyncManager.tsx` additionally
refuses to run at all on `/kids` or `/young-learners` routes. Either
safeguard alone would be sufficient; both exist so a mistake in one doesn't
compromise the guarantee.

**Architecture: local-first, additive, not a rewrite.** `lib/storage.ts` —
the existing module-scoped localStorage layer every progress hook already
used — is completely unchanged. A new sync layer sits beside it:
- `lib/supabase/client.ts` / `server.ts` — Supabase clients that return
  `null` gracefully when unconfigured, rather than throwing, so a
  deployment without Supabase set up behaves identically to before.
- `proxy.ts` — refreshes the auth session cookie on navigation (Next.js 16's
  successor to `middleware.ts`, same purpose).
- `hooks/useAuth.ts` — passwordless, magic-link sign-in (no password
  storage/hashing to get right).
- `lib/sync/progressSync.ts` — a **union merge**, not true conflict
  resolution: on sign-in, remote known/saved state is adopted only where
  local doesn't already have a value for that entry; local state is then
  pushed up in full periodically (every 30s while active, and on tab
  hide). This can only ever add progress, never silently lose or overwrite
  it — the safe default for a learning app, and it avoids needing
  per-entry timestamps the app doesn't track today for true last-write-wins
  resolution.
- `supabase/schema.sql` — one `user_progress` table, row-level security
  scoping every row to its owner (`auth.uid() = user_id` on every policy).

**Setup** (optional): create a free project at
[supabase.com](https://supabase.com), run `supabase/schema.sql` in its SQL
Editor, then set `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` (see `.env.example`).

## Card design consistency (Grammar, Idioms, Phrasal Verbs, Prepositions, Encyclopedia)

Encyclopedia's card got a real design upgrade in an earlier pass (icon
badge, numbered facts, an elevated "fun fact" callout). The other four
adult content cards still used an older, plainer design — visibly a step
behind, since they're all part of the same content family a learner moves
between constantly. This pass brought them to the same visual language,
not just "make them look nicer" independently:

- **Two new shared components** replace what had been four/five
  near-identical inline implementations: `components/ui/ExampleList.tsx`
  (the quoted-example-sentence pattern every module has) and
  `components/ui/CalloutBox.tsx` (the highlighted note pattern — common
  mistakes, fun facts — parameterized by tone: `warning`, `accent`, or
  `highlight`). Encyclopedia's own fun-fact box was migrated to
  `CalloutBox` too, so all five cards share one implementation, not four
  copies plus an outlier.
- **A consistent header pattern** across all five: an icon badge (h-16 w-16
  rounded-2xl, accent-soft background) — Encyclopedia uses its per-entry
  emoji, the other four use a fixed Lucide icon representing that module
  (Grammar: `PenLine`, Idioms: `MessageCircleQuestion`, Phrasal Verbs:
  `ArrowRightLeft`, Prepositions: `Compass`) — plus a category/type eyebrow
  in `text-accent` (previously most cards used a flatter `text-ink-faint`
  for this, Encyclopedia's was the exception that everything else now
  matches) and a standardized title scale (`text-4xl sm:text-5xl` — Phrasal
  Verbs previously ran larger than the rest, `5xl`/`6xl`, which no longer
  reads as consistent now that all five sit in the same content family).

This was scoped as presentation only — no data model or content changes
alongside it, to keep the change easy to verify and revert independently
of anything else.

### Signposts for multi-sense entries

A convention taken from learner's dictionaries (Cambridge, Longman): when
an entry has several meanings, each gets a short all-caps label, and a
scannable menu of those labels sits directly under the headword — so a
reader jumps to the meaning they want instead of reading every sense to
find it.

- **Phrasal Verbs** use an explicit `signpost?: string` field on each sense
  (`QUIT TRYING`, `STOP A HABIT` for "give up"). 44 multi-sense entries
  carry them; single-sense entries don't need one, and the menu only
  renders when there's more than one sense.
- **Prepositions** already had a natural signpost in each sense's `usage`
  field (Time / Place / Movement), so they reuse that rather than
  duplicating the concept with a second field — same scannable menu, same
  per-sense accent label, no redundant data.
- **Sense ordering** follows the same convention's companion rule: the most
  common meaning comes first ("turn down" leads with REFUSE, not
  DECREASE), rather than authoring order.

## Discovery — one dataset, three audiences (`/kids/discover`, `/young-learners/practice`, `/encyclopedia`)

An encyclopedia-style section covering all 10 categories originally scoped:
Animals & Nature, Space & Planets, Dinosaurs, Countries & Geography, Human Body,
Ocean & Sea Life, Weather & Seasons, Plants & Growing Things, Inventions &
Technology, and History's Big Moments — **150 entries** (15 per category), all
original content: general factual knowledge (a lion lives in Africa, Mars is
called the Red Planet) that belongs to no one, written fresh for this product,
not sourced from or checked against any specific encyclopedia.

**Fact-check pass.** A sample of the most specific, highest-risk claims
(precise numbers, superlatives, records — the kind of statement most likely
to be subtly wrong or to have gone stale) was verified against current web
sources. Two real errors were caught and fixed: Jupiter's and Saturn's moon
counts were outdated (both have grown substantially as astronomers keep
finding small new moons — the entries now use future-proof phrasing like
"more than 100 known moons... astronomers keep finding more" instead of a
point-in-time number that will go stale again), and T. Rex's longest tooth
was corrected from 8 to 12 inches (including the root) to match the
consistently-cited figure across sources. Two other checked claims (the
Great Pyramid's 3,800-year height record, the blue whale's car-sized heart)
were confirmed accurate as written. This was a **targeted spot-check of the
riskiest claims, not an exhaustive line-by-line audit of all 150 entries** —
worth knowing as an honest limitation, not a guarantee every fact has been
independently verified.

**One shared dataset** (`lib/discovery/data.ts`) serves three audiences at
different depths via two fields on each entry — `simpleFact` (one sentence) and
`facts` (3-4 fuller facts, plus an optional `funFact`) — rather than maintaining
three parallel content sets:
- **Kids Mode** (`/kids/discover`) shows `simpleFact`, through the same
  category-grid → sequential-player pattern as First Words (reusing
  `KidsWordCard`/`KidsNavControls`/`useKidsPlayer` directly — `headline`/
  `visual`/`sentence` map onto `name`/`emoji`/`simpleFact` with no new card
  component needed).
- **Young Learners** (`/young-learners/practice`) shows the fuller `facts`
  array, through a `discoveryModule` `ContentModule` registered with
  `track: "kids"`.
- **Adult Encyclopedia** (`/encyclopedia`, `/encyclopedia/[slug]`) shows the
  same `facts` array at full depth, plus cross-linked vocabulary (below),
  through an `encyclopediaModule` `ContentModule` registered with
  `track: "adult"` — appearing in the header nav and the `/stream` toggle
  alongside the other 5 adult modules.

### Vocabulary ↔ Encyclopedia cross-linking (`lib/discovery/crossLinks.ts`)

The "Volcano model" from the product blueprint: an encyclopedia article about
volcanoes should surface "eruption," "lava," and "magma" as related
vocabulary, and those vocabulary entries should link back to the article.

Implemented as a **computed relationship**, not a stored join table — text
co-occurrence between an article's content and the real Core 3000 word list,
filtered to noun/verb/adjective parts of speech (using the `partOfSpeech`
field already on every `WordSummary`) to exclude function words like
conjunctions and plain adverbs that would otherwise produce noisy matches.
This is a deliberate architectural choice matching the blueprint's own MVP
guidance: model the relationship properly, but don't stand up a database or
a stored links table before there's a real need for one — a derived lookup
gives the same product value (genuine, always-accurate links, since they're
computed from the live text rather than hand-authored and liable to go
stale) at zero schema or infrastructure cost.

- `getRelatedVocabulary(entry)` — forward direction, shown on every
  Encyclopedia article as a "Related words" section linking to `/word/[slug]`.
- `getRelatedDiscoveryEntries(word)` — reverse direction, shown on word
  detail pages (`components/dictionary/RelatedEncyclopediaSection.tsx`) as a
  "Related encyclopedia articles" section.

### Unified search (`/search`, `lib/search/unifiedSearch.ts`)

The blueprint distinguishes public SEO (handled separately by Next.js
metadata/sitemap) from **internal application search** — this is the latter:
one search box querying all 6 adult content types at once (Vocabulary,
Phrasal Verbs, Grammar, Idioms, Prepositions, Encyclopedia), with results
grouped by type. Reachable from a search icon in the header on every adult
page, not just the homepage.

Implemented as simple substring matching over the existing in-memory data —
appropriate at the current volume (a few thousand records total) per the
blueprint's own guidance not to adopt a dedicated search service
(Algolia/Meilisearch) before relevance needs actually outgrow this.
`unifiedSearch()`'s signature is stable regardless of what's behind it, so
swapping the implementation later doesn't require changing the `/search`
page or any other caller.

Content this broad in scope raised a copyright question worth noting: the
request that prompted Discovery specifically named Britannica's children's
encyclopedia as a source to draw from. That's a commercial, copyrighted
reference product — its specific explanations and article structure aren't
reusable, even for a kids' product. The underlying facts are not copyrightable
to anyone, so Discovery covers the same breadth of topics using general
knowledge, written independently.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + React
- Tailwind CSS v4
- [lucide-react](https://lucide.dev) icons
- [Free Dictionary API](https://dictionaryapi.dev) (public, no key) as the default
  dictionary data provider
- `localStorage` for progress/saved/history persistence (no backend required)

## Project structure

```
app/
  page.tsx                 Landing page
  explore/                 Core 3000 browser
  stream/                  Word Stream — registry-driven, renders whichever
                            module is active (Vocabulary, Phrasal Verbs, ...)
  phrasal-verbs/           Phrasal verb listing + [slug] detail pages
  grammar/                 Grammar listing + [slug] detail pages
  idioms/                  Idioms listing + [slug] detail pages
  prepositions/            Prepositions listing + [slug] detail pages
  encyclopedia/            Encyclopedia listing + [slug] detail pages
                            (adult depth view of the shared Discovery dataset)
  saved/                   Saved + learning words/phrasal verbs, progress overview
  history/                 Recently viewed words
  word/[slug]/              Dictionary word detail page (SEO metadata per word)
  api/word/[word]/          Server-side proxy for dictionary/thesaurus lookups
  about/                   Product explanation
  kids/                    Kids Mode (ages ~3-6) — First Words, Alphabet
                            (+ letter tracing), Sight Words, Discover, Parent
                            Dashboard
  young-learners/          Young Learners (ages ~7-12) — Sight Words tier 2,
                            Grammar, Discovery, via the generic ContentModule
                            system
  sitemap.ts, robots.ts    SEO
  not-found.tsx, error.tsx, global-error.tsx

components/
  dictionary/              SearchBar, WordCard, VocabularyStreamCard, detail sections
  stream/                  ModuleStreamView, ModuleFilterTabs, ContentTypeToggle,
                            countdown, controls, interval selector — all generic,
                            shared by every module
  phrasalVerbs/            PhrasalVerbCard, PhrasalVerbStreamCard, action bar
  layout/                  Header, Footer, ThemeProvider
  ui/                      CefrBadge, AudioButton, ModuleActionBar (generic
                            save/know/learning bar), loading/empty/error states

data/
  core-3000.json           Word list: { id, word, slug, partOfSpeech, cefrLevel }

hooks/
  useModuleProgress.ts     Generic saved/known/learning state for ANY module
  useModuleStream.ts       Generic Stream timer/selection/history for ANY module
  useKeyboardShortcuts.ts
  useReducedMotion.ts

lib/
  registry.ts              CONTENT_MODULES — the list of registered learning
                            modules. Adding a new module = one new entry here.
  modules/
    vocabulary.ts            ContentModule implementation for Vocabulary
    phrasalVerbs.ts           ContentModule implementation for Phrasal Verbs
    grammar.ts                ContentModule implementation for Grammar
    idioms.ts                 ContentModule implementation for Idioms
    prepositions.ts           ContentModule implementation for Prepositions
    youngSightWords.ts         ContentModule (track: "kids") for Young Learners
    youngGrammar.ts             ContentModule (track: "kids") for Young Learners
  dictionary/
    provider.ts             DictionaryProvider interface (the abstraction)
    freeDictionaryProvider.ts  Free Dictionary API implementation (server + client paths)
    coreList.ts              Local Core 3000 lookup/search helpers
    sampleWords.ts            20 hand-written rich sample entries
  phrasalVerbs/
    data.ts                  ~448 original phrasal verb entries
    selection.ts              Stream selection logic
  grammar/, idioms/, prepositions/   Same data.ts + selection.ts pattern
  kids/
    words.ts, alphabet.ts, sightWords.ts, storage.ts   Kids Mode content + a
                              separate, much simpler star/seen-slugs storage layer
  youngLearners/
    sightWords.ts, grammar.ts, selection.ts   Young Learners content — reuses
                              the adult selection-function pattern
  word-selection.ts         Word Stream selection logic (spaced-repetition-ready)
  storage.ts                Generic, module-scoped localStorage layer

types/
  dictionary.ts             WordEntry, Definition, CEFRLevel, etc.
  phrasalVerb.ts             PhrasalVerbEntry, PhrasalVerbSense, Formality
  grammar.ts, idiom.ts, preposition.ts   Same pattern per module
  kids.ts, youngLearner.ts   Kids Mode and Young Learners content shapes
  contentModule.ts           ContentModule<TEntry, TCandidate, TFilter> — the
                              contract every module implements

scripts/
  build-core-3000.js        One-off parser used to build the initial dataset
  import-words.js           Re-usable CSV/JSON → data/core-3000.json importer
```

## Architecture notes

**The content-module system.** This is the load-bearing abstraction in the app.
Every learning category — Vocabulary and Phrasal Verbs today; Grammar, Idioms,
Prepositions, etc. later — implements the same `ContentModule<TEntry, TCandidate,
TFilter>` interface (`types/contentModule.ts`): selection logic, how to resolve a
candidate into a full entry, a slug getter, and a Stream card component. Two
**generic** hooks then drive *any* module:

- `hooks/useModuleStream.ts` — timer, history, retry-on-network-failure. Works
  identically for network-backed modules (Vocabulary, which calls the dictionary
  API) and fully-local modules (Phrasal Verbs, where `resolveEntry` is just a
  pass-through) — the hook doesn't know or care which kind it's driving.
- `hooks/useModuleProgress.ts` — saved/known/learning state, namespaced by
  `moduleId` in storage.

The Stream page (`app/stream/page.tsx`) reads the list of modules from
`lib/registry.ts` and renders `ModuleStreamView` for whichever one is active — it
has no Vocabulary- or Phrasal-Verb-specific code in it at all.

**Adding a new module** (e.g. Grammar) means:
1. `types/grammar.ts` — its data shape.
2. `lib/grammar/data.ts` — the actual content. **This is the only file you touch
   to update a category's data later** — it never requires changes to the Stream,
   storage, or any other module.
3. `lib/grammar/selection.ts` — a ~15-line filter function.
4. `components/grammar/GrammarStreamCard.tsx` — how one entry renders.
5. `lib/modules/grammar.ts` — the `ContentModule` object tying the above together.
6. One line in `lib/registry.ts`.

That's it — it automatically appears in the Stream's content-type switcher with
its own filter tabs, gets its own Saved/Learning tracking, and needs zero changes
to any existing file beyond the registry line.

**Dictionary provider abstraction.** The UI never calls an external API directly — it
calls `dictionaryProvider.getWord() / .searchWords() / .getSuggestions()`
(`lib/dictionary/provider.ts`). Today that's implemented by
`freeDictionaryProvider.ts`, which normalizes Free Dictionary API responses (and 20
hand-written sample entries) into the internal `WordEntry` shape, routing browser
calls through `app/api/word/[word]/route.ts` (a same-origin server proxy — avoids
CORS/ad-blocker fragility and enables shared server-side caching). Swapping in a
licensed API or an internal database later means writing one new file that satisfies
the same interface — no component changes required.

**Data model.** `WordEntry` supports multiple parts of speech and multiple definitions
per word (see `types/dictionary.ts`) rather than assuming one sense per word. Every
enrichment field is optional; the word-detail page hides empty sections instead of
rendering blank cards.

**Selection logic.** `lib/word-selection.ts` and `lib/phrasalVerbs/selection.ts`
currently do randomized selection within a filter, biased away from recently shown
entries. This is intentionally the single seam for adding spaced repetition later —
swap the random pick for a priority-queue lookup inside a module's `selectNext`
without touching `useModuleStream` or any component.

**Storage.** `lib/storage.ts` is generic and module-scoped (`getModuleStatusMap`,
`getModuleSavedSlugs`, etc., all parameterized by `moduleId`) rather than one
hand-written set of functions per module. If Supabase auth + a database are added
later, only this file needs to change.

## Where the data comes from

`data/core-3000.json` contains only **factual metadata** — word, part of speech, and
CEFR level — derived from a standard frequency list. It contains **no definitions,
examples, or other copyrighted editorial content**. All definitions/examples shown in
the app are either normalized from the open Free Dictionary API or, for the 20 sample
words used as offline-friendly demo content (*ability, accept, achieve, acquire,
adventure, affect, approach, benefit, challenge, confidence, develop, essential,
experience, improve, knowledge, opportunity, progress, relevant, strategy, valuable*),
written originally for this product.

`lib/phrasalVerbs/data.ts` (~448 phrasal verb entries) is entirely original content —
meanings, simple definitions, examples, and synonyms were all written specifically for
this product. It was not extracted, transcribed, or checked against any published
phrasal verb dictionary. Coverage was informed by two legitimate, non-proprietary
sources: (1) published academic corpus-frequency research on English phrasal verbs
(Gardner & Davies 2007; Liu 2011) — open research findings, not any single publisher's
content — used to identify which verb+particle combinations matter most, and (2) an
independently compiled study list (own definitions/examples, not a scan of a
dictionary) used as a cross-check for additional coverage. In both cases only the
*list of which phrasal verbs to cover* was informed by these sources; every
definition, example, and piece of grammatical metadata (separable/transitive/
formality) was written from scratch for this product.

`lib/grammar/data.ts` (66 grammar points) is entirely original content — every
explanation, structure formula, example sentence, and common-mistake note was
written from scratch for this product. Coverage and CEFR-level placement follow
standard, widely-taught ESL curriculum structure — the same categories any general
English course or the CEFR's own published framework cover (tenses, articles,
modals, conditionals, passive voice, reported speech, relative clauses, and so on)
— not copied from any single textbook or proprietary grammar reference.

`lib/idioms/data.ts` (154 idioms) is entirely original content — every meaning,
definition, and example sentence was written from scratch for this product. Idioms
are common, widely-shared everyday language, not any single publisher's content;
coverage was chosen for everyday usefulness across common themes (body, animals,
food, money, work, communication, and more) rather than to match any specific
existing reference work.

`lib/prepositions/data.ts` (96 entries) is entirely original content — every usage
explanation and example sentence was written from scratch for this product.
Prepositions are core grammatical function words, not any single publisher's
content. Coverage deliberately excludes verb + preposition combinations (e.g.
"depend on"), since those are already covered as prepositional verbs in the
Phrasal Verbs module.

## Local installation

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Environment variables

None are required to run the core app — see `.env.example`. The default
dictionary provider (Free Dictionary API) is public and keyless.

Optional: two `NEXT_PUBLIC_SUPABASE_*` variables enable accounts and
multi-device sync for the adult track (see "Accounts & multi-device sync"
above). If you add a licensed dictionary provider later, put its
credentials in `.env.local` and read them only from server-side code (never
prefix a secret with `NEXT_PUBLIC_`).

## Development commands

```bash
npm install       # install dependencies
npm run dev       # start the dev server
npm run build     # production build
npm run start     # run the production build locally
npm run lint      # ESLint
```

## Importing your complete Core 3000 word list

The app ships with all ~3,000 words already parsed into `data/core-3000.json`
(word / part of speech / CEFR level only). To replace it with your own list:

```bash
node scripts/import-words.js path/to/your-list.csv
# or
node scripts/import-words.js path/to/your-list.json
```

**CSV format** (header row required):
```csv
word,partOfSpeech,level
acquire,verb,B2
ability,noun,A2
```

**JSON format:**
```json
[{ "word": "acquire", "partOfSpeech": "verb", "level": "B2" }]
```

CEFR levels are normalized to `A1/A2/B1/B2` (case-insensitive). Rows missing a word or
with an unrecognized level are skipped and reported in the console — never silently
dropped. The script writes directly to `data/core-3000.json`, overwriting the existing
file, so commit or back up first if you want to keep the original.

To add richer curated content (definitions, examples, etc.) for specific words the way
the 20 sample entries work, add entries to `SAMPLE_WORDS` in
`lib/dictionary/sampleWords.ts` — anything not listed there falls back to the live
Free Dictionary API automatically.

## Deploying

### GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected). No environment variables required
   for the default setup.
3. Deploy. `npm run build` runs automatically.

> **Note on fonts:** this project uses `next/font/google` (Fraunces, Inter, IBM Plex
> Mono), which fetches font files from Google Fonts at build time. This requires the
> build environment to have normal internet access — true on your machine and on
> Vercel by default. (It is the *only* reason a build would fail in a network-locked
> sandbox; everything else — TypeScript, ESLint, and the app logic — has been verified
> to build and run cleanly.)

## Known limitations

- Progress, saved words, and history are stored per-browser in `localStorage` — they
  don't sync across devices. Multi-device sync would require the Supabase layer
  described below.
- Only 20 words have hand-curated rich content (definitions written specifically for
  this product); every other Core 3000 word is enriched live from the Free Dictionary
  API, which occasionally lacks an entry for less common words or returns thinner data
  than a licensed dictionary would.
- Audio pronunciation depends on what the Free Dictionary API has recorded for a given
  word; when it's missing, the app falls back to the browser's built-in speech
  synthesis, which varies in quality by device/browser.
- Word Stream selection is random-within-filter, not adaptive — see the roadmap below.
- No offline/PWA support yet; the Stream and word lookups require a network connection
  for anything beyond the 20 sample words.

## Roadmap

- **Five content modules now live**: Vocabulary, Phrasal Verbs, Grammar, Idioms,
  and Prepositions — all built on the same generic module system
  (`useModuleStream`, `useModuleProgress`, `lib/registry.ts`), proving the "add a
  category without touching the Stream/storage/other modules" pattern out at
  scale. Further categories (collocations, functional/situational language, etc.)
  follow the exact same recipe in "Adding a new module" above.
- **Kids Mode shipped** (`/kids`) — First Words (~85 words, 11 topics), ABC
  Letters (26, with a canvas-based letter-tracing activity), Sight Words (Dolch
  Pre-Primer, 40 words), and a Parent Dashboard (`/kids/parents`), with its own
  theme, parent gate, and star-based reward system.
- **Young Learners shipped** (`/young-learners`) — Sight Words (Dolch Primer +
  1st + 2nd Grade, 139 words) and simple Grammar (20 concepts), the first real
  use of the adult `ContentModule` system's `track: "kids"` field.
- **Discovery shipped in full, across all three tracks** — all 10
  originally-scoped categories (Animals, Space, Dinosaurs, Countries, Human
  Body, Ocean, Weather & Seasons, Plants, Inventions & Technology, History's
  Big Moments — 150 entries total), sharing one dataset at three depths: Kids
  Mode (`/kids/discover`), Young Learners, and a full adult Encyclopedia
  (`/encyclopedia`) with real vocabulary cross-linking in both directions
  (`lib/discovery/crossLinks.ts`) — the "Volcano model" from the product
  blueprint, implemented as a computed relationship rather than a stored
  join table.
- **Unified search shipped** (`/search`, `lib/search/unifiedSearch.ts`) —
  the last MVP item from the blueprint's roadmap (Section 19). One search
  box across all 6 adult content types, grouped results, reachable from a
  header icon on every adult page.
- **Young Learners rounded out** — 3rd Grade Dolch tier added (180 sight
  words total, up from 139), 8 more grammar concepts (28 total, up from 20:
  homophones, prefixes/suffixes, irregular verbs, sentence types, and more),
  and a "ready for more?" transition prompt on the landing page once ~60% of
  Young Learners content is marked known, linking to the full adult
  `/stream`. This closes out every item from the blueprint's concrete
  MVP-to-Version-2 punch list. Natural next steps from here are genuinely
  Version 2 territory:
- **Accounts & sync shipped** — Supabase auth (magic-link) + Postgres,
  additive alongside `lib/storage.ts` rather than replacing it (see
  "Accounts & multi-device sync" above for the full architecture). Adult
  track only, by design. Requires a Supabase project + two env vars to
  actually activate; the app works exactly as before without them.
- **Spaced repetition shipped** (`lib/spacedRepetition.ts`) — every
  module's `selectNext` now prefers due-for-review items over pure
  randomness, with no new UI (see "Spaced repetition" above). The schedule
  itself (interval/due-date) stays local per device and isn't what syncs —
  but `lib/sync/progressSync.ts` seeds a fresh schedule on merge whenever a
  known/learning status arrives from another device, so a status synced in
  still gets prioritized for review locally, not just labeled.
- **Quiz shipped** (`/quiz`) — Random Mix, Topic, and Model Test modes, all
  generated locally from existing content with zero separately-authored quiz
  content (see "Quiz" above).
- **Admin content management: all six adult modules, plus CSV bulk import**
  (`/admin`) — the CMS-trigger condition from the blueprint has been met (a
  non-technical person needs to add content directly). A generic
  field-schema + form + CRUD system where adding a module is a config
  object, not a new page set (see "Admin content management" above).
  Encyclopedia, Grammar, Idioms, Vocabulary, Phrasal Verbs, and
  Prepositions are all registered; the latter three simplify to one
  sense/definition per admin-added entry rather than their full
  multi-sense shape. CSV import works identically across every module,
  generated from the same field schema as the single-entry form. Still
  open: admin-added entries only appear on each module's own public
  browsing pages — not yet in Kids Mode, Young Learners, cross-linking,
  the Stream, or Quiz; and entries needing more than one sense/definition
  are still best added via code.
- **Daily goals & streaks** built on top of the existing progress tracking.
- **AI-generated word explanations & practice sentences**, and lightweight quizzes.
- **Larger dictionary** — swap or layer a 100,000+ word provider behind the existing
  `DictionaryProvider` interface.
- **PWA / offline mode** — Phrasal Verbs already works fully offline since its data
  is local; extending this to the Vocabulary module (caching dictionary responses)
  is the next step.
- **Browser extension** for in-page lookups.
- **Additional languages**, both for UI and for a second target language's vocabulary.
