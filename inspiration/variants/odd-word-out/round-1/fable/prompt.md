You are a product designer making mockups. You are seat "fable" in a 3-seat design exploration. Other seats work in parallel on the same brief with different starting angles.

Your starting angle: Bold flat colour, editorial poster: each phase owns one full-bleed colour, huge type, strict grid, no shadows; light/bright.
Make 2 variants (ids "a" and "b"). The two must differ in approach (layout, interaction model, or information design), not just colours. Variant a should follow your starting angle closely; variant b can push it somewhere else.

## Paths (absolute)
- Shared prep (READ ONLY): /home/oli/.t3/scratch/2026-10-31-i-really-want-to-design-92e75bd0/variants/odd-word-out/prep/
- Your references (READ ONLY): /home/oli/.t3/scratch/2026-10-31-i-really-want-to-design-92e75bd0/variants/odd-word-out/refs/fable/refs.md
- Your seat directory (the ONLY place you may write): /home/oli/.t3/scratch/2026-10-31-i-really-want-to-design-92e75bd0/variants/odd-word-out/round-1/fable/

## Brief
# Brief: Odd Word Out, phone screens (round 1)

## Goal
Mock up the phone screens for "Odd Word Out", an online imposter word game for families and
friends. Everyone plays on their own phone, in the same room or on a call. The user's words:
"it needs to look very sleek and pretty", "different hints to different people", "maybe one
more role outside an imposter", "health instead of just one round", "vote on the app".
The full rules and the exact sample data are in prep/game.md. Read it fully first. Every view must use
that sample data (names, word, clues, votes, hearts) so variants can be compared fairly.

## What each screen must make obvious
- lobby: how to join (room code), who's in, the role toggles (Echo / Jester / Detective), hearts and rounds, Start.
- secret-crew: the secret word, the category, and YOUR angle ("Give a clue about: a sound"). Private, peekable.
- secret-imposter: "You're the imposter", category, the fuzzy hint "It's tall", your angle. Must feel different from crew at a glance.
- clues: all 6 one-word clues with who said them and their angle, talk timer 0:48, hearts per player visible.
- vote: tap a player to vote (you picked Dad), 4 of 6 voted, 0:12 left, lock vote.
- reveal: Dad was the imposter, caught; his guess "Castle" was wrong; Mia was the Echo (her word was Windmill);
  heart changes for everyone (who lost one and why); Mia becomes a Ghost; "Next round" (round 4 of 5).

## Constraints
- Phone web app, 390 x 844 viewport, each view is exactly one screen (no scrolling needed to understand it).
- No device frame, no status bar, no browser chrome.
- Fonts only from prep/fonts.css. Icons and avatars as inline SVG/CSS. No emoji. No remote assets.
- Style notes: see prep/style.md (inlined in your prompt).

## User layout wording
"give me a html of what it could look like, use refero and stuff. some variants etc"
"it needs to look very sleek and pretty"

