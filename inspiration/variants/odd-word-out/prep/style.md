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
