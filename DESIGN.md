# Design

This is the Sudum visual system, taken from the official identity kit supplied by the client (colours, typefaces, logo). It is the authority for every surface.

## World
Navy on a cool off-white, colour-coded by program stage. The four-point concave star (the nebula sparkle) is the one motif used everywhere. Public pages open on a dark starry cover with the white Sudum logo beside the PNU lockup. Section titles carry a short two-colour bar (blue and green). Platform screens are calm working surfaces on the canvas.

## Colour tokens (`src/index.css` `@theme`)
| Token | Hex | Role |
|---|---|---|
| navy | #031330 | Text, headings, primary actions, الانطلاق stage |
| blue | #3E84BE | الإلهام stage, experts |
| green | #60B382 | تكوين stage, judges (fills only; text uses green-ink #2A6E4A) |
| teal | #20525B | تمكين stage, mentors |
| mint | #8FDD90 | رائدة الأعمال panel, the Ramadan pause on timelines |
| blue-ink | #2A6496 | Blue text and links on light surfaces |
| slate | #55637A | Secondary text |
| canvas | #F4F6F6 | Page background |
| line / line-strong | #E0E5E8 / #C9D1D6 | Hairlines and field borders |
| tints | #DCEAF6 / #DDF2E4 / #DCE9EB / #E1E4EA | Highlight fills, chips |

Stage colours are fixed: الإلهام blue · تكوين green · تمكين teal · الانطلاق navy. Each stage defines an "ink" colour for text on its tint and an "on" colour for text on its solid fill (`STAGES` in `src/data/program.ts`).

Role colours are fixed too (`ROLE_COLOR`): mentors teal · experts blue · judges green. Every profile card, form header and home screen of a role uses its colour and nothing else.

Contrast: body text pairs pass 4.5:1. White on blue (#3E84BE) is 4.0:1, so it is used for large or bold text only.

## Type
- Arabic headlines (h1, h2 and display names): GE SS Two Medium. Subheads: GE SS Text Medium. Body: GE SS Text Light.
- Latin and numerals: Gotham (Book and Medium).
- The fonts are licensed files from the client's kit, in `src/assets/fonts/`.
- Hierarchy comes from weight and size only. Public display headings may go up to 6rem.

## Logos
- Sudum logo (official SVG, colour and white) with the PNU lockup beside it: white on dark surfaces, colour on light ones.

## Shape and depth
- Cards are white, with a 16px radius and a 1px hairline (#E0E5E8).
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
- Platform: a top bar with the role's few places, and bottom tabs on phones. Tables become stacked rows.