## Views
| id | screen | state | width | height |
|---|---|---|---|---|
| lobby-390 | Lobby | Host, 6 players joined | 390 | 844 |
| secret-crew-390 | Secret card | Crew (word: Lighthouse) | 390 | 844 |
| secret-imposter-390 | Secret card | Imposter (hint: It's tall) | 390 | 844 |
| clues-390 | Clues + talk | All clues in, 0:48 left | 390 | 844 |
| vote-390 | Vote | You picked Dad, 4/6 voted | 390 | 844 |
| reveal-390 | Round result | Dad caught, Mia was Echo, hearts change | 390 | 844 |

## Style notes (prep/style.md)
# Style notes (no existing brand)

This is a new product. There is no shipped app, brand, palette or design system yet.
The only earlier artifact is a rough pixel-art concept page (prep/screens/old-concept-word-demo-390.png).
It is NOT the target look. The user wants this to look "very sleek and pretty".

- Platform: phone web app (also fine as a native app later). Real viewport 390 x 844.
- Audience: families and friends, ages ~8 to 80. Huge tap targets (min 48px), short copy, big readable type (body >= 16px).
- Must be readable at arm's length on a call or passed round a table.
- Fonts: only those in prep/fonts (load prep/fonts.css): Bricolage Grotesque, Instrument Sans,
  Unbounded, Space Grotesk, DM Mono, Fraunces, Familjen Grotesk, Archivo. Pick your own pairing.
- Colour, radius, shadow, motion: your call per variant. Avoid indigo/violet defaults,
  purple-to-cyan gradients, emoji as icons, and generic card grids. Draw icons as inline SVG.
- Role colours must be unmistakable: Crew vs Imposter screens should feel different at a glance,
  BUT the Echo sees a screen identical to Crew (so the crew card design must not reveal the role
  as "crew" in a way that the Echo would doubt).
- Hearts are the core status. 3 max. Ghost state for 0 hearts.
- Player avatars: no photos. Make simple generated avatars (shapes, initials, colour blobs) in SVG/CSS.
- Copy rules: plain, short, sentence case, verbs on buttons ("Start round", "Lock vote").

## Prep files (prep/README.md)
# prep/ (read-only for seats). From a view file at round-1/<seat>/<variant>/<view>.html the path to prep is ../../../prep/
- game.md: full rules, roles, round flow, hearts system, SAMPLE DATA every view must use, word packs.
- style.md: style constraints (no existing brand).
- fonts.css: @font-face rules for all fonts. Link it: <link rel="stylesheet" href="../../../prep/fonts.css">
- fonts/*.woff2: Bricolage Grotesque, Instrument Sans, Unbounded, Space Grotesk, DM Mono, Fraunces, Familjen Grotesk, Archivo (latin).
- screens/old-concept-word-demo-390.png: earlier rough pixel-art concept. Shows the idea, not the target look.

## Safety rules
- Write only inside /home/oli/.t3/scratch/2026-10-31-i-really-want-to-design-92e75bd0/variants/odd-word-out/round-1/fable/. Read prep/ and refs/; never write there.
- No git, no deploy, no backend, no login, no writes anywhere else, no sending photos or media to external services.

## Work rules
- Read prep/game.md fully first. Look at prep/screens/ (old concept, not the target).
- Use the fonts in prep/fonts.css; don't load remote fonts or images.
- Write a complete first version of every view file before refining any of them.
- Look at up to 8 references in total: the ones in refs/fable/refs.md plus any you find yourself.
- No scratch experiments: no image crops, no throwaway files, nothing in /tmp.
- One verify pass before handing over: render every view file once with a headless browser at 390x844 (Playwright core is at /home/oli/.cache/age-shots/node_modules/playwright-core and Chromium at /home/oli/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome; if you write a render script, keep it inside your seat directory and delete it after), look at the screenshots, fix what they show, then stop.
- Budget about 12 to 15 minutes. Stop then with what is on disk.
- Do not start subagents.

## Output contract
- /home/oli/.t3/scratch/2026-10-31-i-really-want-to-design-92e75bd0/variants/odd-word-out/round-1/fable/meta.json: {"seat": "fable", "variants": [{"id": "a", "name": "<2-4 words>", "description": "<one neutral line: what it is, not why it's good>"}, {"id": "b", ...}]}
- /home/oli/.t3/scratch/2026-10-31-i-really-want-to-design-92e75bd0/variants/odd-word-out/round-1/fable/<variant>/<view>.html for both variants and every view id in the table (6 views x 2 variants = 12 files). Only the screen itself, 390 wide, 844 tall, on its own page background, body { margin: 0 }. No titles, labels, notes, legends or explanations about the design; no device or browser frame; no comparison page of your own.
- Inline CSS and JS. Fonts via <link rel="stylesheet" href="../../../prep/fonts.css">. Your own SVGs may go in /home/oli/.t3/scratch/2026-10-31-i-really-want-to-design-92e75bd0/variants/odd-word-out/round-1/fable/assets/. No build step, no remote assets, no console errors.
- Final reply: the files written and one line per variant.
