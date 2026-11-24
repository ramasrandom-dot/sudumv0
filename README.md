# سُدُم: منصة حاضنة جامعة الأميرة نورة

The first draft of the Sudum incubator platform. It is a **clickable prototype**: frontend only, with fictional sample data saved in the browser.

## Run it

```bash
npm install
npm run dev
```

Open the local URL that `npm run dev` prints.

To share a preview without a server, run `npm run build:single`. It writes `dist-single/index.html`, a single self-contained file (about 1 MB) that opens directly in a browser. Use **دخول المنصة** to try the platform as any of the five roles, and switch roles at any time from the top bar.

## What's inside

- **Public site** (`/`, `/program`, `/apply`, `/join`)
  - The program story, the four stages, the 2027 timeline and the 23 workshops.
  - A participant application form.
  - A mentor / expert / judge nomination form.
- **Platform** (`/app/...`), with one area per role:
  - **Participant:** overview, milestones, workshops, mentoring and clinics, judging results, team.
  - **Mentor:** teams, milestone approval, sessions, office hours.
  - **Expert:** workshops, clinic requests, profile.
  - **Judge:** judging days and the standard scorecard.
  - **Admin:** dashboard, applications, teams and mentor matching, workshops, people and nominations, judging and publishing gate results, escalations, timeline.

All roles share one store, so an action in one role shows up for the others. For example: an application from `/apply` appears in admin; a mentor's approval reaches the participant; judges' scores reach admin, who publishes the results to the teams. Use **إعادة الضبط** in the top bar to restore the sample data.

The prototype's "today" is fixed at **15 June 2027**, in week 6 of Tamkeen (see `TODAY` in `src/data/program.ts`).

## Where things live

| Path | What |
|---|---|
| `src/data/program.ts` | Program facts: stages, dates, the 23 workshop titles, expertise areas, scorecard criteria |
| `src/data/seed.ts` | Fictional people, teams, scores and requests |
| `src/store/` | Shared state (localStorage) and selectors |
| `src/pages/public/`, `src/pages/app/<role>/` | Screens |
| `src/components/brand/` | Star motif, logos, stage badges |
| `PRODUCT.md`, `DESIGN.md` | Product and design records, from the brand brief |

## Stack

Vite, React 19, TypeScript, Tailwind v4, React Router, GSAP and ScrollTrigger, Lenis (public pages only), and React Bits (SplitText, CountUp). To add more React Bits components, run `npm run reactbits -- <Name>`.
