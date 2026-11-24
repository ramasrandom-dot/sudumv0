# Design

This is the Sudum visual system, taken from the brand brief (sampled from the cohort-1 deck). It is the authority for every surface.

## World
The system is navy on off-white, colour-coded by program stage. The four-point concave star (the nebula sparkle) is the one motif used everywhere. Public pages open on the deck's dark cover: a gradient from black to navy, with outline stars and a white logo lockup. Platform screens are calm working surfaces on the off-white canvas.

## Colour tokens (`src/index.css` `@theme`)
| Token | Hex | Role |
|---|---|---|
| navy | #0A0F3C | Text, headings, primary actions |
| navy-deep | #090E3B | Sanam stage, dark panels, sidebar |
| blue | #2086C2 | Ilham stage, stars, links accent |
| green | #39B67E | Takween stage (fills only; text uses green-ink #1C7A50) |
| teal | #00535C | Tamkeen stage |
| slate | #5B6480 | Secondary text |
| canvas | #F3F2F3 | Page background |
| tint-blue / tint-ice / tint-mint | #DCE8FF / #D2EEFF / #D5FFDE | Highlight fills, icon tiles |
| orange | #FF8A4C | The Ramadan pause on timelines only |

Stage colours are fixed: Ilham blue · Takween green · Tamkeen teal · Sanam deep navy. Each stage also defines an "ink" colour for text on its tint and an "on" colour for text on its solid fill (see `STAGES` in `src/data/program.ts`).

## Type
- IBM Plex Sans Arabic stands in for the licensed Frutiger LT Arabic 55.
- Hierarchy comes from weight and size only.
- Platform scale is a fixed rem scale.
- Public display headings may go larger, up to 6rem.

## Shape and depth
- Cards are white, with a 12px radius and a 1px hairline (#E2E2EA).
- Raised cards add a soft navy shadow with an offset.
- Stage cards may carry a header band in the stage colour.

## Motion
- Lenis smooth scroll on public pages only.
- One authored moment per public page: the hero words arrive, and the stage line draws.
- Platform motion is limited to state changes (150–250ms).
- Reduced motion is always respected.
- Arabic text is never split by character.

## Layout
- Right to left, using logical properties.
- Platform: a navy sidebar on the right and the content on the canvas. On phones the sidebar becomes a drawer, and tables become stacked rows.
