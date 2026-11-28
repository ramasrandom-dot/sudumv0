import { useRef, useState, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, Check, GraduationCap, Mail, Plus } from 'lucide-react'
import SplitText from '@/components/reactbits/SplitText/SplitText'
import { Star } from '@/components/brand'
import { ButtonLink, Segmented } from '@/components/ui'
import { AFTER_PROGRAM, ENTRY_POINTS, HELP_EMAIL, SOON, STAGE, STAGES } from '@/data/program'
import { PRESIDENT } from '@/data/president'
import type { EntryPoint, StageId } from '@/data/types'
import { cn } from '@/lib/cn'
import cover from '@/assets/brand/cover-background-stars.webp'
import darkStars from '@/assets/brand/dark-background-stars-2.webp'
import Partners from './Partners'
import StageJourney from './StageJourney'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** A section title with the two-colour bar under it. */
function Heading({ id, children, onDark }: { id: string; children: ReactNode; onDark?: boolean }) {
  return (
    <div>
      <h2 id={id} className={cn('text-3xl font-bold md:text-4xl', onDark ? 'text-white' : 'text-navy')}>
        {children}
      </h2>
      <span aria-hidden className="mt-4 flex h-1.5 w-20 overflow-hidden rounded-full">
        <span className="flex-1 bg-blue" />
        <span className="flex-1 bg-green" />
      </span>
    </div>
  )
}

const shell = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-10'

