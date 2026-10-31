# Odd Word Out: game rules and sample data

Social deduction word game. 4 to 10 players. Everyone needs their own phone. Works in the
same room or on a video/voice call: everything that matters (clues, votes, results) is on
every phone, talking happens out loud.

## Roles (new roles every round)

- **Crew**: sees the secret word, the category and their own **angle**.
- **Imposter**: sees the category, one **fuzzy hint**, and an angle. Never sees the word.
- **Echo** (optional, on by default at 5+ players): sees a *nearby* word (Windmill instead of
  Lighthouse) plus an angle. Their card looks exactly like a crew card. They do not know
  they are the Echo. They are innocent; voting them out is a wrong vote.
- Lobby toggles for extra party roles (off by default): **Jester** (wants to get voted
  out; gains 2 hearts if they get the most votes) and **Detective** (is told one player who
  is definitely not the imposter).

**Angles** make everyone's hint different. Each player gets a different angle to give their
clue from: a sound, a colour, a place, a feeling, who uses it, how it moves, a smell, a time
of year, a texture, its size. This stops everyone saying the obvious clue and gives the
imposter cover.

## Round flow (about 3 minutes)

1. **Secret card** (10 s). Your role card, private. Hold to peek.
2. **Clue** (30 s). Type one word that fits your angle. All clues appear on every phone at once.
3. **Talk** (60 to 90 s). Argue out loud. Timer on screen.
4. **Vote** (20 s). Tap a player. Votes are hidden until everyone has voted, then revealed together.
5. **Last chance**. If the imposter gets the most votes they get one guess at the word.
   Right guess = they escape.
6. **Hearts** (everyone starts with 3):
   - You voted for an innocent player: you lose 1 heart.
   - You voted for the imposter: safe.
   - Imposter caught and guessed wrong: imposter loses 1 heart.
   - Imposter escaped: imposter gains 1 heart (max 3).
   Only wrong voters lose, and only 1 heart each, so nobody is knocked out in one bad round.
7. **0 hearts = Ghost**. Ghosts still see the word and still give clues, but cannot vote and
   cannot be the imposter.
8. Game ends after 5 rounds or when only 2 players have hearts. Most hearts wins. Tiebreak:
   most correct votes.

## Sample data (use exactly this in every view)

Players, in this order, with hearts BEFORE this round:
| Player | Hearts before | Role this round | Angle | Clue |
|---|---|---|---|---|
| You (host) | 3 | Crew | a sound | Foghorn |
| Gran | 2 | Crew | a place | Coast |
| Dad | 2 | Imposter | a colour | White |
| Mum | 3 | Crew | a feeling | Safe |
| Mia | 1 | Echo (word: Windmill) | how it moves | Spinning |
| Leo | 2 | Crew | who uses it | Sailors |

- Round 3 of 5. Category: **Places**. Secret word: **Lighthouse**. Echo word: **Windmill**.
- Imposter fuzzy hint: **"It's tall."**
- Room code: **MOTH**. Join at **oddwordout.app** (fictional).
- Lobby settings: 3 hearts, 5 rounds, packs Places + Food + Animals selected (Jobs, Sports,
  At Home available), Imposters: 1, Echo: on, Jester: off, Detective: off. 6 players joined;
  the host (You) sees a Start button.
- Votes: Gran → Dad, You → Dad, Leo → Dad, Mum → Mia, Dad → Mia, Mia → Gran.
  Tally: Dad 3, Mia 2, Gran 1. Dad is caught.
- Dad's last-chance guess: **"Castle"**: wrong.
- Hearts AFTER: You 3, Gran 2, Dad 1 (caught), Mum 2 (voted the Echo), Mia 0 (voted Gran,
  now a **Ghost**), Leo 2.
- Clue screen moment: all 6 clues in, talk timer at 0:48.
- Vote screen moment: you have picked Dad, 4 of 6 have voted, 0:12 left.

## Word packs (word / echo word / imposter hint)

- **Places**: Lighthouse / Windmill / It's tall · Airport / Train station / Lots of waiting ·
  Library / Bookshop / Be quiet · Zoo / Farm / Animals live here · Cinema / Theatre / Sit in the dark ·
  Beach / Swimming pool / You get wet · Hospital / Dentist / Nobody wants to go
- **Food**: Pancakes / Waffles / Breakfast · Pizza / Lasagne / Has cheese · Ice cream / Frozen yogurt / Cold ·
  Popcorn / Crisps / Crunchy · Sushi / Spring roll / You roll it · Spaghetti / Noodles / Slurp
- **Animals**: Penguin / Puffin / Lives somewhere cold · Shark / Dolphin / Swims · Owl / Bat / Awake at night ·
  Giraffe / Camel / Long legs · Octopus / Jellyfish / No bones · Hamster / Guinea pig / Lives in a cage
- **Jobs**: Firefighter / Police officer / Wears a uniform · Chef / Baker / Works in a kitchen ·
  Pilot / Astronaut / Goes up · Teacher / Librarian / Works with kids · Dentist / Doctor / Wears gloves
- **At Home**: Toaster / Microwave / In the kitchen · Pillow / Blanket / Soft · Toothbrush / Hairbrush / Every morning ·
  Fridge / Freezer / Hums · Sofa / Bed / You lie on it
- **Sports**: Football / Rugby / Kick it · Tennis / Badminton / Uses a net · Skiing / Snowboarding / Needs snow ·
  Swimming / Diving / Wear goggles
- **Stories**: Dragon / Dinosaur / Huge · Pirate / Viking / Sails the sea · Wizard / Witch / Does magic ·
  Robot / Alien / Not human · Mermaid / Fairy / Not real
- **Holidays**: Birthday / Wedding / There's cake · Halloween / Bonfire Night / Happens in autumn ·
  Christmas / New Year / Late night · Sleepover / Camping / You stay the night
