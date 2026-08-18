# Lexicon — Manual Testing Checklist

Everything so far has been verified by me via `tsc`/`eslint`/`build`/`curl` only —
never in an actual browser, and never on a real touchscreen. This checklist is
organized so you can work through it systematically. **Test on both desktop and
an actual phone**, not just a resized browser window — several items below
specifically need a real touch device.

---

## 1. Adult App

- [ ] Landing page loads; "Word of the Moment" card shows real content and
      auto-rotates every 30s
- [ ] `/stream` — toggle between all 5 modules (Vocabulary, Phrasal Verbs,
      Grammar, Idioms, Prepositions); each shows the correct card layout and
      its own filter tabs
- [ ] `/stream` keyboard shortcuts: space (pause), ←/→ (navigate), s/k/l
      (save/know/learning) — and confirm they're **disabled** while typing in
      the search bar
- [ ] `/explore` — search box, CEFR level tabs, part-of-speech dropdown,
      "Show more" pagination, A–Z rail
- [ ] `/phrasal-verbs`, `/grammar`, `/idioms`, `/prepositions` listing pages —
      search + filters work, cards link to the right detail page
- [ ] Detail pages (`/word/[slug]`, `/phrasal-verbs/[slug]`, etc.) — Save / I
      know this / Still learning buttons work and **persist after a page
      reload**
- [ ] `/saved` — shows saved + learning items correctly across all 5 modules
- [ ] `/history` — shows recently viewed words
- [ ] Light/dark theme toggle (top right) — check both look correct on a few
      different pages
- [ ] Mobile: hamburger menu opens/closes, cards don't overflow or clip

---

## 2. Kids Mode (`/kids`) — test on a real touchscreen if at all possible

- [ ] Landing page: 3 activity cards, "Try Young Learners" link at the bottom
- [ ] `/kids/words` → pick a category → card **auto-speaks** the word on load
      — confirm this actually works (browser autoplay policies vary a lot;
      test in more than one browser if you can)
- [ ] Mute toggle on the card actually silences it
- [ ] Next/Previous arrows and the star button work; star counter in the
      header updates live without a refresh
- [ ] `/kids/alphabet` → pick a letter → sound hint speaks, both example
      words show
- [ ] **Letter tracing** (`/kids/alphabet/a/trace`) — highest-risk item,
      never tested on a real device:
  - [ ] Does drawing with a finger feel smooth, not laggy?
  - [ ] Does the progress bar actually fill as you trace over the letter?
  - [ ] Does it celebrate (🎉 + star) once you've traced roughly half the
        letter?
  - [ ] Try tracing loosely vs. tightly, fast vs. slow — does completion feel
        fair either way?
  - [ ] Does "Clear" actually reset it?
- [ ] Header "Exit" button → parent gate math question appears → wrong
      answer shows an error and lets you retry → correct answer returns to
      the main app
- [ ] `/kids/parents` — **paste this URL directly** into the address bar
      (don't click from the header) — confirm the gate still appears; it
      shouldn't be reachable without solving it
- [ ] After viewing a few words/letters, check the dashboard shows the right
      "seen" counts per activity

---

## 3. Young Learners (`/young-learners`)

- [ ] Landing page shows the correct counts (139 sight words / 20 grammar)
- [ ] `/young-learners/practice` — toggle between Sight Words and Grammar
- [ ] Filter tabs work for each (Primer/1st/2nd Grade for sight words;
      Word Types/Sentences/Punctuation/Word Play for grammar)
- [ ] Navigation is **manual only** — confirm it does NOT auto-advance like
      the adult Stream does
- [ ] Save / I know this / Still learning work and persist after reload

---

## 4. Cross-cutting

- [ ] Refresh mid-session on each of the three tracks — does progress
      (saved/known/learning, Kids stars) survive the reload?
- [ ] General page-load feel — does the large Vocabulary dataset (2,997
      words) or Phrasal Verbs (448) cause any noticeable lag anywhere?
- [ ] Try switching between light/dark and Kids/Young Learners themes in the
      same session — anything visually broken or flashing?

---

## Reporting issues back

For anything that doesn't work as expected, tell me:
1. **Which page/route**
2. **What you expected vs. what actually happened**
3. **Browser + device**, especially for audio or touch issues (these are the
   most likely to behave differently across Chrome/Safari/Firefox and
   desktop/mobile)

I'll fix things as you find them.