function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.from('.hero-sub', { y: 16, opacity: 0, filter: 'blur(6px)', duration: 1.1 }, 0.55)
          .from('.hero-cta', { y: 12, opacity: 0, duration: 0.9 }, 0.75)
          .from('.journey-line', { scaleX: 0, transformOrigin: 'right center', duration: 1.6, ease: 'power3.inOut' }, 0.9)
          .from('.journey-stop', { y: 10, opacity: 0, duration: 0.8, stagger: 0.14 }, 1.1)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#03050a] text-white" aria-labelledby="hero-title">
      <img src={cover} alt="" aria-hidden className="absolute inset-0 -z-10 size-full object-cover object-left" width={2000} height={1125} fetchPriority="high" />
      <div className={cn(shell, 'flex w-full flex-1 flex-col justify-center pt-32 pb-10')}>
        <h1 id="hero-title" className="max-w-[14ch] text-[clamp(2.75rem,8vw,6rem)] leading-[1.2] font-bold">
          <SplitText
            text="هنا تولد الشركات"
            tag="span"
            splitType="words"
            trigger="load"
            delay={120}
            duration={1.1}
            ease="expo.out"
            from={{ opacity: 0, y: 48 }}
            to={{ opacity: 1, y: 0 }}
            textAlign="right"
            className="!block"
          />
        </h1>
        <p className="hero-sub mt-6 max-w-[38ch] text-xl leading-relaxed text-white/75 sm:text-2xl">
          حاضنة جامعة الأميرة نورة لمشاريع الطالبات والباحثات ورائدات الأعمال.
        </p>
        <div className="mt-10">
          <ButtonLink to="/apply" variant="light" size="lg" className="hero-cta">
            قدّم الآن
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>

      <div className={cn(shell, 'w-full pb-10')} aria-hidden>
        <div className="relative">
          <div className="journey-line absolute inset-x-0 top-[7px] h-px bg-linear-to-l from-blue via-green to-white/40" />
          <ol className="relative grid grid-cols-4 gap-x-3">
            {STAGES.map((s) => (
              <li key={s.id} className="journey-stop">
                <Star className="size-[15px]" color={s.id === 'intilaq' ? '#ffffff' : s.id === 'tamkeen' ? '#8FDD90' : s.color} />
                <p className="mt-3 text-sm font-bold sm:text-lg">{s.fullName}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* 1. عن سُدُم */
function About() {
  return (
    <section id="about" className="scroll-mt-20 bg-white" aria-labelledby="about-title">
      <div className={cn(shell, 'grid gap-12 py-20 md:py-24 lg:grid-cols-[1.15fr_1fr] lg:items-center')}>
        <div>
          <Heading id="about-title">عن سُدُم</Heading>
          <p className="mt-8 max-w-[52ch] text-xl leading-loose text-navy">
            سُدُم حاضنة مركز الابتكار وريادة الأعمال في جامعة الأميرة نورة بنت عبدالرحمن. رحلة من أربع مراحل، تبدأ بالإلهام وتنتهي بالتخرّج.
          </p>
          <p className="mt-4 max-w-[52ch] text-lg leading-loose text-slate">
            السُّدُم سحبٌ كونية تولد فيها النجوم. وهنا تتشكّل الأفكار، وتتلاقى المواهب والفرص، لتولد مشاريع تصنع أثرها.
          </p>
        </div>
        <ol className="flex flex-col gap-2" aria-label="مراحل سُدُم">
          {STAGES.map((s) => (
            <li key={s.id} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{ background: s.color, color: s.on }}>
              <Star className="size-5 shrink-0" />
              <span className="flex-1 text-xl font-bold">{s.fullName}</span>
              <RegTag open={s.registration.open} />
            </li>
          ))}
          <li className="flex items-center gap-4 rounded-2xl border border-dashed border-line-strong px-5 py-4 text-slate">
            <GraduationCap className="size-5 shrink-0" aria-hidden />
            <span className="text-xl font-bold">{AFTER_PROGRAM}</span>
          </li>
        </ol>
      </div>
    </section>
  )
}

/** Whether a stage is taking registrations now. Sits on the stage's own colour. */
function RegTag({ open }: { open: boolean }) {
  return open ? (
    <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-navy">التسجيل مفتوح</span>
  ) : (
    <span className="rounded-full bg-black/20 px-3 py-1 text-sm font-medium">{SOON}</span>
  )
}

/* 2. أهداف سُدُم */
const GOALS = [
  'إطلاق الدفعة الأولى وتنفيذها من يناير إلى ديسمبر 2027.',
  'استقطاب 25 فريقًا وتأهيل 8 شركات ناشئة.',
  'بناء قدرة تشغيلية تضمن استمرار الدفعات القادمة.',
]

function Goals() {
  return (
    <section id="goals" className="scroll-mt-20 bg-canvas" aria-labelledby="goals-title">
      <div className={cn(shell, 'py-20 md:py-24')}>
        <Heading id="goals-title">أهداف سُدُم</Heading>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {GOALS.map((g, i) => (
            <li key={g} className="flex flex-col gap-5 rounded-2xl bg-white p-7 shadow-card">
              <span aria-hidden className="tabular flex items-center gap-3 text-5xl leading-none font-bold text-teal">
                {i + 1}
                <span className="h-px flex-1 bg-line-strong" />
                <Star className="size-5 text-green" />
              </span>
              <p className="text-xl leading-relaxed font-medium text-navy">{g}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* 3. الفئات: each row lights up in its own colour as it crosses the screen. */
const AUDIENCE_TONE: Record<EntryPoint, { color: string; on: string }> = {
  student: { color: '#3E84BE', on: '#FFFFFF' },
  research: { color: '#60B382', on: '#031330' },
  founder: { color: '#20525B', on: '#FFFFFF' },
}

function Audience() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.aud-row').forEach((row) => {
          ScrollTrigger.create({ trigger: row, start: 'top 50%', end: 'bottom 50%', toggleClass: { targets: row, className: 'is-lit' } })
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="audience" className="scroll-mt-20 bg-white" aria-labelledby="audience-title">
      <div className={cn(shell, 'pt-20 md:pt-24')}>
        <Heading id="audience-title">الفئات</Heading>
      </div>
      <ul className="mt-10 border-t border-line-strong">
        {(Object.keys(ENTRY_POINTS) as EntryPoint[]).map((k) => {
          const tone = AUDIENCE_TONE[k]
          return (
            <li key={k} className="aud-row relative isolate overflow-hidden border-b border-line-strong" style={{ '--tone': tone.color, '--on': tone.on } as React.CSSProperties}>
              <span aria-hidden className="aud-fill absolute inset-0 -z-10" />
              <div className={cn(shell, 'flex flex-wrap items-center justify-between gap-x-10 gap-y-0.5 py-4 md:py-5')}>
                <h3 className="aud-ink flex items-center gap-[0.3em] text-[clamp(1.875rem,4.4vw,3.25rem)] leading-[1.3] font-bold text-navy">
                  <span className="aud-star" aria-hidden>
                    <Star className="size-[0.42em]" />
                  </span>
                  {ENTRY_POINTS[k].label}
                </h3>
                <p className="aud-ink text-lg text-slate md:text-xl">{ENTRY_POINTS[k].detail}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/* 5. كلمة الرئيسة */
function President() {
  return (
    <section id="president" className="scroll-mt-20 bg-white" aria-labelledby="president-title">
      <div className={cn(shell, 'py-20 md:py-24')}>
        <Heading id="president-title">كلمة الرئيسة</Heading>
        <figure className="mt-10 grid gap-8 md:grid-cols-[minmax(0,20rem)_1fr] md:items-center md:gap-14">
          <img
            src={PRESIDENT.photo}
            alt={`${PRESIDENT.name}، ${PRESIDENT.title}`}
            width={654}
            height={760}
            loading="lazy"
            className="aspect-[4/5] w-full max-w-xs rounded-2xl object-cover shadow-raised"
          />
          <div>
            <span aria-hidden className="block h-12 text-[6rem] leading-none font-bold text-green select-none">
              ”
            </span>
            <blockquote className="mt-2 max-w-[60ch] text-xl leading-[2.1] text-navy md:text-2xl md:leading-[2.1]">{PRESIDENT.quote}</blockquote>
            <figcaption className="mt-8">
              <p className="text-xl font-bold text-teal">{PRESIDENT.name}</p>
              <p className="mt-1 text-slate">{PRESIDENT.title}</p>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  )
}

/* 6. معايير القبول */
function Criteria() {
  const [stage, setStage] = useState<StageId>('ilham')
  const s = STAGE[stage]
  return (
    <section id="criteria" className="scroll-mt-20 bg-canvas" aria-labelledby="criteria-title">
      <div className={cn(shell, 'grid gap-10 py-20 md:py-24 lg:grid-cols-[1fr_1.5fr]')}>
        <div>
          <Heading id="criteria-title">معايير القبول</Heading>
          <p className="mt-8 max-w-[40ch] text-lg leading-loose text-slate">لكل مرحلة تسجيلها ومعاييرها، وتنتهي كل مرحلة بتحكيم. التسجيل مفتوح الآن لمرحلة الإلهام.</p>
          <div className="mt-6">
            <Segmented label="المرحلة" value={stage} onChange={setStage} options={STAGES.map((x) => ({ value: x.id, label: x.name }))} />
          </div>
        </div>
        <div key={stage} className="rounded-2xl bg-white p-6 shadow-card md:p-8">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xl font-bold text-navy">
            <Star className="size-5" color={s.color} />
            {s.fullName}
            <span className="tabular rounded-full px-3 py-0.5 text-sm font-medium" style={{ background: s.tint, color: s.ink }}>
              {s.teamsLabel}
            </span>
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {s.criteria.map((c) => (
              <li key={c} className="flex gap-3 text-lg text-navy">
                <Check className="mt-1.5 size-5 shrink-0" style={{ color: s.ink }} aria-hidden />
                {c}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            {s.registration.open ? (
              <>
                <p className="text-slate">
                  <span className="font-medium text-navy">التسجيل: </span>
                  {s.registration.window}
                </p>
                <ButtonLink to={`/apply?as=participant&stage=${s.registration.track}`}>
                  {s.registration.label}
                  <ArrowLeft className="size-4" aria-hidden />
                </ButtonLink>
              </>
            ) : (
              <p className="rounded-full bg-canvas px-4 py-2 font-medium text-slate">التسجيل {SOON}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* 7. الأسئلة الشائعة */
const FAQ = [
  { q: 'من يحق لها التقديم؟', a: 'أي فريق يضم طالبة أو منسوبة لجامعة الأميرة نورة، أو تكون المؤسِّسة أو الشريكة المؤسِّسة فيه امرأة. ويُسمح بوجود الرجال في الفريق.' },
  { q: 'هل أحتاج إلى فريق قبل التقديم؟', a: 'لا. يمكنك التقديم فردية، وتتشكّل الفرق في ورش مرحلة الإلهام.' },
  { q: 'متى يفتح التسجيل ومتى يغلق؟', a: 'يفتح التسجيل في الحاضنة يوم 24 ديسمبر ويغلق يوم 4 فبراير. مقابلات الفرق من 7 إلى 11 فبراير.' },
  { q: 'متى يفتح تسجيل المراحل الأخرى؟', a: 'التسجيل مفتوح الآن لمرحلة الإلهام. تسجيل تكوين وتمكين والانطلاق يُعلن قريبًا.' },
  { q: 'هل أحضر الفعاليات بلا تسجيل؟', a: 'نعم. فعاليات مرحلة الإلهام مفتوحة للجميع بلا تسجيل مسبق، والورش لمن سجّلن.' },
  { q: 'كيف يُختار المتأهلون في كل مرحلة؟', a: 'تنتهي كل مرحلة بتحكيم، وتقيّم اللجنة الفرق بمعايير معلنة مسبقًا، ثم تتأهل أعلى الفرق إلى المرحلة التالية.' },
]

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-white" aria-labelledby="faq-title">
      <div className={cn(shell, 'grid gap-10 py-20 md:py-24 lg:grid-cols-[1fr_1.6fr]')}>
        <Heading id="faq-title">الأسئلة الشائعة</Heading>
        <div className="divide-y divide-line-strong border-y border-line-strong">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-navy [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-5 shrink-0 text-blue transition-transform duration-200 group-open:rotate-45" aria-hidden />
              </summary>
              <p className="mt-3 max-w-[65ch] leading-loose text-slate">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 8. المساعدة، ثم الدعوة الأخيرة */
function Help() {
  return (
    <section id="help" className="scroll-mt-20 bg-canvas" aria-labelledby="help-title">
      <div className={cn(shell, 'flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between')}>
        <div>
          <h2 id="help-title" className="text-2xl font-bold text-navy md:text-3xl">
            تحتاجين مساعدة؟
          </h2>
          <p className="mt-2 text-lg text-slate">راسلي فريق الحاضنة، ونرد عليكِ.</p>
        </div>
        <p className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-lg font-medium text-navy shadow-card">
          <Mail className="size-5 shrink-0 text-teal" aria-hidden />
          {HELP_EMAIL ? <a href={`mailto:${HELP_EMAIL}`} dir="ltr" className="hover:underline">{HELP_EMAIL}</a> : <span className="text-slate">بريد المساعدة: يُضاف قريبًا</span>}
        </p>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="relative isolate overflow-hidden bg-[#03050a] text-white" aria-labelledby="closing-title">
      <img src={darkStars} alt="" aria-hidden width={2000} height={1125} loading="lazy" className="absolute inset-0 -z-20 size-full object-cover object-left opacity-80" />
      <div aria-hidden className="pointer-events-none absolute top-1/2 -left-44 -z-10 size-[30rem] -translate-y-1/2 md:left-[7%] md:size-[36rem]">
        <div className="orbit-a absolute inset-0 rounded-full border border-white/20">
          <Star className="absolute -top-6 left-1/2 size-12 -translate-x-1/2 text-blue" />
        </div>
        <div className="orbit-b absolute inset-[18%] rounded-full border border-white/15">
          <Star className="absolute -bottom-4 left-1/2 size-8 -translate-x-1/2 text-green" />
        </div>
        <div className="orbit-a absolute inset-[36%] rounded-full border border-white/10">
          <Star className="absolute top-1/2 -right-2.5 size-5 -translate-y-1/2 text-white" />
        </div>
      </div>
      <div className={cn(shell, 'py-24 md:py-32')}>
        <h2 id="closing-title" className="max-w-[11ch] text-[clamp(2.75rem,7.5vw,6rem)] leading-[1.2] font-bold">
          مكانك في سُدُم ينتظرك
        </h2>
        <p className="mt-5 max-w-[30ch] text-xl text-white/70 md:text-2xl">بفكرتك، أو بخبرتك.</p>
        <ButtonLink to="/apply" variant="light" size="lg" className="mt-10">
          قدّم الآن
          <ArrowLeft className="size-4" aria-hidden />
        </ButtonLink>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Partners />
      <About />
      <Goals />
      <Audience />
      <StageJourney />
      <President />
      <Criteria />
      <Faq />
      <Help />
      <Closing />
    </>
  )
}
