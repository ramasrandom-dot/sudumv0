import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, Check, GraduationCap } from 'lucide-react'
import { Star } from '@/components/brand'
import { ButtonLink } from '@/components/ui'
import { AFTER_PROGRAM, STAGE, STAGES, SOON, STAGE_PARTNER_SLOTS, WORKSHOPS } from '@/data/program'
import type { StageId } from '@/data/types'
import { fmtDay } from '@/lib/dates'
import { cn } from '@/lib/cn'
import PageHero from './PageHero'
import Timeline from './Timeline'

gsap.registerPlugin(useGSAP)

/**
 * The whole program on one screen: four stages on a single line, then graduation.
 * Picking a stage floods the panel below with that stage's colour and shows its details.
 */
function StageExplorer() {
  const root = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<StageId>(STAGES[0].id)
  // The stage shown before this one: its colour stays underneath while the new one floods in.
  const [from, setFrom] = useState<StageId>(STAGES[0].id)

  const stage = STAGE[active]
  const workshops = WORKSHOPS.filter((w) => w.stage === active)
  const next = STAGES[stage.index]
  const [count, ...unit] = stage.teamsLabel.split(' ')
  const facts = [
    { value: String(stage.weeks), label: stage.weeks > 10 ? 'أسبوعًا' : 'أسابيع' },
    { value: count, label: unit.join(' ') },
    { value: fmtDay(stage.gateDate), label: stage.gate },
  ]

  const select = (id: StageId) => {
    if (id === active) return
    setFrom(active)
    setActive(id)
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const panel = root.current?.querySelector<HTMLElement>('.stage-flood')
        const tab = root.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
        if (!panel || !tab) return
        const p = panel.getBoundingClientRect()
        const t = tab.getBoundingClientRect()
        const x = ((t.left + t.width / 2 - p.left) / p.width) * 100
        gsap.fromTo(
          panel,
          { clipPath: `circle(0% at ${x}% 0%)` },
          { clipPath: `circle(160% at ${x}% 0%)`, duration: 0.9, ease: 'power2.inOut', clearProps: 'clipPath' },
        )
        gsap.from('.stage-rise', { y: 26, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07, delay: 0.2 })
      })
    },
    { scope: root, dependencies: [active] },
  )

  return (
    <div ref={root} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-10">
      <div className="relative">
        <span aria-hidden className="absolute inset-x-[12.5%] top-7 h-px bg-line-strong md:inset-x-[10%]" />
        <div role="tablist" aria-label="المراحل" className="relative grid grid-cols-4 md:grid-cols-5">
          {STAGES.map((s, i) => {
            const selected = s.id === active
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={selected}
                aria-controls="stage-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => select(s.id)}
                onKeyDown={(e) => {
                  // The line reads right to left, so the left arrow moves forward.
                  const step = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0
                  const target = STAGES[i + step]
                  if (!step || !target) return
                  e.preventDefault()
                  select(target.id)
                  document.getElementById(`tab-${target.id}`)?.focus()
                }}
                className="group flex flex-col items-center gap-2 rounded-xl pb-1 text-center"
              >
                <span
                  className={cn(
                    'grid size-14 place-items-center rounded-full border-2 transition-[scale,background-color,border-color,color] duration-300 ease-[var(--ease-out-expo)]',
                    selected ? 'scale-100 border-transparent shadow-raised' : 'scale-[0.72] bg-white group-hover:scale-[0.84]',
                  )}
                  style={selected ? { background: s.color, color: s.on } : { borderColor: s.color, color: s.ink }}
                >
                  <Star className="size-6" />
                </span>
                <span className={cn('text-sm font-bold transition-colors md:text-lg', selected ? 'text-navy' : 'text-slate group-hover:text-navy')}>{s.fullName}</span>
                <span className="tabular hidden text-sm text-slate md:block">{fmtDay(s.start)}</span>
              </button>
            )
          })}
          <div className="hidden flex-col items-center gap-2 text-center md:flex">
            <span className="grid size-14 scale-[0.72] place-items-center rounded-full border-2 border-dashed border-line-strong bg-white text-slate">
              <GraduationCap className="size-6" aria-hidden />
            </span>
            <span className="text-lg font-bold text-slate">{AFTER_PROGRAM}</span>
            <span className="text-sm text-slate">بعد الانطلاق</span>
          </div>
        </div>
      </div>

      <div
        id="stage-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="relative mt-8 overflow-hidden rounded-3xl shadow-raised"
        style={{ background: STAGE[from].color }}
      >
        <div key={active} className="stage-flood relative isolate overflow-hidden" style={{ background: stage.color, color: stage.on }}>
          <span
            aria-hidden
            className="tabular pointer-events-none absolute top-[-0.12em] left-[3%] -z-10 text-[13rem] leading-none font-bold opacity-[0.08] select-none md:text-[22rem]"
          >
            {stage.index}
          </span>

          <div className="grid gap-10 p-6 md:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:p-14">
            <div>
              <h2 className="stage-rise text-[clamp(3rem,7vw,5.5rem)] leading-[1.15] font-bold">{stage.fullName}</h2>
              <p className="stage-rise mt-2 text-xl opacity-85 md:text-2xl">{stage.summary}</p>
              <p className="stage-rise mt-7 flex items-start gap-3 text-2xl leading-snug font-semibold md:text-3xl">
                <Star className="mt-2 size-5 shrink-0" />
                <span>
                  <span className="font-normal opacity-80">النتيجة: </span>
                  {stage.outcome}
                </span>
              </p>
              <ul className="stage-rise mt-8 grid grid-cols-3 gap-2 md:gap-3">
                {facts.map((f) => (
                  <li key={f.label} className="rounded-2xl bg-black/15 p-3.5 md:p-4">
                    <p className="tabular text-xl leading-tight font-bold whitespace-nowrap md:text-3xl">{f.value}</p>
                    <p className="mt-1 text-sm opacity-85">{f.label}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="stage-rise flex flex-col">
              <h3 className="text-lg font-bold">
                {active === 'ilham' ? 'الفعاليات والورش' : 'الورش'} <span className="tabular text-base font-normal opacity-75">({workshops.length})</span>
              </h3>
              <ol className="mt-3 flex flex-col">
                {workshops.map((w) => (
                  <li key={w.title} className="flex items-baseline gap-4 border-b border-current/15 py-3 last:border-b-0">
                    <span className="tabular w-[4.5rem] shrink-0 text-sm opacity-75">أسبوع {w.week}</span>
                    <span className="text-lg font-semibold">{w.title}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="stage-rise grid gap-8 border-t border-current/15 p-6 md:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:px-14">
            <div>
              <h3 className="text-lg font-bold">معايير القبول</h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {stage.criteria.map((c) => (
                  <li key={c} className="flex gap-3 text-lg">
                    <Check className="mt-1.5 size-5 shrink-0 opacity-80" aria-hidden />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">شركاء المرحلة</h3>
              <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {Array.from({ length: STAGE_PARTNER_SLOTS }, (_, i) => (
                  <li key={i} className="grid h-16 place-items-center rounded-xl border border-dashed border-current/40 text-sm opacity-80">
                    شريك {i + 1}
                  </li>
                ))}
                <li className="grid h-16 place-items-center rounded-xl bg-black/15 px-2 text-center text-sm font-medium">شريك الخريجين</li>
              </ul>
              <p className="mt-2 text-sm opacity-75">تُعلن أسماء الشركاء قريبًا.</p>
            </div>
          </div>

          <div className="stage-rise flex flex-wrap items-center justify-between gap-4 border-t border-current/15 p-6 md:px-10 lg:px-14">
            <div>
              <p className="text-sm opacity-75">التسجيل في هذه المرحلة</p>
              <p className="mt-0.5 text-lg font-semibold">{stage.registration.open ? stage.registration.window : SOON}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {stage.registration.open ? (
                <ButtonLink to={`/apply?as=participant&stage=${stage.registration.track}`} variant="light" size="lg">
                  {stage.registration.label}
                  <ArrowLeft className="size-4" aria-hidden />
                </ButtonLink>
              ) : (
                <p className="inline-flex h-12 items-center rounded-xl border border-dashed border-current/50 px-5 font-semibold">التسجيل {SOON}</p>
              )}
              {next ? (
                <button
                  type="button"
                  onClick={() => select(next.id)}
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-black/15 px-5 font-semibold transition-transform duration-200 hover:-translate-x-1"
                >
                  التالي: {next.fullName}
                  <ArrowLeft className="size-4" aria-hidden />
                </button>
              ) : (
                <p className="inline-flex h-12 items-center gap-2 rounded-xl bg-black/15 px-5 font-semibold">
                  <GraduationCap className="size-5" aria-hidden />
                  بعد الانطلاق: {AFTER_PROGRAM}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Program() {
  return (
    <>
      <PageHero title="مراحل سُدُم" lede="أربع مراحل، ولكل مرحلة تسجيلها وتحكيمها، ثم التخرّج." />
      <section className="bg-canvas" aria-label="مراحل البرنامج">
        <StageExplorer />
      </section>
      <Timeline />
      <section className="bg-navy-deep text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <h2 className="text-2xl font-bold md:text-3xl">أول خطوة تبدأ من هنا</h2>
          <ButtonLink to="/apply" variant="light" size="lg">
            قدّم الآن
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
