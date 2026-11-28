# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack
Vite + React 19 + TypeScript + Tailwind v4, with Lenis, GSAP and React Bits components. The first draft is a clickable prototype: frontend only, with sample data kept in the browser and a role switcher in place of real sign-in. A real backend is a later decision.

## Users
- **Participants (رائدات الأعمال / الفرق):** PNU students and graduate students, researchers with research outputs, and women founders with an existing product. They move through the program as teams.
- **Mentors (المرشدون):** follow assigned teams, hold sessions and office hours, and approve milestones ("معالم يعتمدها المرشد").
- **Experts (الخبراء):** run the stage workshops and the legal, financial and marketing clinics.
- **Judges (المحكّمون):** external evaluation committees that score teams with standard scorecards at each gate.
- **Admins (إدارة البرنامج):** the center's program team. They run operations, selection, gates, quality, escalations and reporting.

## Product Purpose
Sudum is the incubator of the Innovation & Entrepreneurship Center at Princess Nourah bint Abdulrahman University. It brings the university's whole entrepreneurship journey, from idea to market, under one umbrella. The platform is the public face of the program and the place where every role does its part of that journey.

## Operating Context
- **Three entry points:** research outputs, student and graduation projects, and founders with an existing product.
- **Four stages, then graduation.** Every stage has its own registration, acceptance criteria and judging. Only الإلهام registration is open now; the others show «قريبًا» (`registration.open` in `src/data/program.ts`).
  - **Ilham (الإلهام):** 3 weeks, Jan 17 – Feb 4 2027. Open events (Jan 17–27), three workshops (Feb 1–3), registration Dec 24 – Feb 4, team interviews Feb 7–11, 25 teams announced Feb 14. Interview rubric: problem clarity 40, team fit 40, commitment 10, potential impact 10.
  - **Takween (تكوين):** 6 weeks, Mar 14 – Apr 22. 25 teams. Output: a prototype tested with 5 users and a 3-minute pitch. Ends with Judging Day (Apr 22); target pass rate 50%.
  - **Tamkeen (تمكين):** 12 weeks, Apr 25 – Jul 29. 15 teams (10 advanced + 5 open seats). Output: a working MVP, an applied business model and identity, 20 users or a field trial, and a live metrics dashboard. Ends with Judging Day (Jul 29).
  - **الانطلاق (Intilaq), the fourth and last stage:** 12 weeks, Sep 5 – Dec 2. 8 companies (5 advanced + 3 open seats). Output: a registered company, a paying customer and an investor pitch. Ends with Demo Day (Dec 2), then graduation («التخرّج»).
- **Pauses and breaks:** workshops pause for Ramadan and Eid al-Fitr, and for two weeks at Eid al-Adha. The summer break is used to build the investor pipeline.
- **Governance:** steering committee → program manager → delivery teams. Escalation has three levels, with 3, 5 and 7 working-day deadlines.
- **Workshops:** الإلهام lists its ten events and workshops from the stage schedule; the other stages use plain-language versions of the official titles.
- **Eligibility:** a team must include a PNU student or affiliate, or have a woman founder or co-founder. Men may be on the team. The الإلهام form checks this first and saves nothing for a team that does not meet it.
- **Help email:** bsdc-eu@pnu.edu.sa.
- **Expertise:** 5 areas that experts and mentors are nominated in.

## Brand Commitments
- Name **سُدُم / SUDUM**, meaning nebulae where stars are born. Home headline (chosen by the client): «هنا تولد الشركات». Earlier tagline from the deck: «هنا تتشكّل الأفكار، وتتلاقى المواهب والفرص، لتولد مشاريع تصنع أثرها.»
- Brand assets are in `src/assets/brand/`: the official Sudum logo (colour and white SVG), the PNU lockup (colour and white), the President's photo (from the PNU website), the star icon, and star backgrounds.
- The visual system follows the official identity kit and is recorded in DESIGN.md.
- **The President's message** on the home page is quoted word for word from the PNU website, with her name, title and photo taken from the same page (`src/data/president.ts`). Never edit the wording.
- **Voice** (set by the client after the first draft: "nobody reads all this"):
  - Say it in one line. A screen title needs no explanatory sentence unless the sentence carries a fact (a date, a count, a name).
  - Plain everyday Arabic. No coined or academic words (for example «تأطير», «نؤطّر»).
  - Formal Arabic with feminine address to participants.
  - English only for terms of art (MVP, UX/UI).
- **Agreed wording:**
  - «النتيجة», not «المخرج».
  - «التأهل / يتأهل», not «بوابة العبور / يعبر».
  - «المهام», not «المعالم».
  - «استشارة / جلسات استشارية», not «عيادة / عيادات».
  - «اتفاق الفريق», not «ميثاق العمل».
  - «مقابلة القبول», not «مقابلة الفرز».
  - «قدّمي الآن», not «سجّلي اهتمامك».
  - Kept as is: stage names, «يوم التحكيم», «الساعات المكتبية», «التصعيد».
- **Workshop titles** on the site are plain-language versions of the official «عناوين الورش» list (`WORKSHOPS` in `src/data/program.ts`).
- Stage 4 is named **«الانطلاق»**, and teams graduate after it. The words «سنام» and «المسرعة» are not used anywhere (client decision).

## Evidence on Hand
The source documents are the cohort-1 operating plan deck, the workshop titles PDF, the mentor and expert areas PDF, the identity kit, and the الإلهام stage documents (registration form, schedule, interview guide and rubric). Speaker names suggested in the schedule are internal and are not published. All people, teams and scores in the prototype are fictional sample data and must be labelled as such. There are no real testimonials, partners or results yet, so none may be invented.

## Product Principles
1. One journey, four stages: every screen shows where a team is on that journey.
2. Every judging day is announced in advance, with its criteria visible to the people it affects.
3. Each role sees what is theirs to act on first.
4. Short beats complete: the home page answers what it is, how it works, who it is for and how to start, and nothing else.

## Accessibility & Inclusion
Arabic, right to left. WCAG AA contrast. Keyboard reachable. Respects reduced motion.
