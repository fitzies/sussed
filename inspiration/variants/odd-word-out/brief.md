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
