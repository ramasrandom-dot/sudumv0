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
- **Four stages.** Incubation support runs through Takween, Tamkeen and Sanam.
  - **Ilham (الإلهام):** 3 weeks, Jan 17 – Feb 4 2027. 500 registrants → an 80-person ideas lab → 25 teams. Ends with Selection Day (Feb 4).
  - **Takween (تكوين):** 6 weeks, Mar 14 – Apr 22. 25 teams. Output: a prototype tested with 5 users and a 3-minute pitch. Ends with Judging Day (Apr 22); target pass rate 50%.
  - **Tamkeen (تمكين):** 12 weeks, Apr 25 – Jul 29. 15 teams (10 advanced + 5 open seats). Output: a working MVP, an applied business model and identity, 20 users or a field trial, and a live metrics dashboard. Ends with Judging Day (Jul 29).
  - **Sanam Accelerator (مسرعة سنام):** 12 weeks, Sep 5 – Dec 2. 8 companies (5 advanced + 3 open seats). Output: a registered company, a paying customer and an investor pitch. Ends with Demo Day (Dec 2).
- **Pauses and breaks:** workshops pause for Ramadan and Eid al-Fitr, and for two weeks at Eid al-Adha. The summer break is used to build the investor pipeline.
- **Governance:** steering committee → program manager → delivery teams. Escalation has three levels, with 3, 5 and 7 working-day deadlines.
- **Workshops:** 23 titles across the four stages.
- **Expertise:** 5 areas that experts and mentors are nominated in.

## Brand Commitments
- Name **سُدُم / SUDUM**, meaning nebulae where stars are born. Tagline: «هنا تتشكّل الأفكار، وتتلاقى المواهب والفرص، لتولد مشاريع تصنع أثرها.»
- Brand assets are in `src/assets/brand/`: the Sudum logo (colour and white), the PNU logo (white), the star icon, and star backgrounds.
- The full visual system is in the brand brief and is recorded in DESIGN.md.
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
- Stage 4 is named **«مسرعة سنام»** throughout. The source deck also uses «الانطلاق»; this is an open decision for the client.

## Evidence on Hand
The source documents are the cohort-1 operating plan deck, the workshop titles PDF, the mentor and expert areas PDF, and the brand brief. All people, teams and scores in the prototype are fictional sample data and must be labelled as such. There are no real testimonials, partners or results yet, so none may be invented.

## Product Principles
1. One journey, four stages: every screen shows where a team is on that journey.
2. Every judging day is announced in advance, with its criteria visible to the people it affects.
3. Each role sees what is theirs to act on first.
4. Short beats complete: the home page answers what it is, how it works, who it is for and how to start, and nothing else.

## Accessibility & Inclusion
Arabic, right to left. WCAG AA contrast. Keyboard reachable. Respects reduced motion.
