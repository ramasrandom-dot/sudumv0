import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowLeft } from 'lucide-react'
import { Star } from '@/components/brand'
import { ButtonLink } from '@/components/ui'
import { AFTER_PROGRAM, STAGES, type Stage } from '@/data/program'
import { cn } from '@/lib/cn'
import { scrollToY } from '@/lib/SmoothScroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const TITLE = 'مسارات سُدُم'
const LAST = STAGES.length - 1
const weeksLabel = (n: number) => `${n} ${n > 10 ? 'أسبوعًا' : 'أسابيع'}`

type Pt = [number, number]
type Curve = [Pt, Pt, Pt, Pt]

/**
 * The orbit the star travels, as cubic Bézier control points in % of the pinned screen.
 * It starts on the right (the page reads right to left) and sweeps under the copy.
 */
const ORBIT: Record<'wide' | 'narrow', Curve> = {
  wide: [[88, 78], [60, 104], [28, 92], [9, 34]],
  narrow: [[84, 60], [92, 88], [40, 104], [14, 62]],
}

const pointAt = ([a, b, c, d]: Curve, t: number): Pt => {
  const u = 1 - t
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  return [0, 1].map((i) => k[0] * a[i] + k[1] * b[i] + k[2] * c[i] + k[3] * d[i]) as Pt
}

const useMedia = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
  )

/** One stage's screen: title and counter, the stage name set very large, duration and result. */
function StageCopy({ stage, index, pinned }: { stage: Stage; index: number; pinned: boolean }) {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          'tabular pointer-events-none absolute leading-none font-bold opacity-[0.08] select-none',
          pinned
            ? 'top-[26%] left-[4%] text-[34svh] md:top-auto md:bottom-[-4svh] md:left-[5%] md:text-[62svh]'
            : 'bottom-[-0.12em] left-[4%] text-[14rem] md:text-[20rem]',
        )}
      >
        {index + 1}
      </span>
      <div
        className={cn(
          'relative mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-10',
          pinned ? 'h-full pt-24 pb-10 md:pt-28' : 'py-16 md:py-20',
        )}
      >
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base font-semibold md:text-lg">
          {(pinned || index === 0) && TITLE}
          <span className="tabular rounded-full border border-current/30 px-2.5 py-0.5 text-sm" dir="ltr">
            {index + 1} / {STAGES.length}
          </span>
        </p>
        <div className={cn('journey-copy', pinned ? 'mt-[7svh] md:mt-[9svh]' : 'mt-8')}>
          <p className="text-[clamp(3.5rem,11vw,8.5rem)] leading-[1.15] font-bold">{stage.fullName}</p>
          <p className="tabular mt-3 text-xl font-semibold opacity-80 md:mt-5 md:text-2xl">
            {weeksLabel(stage.weeks)} · {stage.teamsLabel}
          </p>
          <p className="mt-1 max-w-[16ch] text-2xl leading-snug font-semibold md:mt-2 md:text-4xl">{stage.outcome}</p>
          {index === LAST && <p className="mt-4 text-lg font-semibold opacity-85 md:text-xl">ثم {AFTER_PROGRAM}</p>}
        </div>
      </div>
    </>
  )
}

/** The same content for screen readers, once, whatever the visual treatment. */
function StagesForReaders() {
  return (
    <>
      <h2 id="stages-title" className="sr-only">
        {TITLE}
      </h2>
      <ol className="sr-only">
        {STAGES.map((s) => (
          <li key={s.id}>
            {s.fullName}: {weeksLabel(s.weeks)}، {s.teamsLabel}. {s.outcome}
          </li>
        ))}
      </ol>
    </>
  )
}

/** Reduced motion: the four stages as plain colour bands, no pinning. */
function StaticStages() {
  return (
    <section aria-labelledby="stages-title">
      <StagesForReaders />
      {STAGES.map((s, i) => (
        <div key={s.id} aria-hidden className="relative overflow-hidden" style={{ background: s.color, color: s.on }}>
          <StageCopy stage={s} index={i} pinned={false} />
        </div>
      ))}
      <div className="bg-navy-deep">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
          <ButtonLink to="/program" variant="light">
            تفاصيل البرنامج
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

/**
 * The pinned journey. The screen holds still while scrolling moves the Sudum star along its
 * orbit; at each station that stage's colour floods out from the star and its copy takes over.
 */
function PinnedJourney() {
  const wide = useMedia('(min-width: 768px)')
  const curve = ORBIT[wide ? 'wide' : 'narrow']
  const stations = STAGES.map((_, i) => pointAt(curve, i / LAST))

  const root = useRef<HTMLElement>(null)
  const screen = useRef<HTMLDivElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const star = useRef<HTMLDivElement>(null)
  const goTo = useRef<(i: number) => void>(() => {})
  const [active, setActive] = useState(0)
  const [size, setSize] = useState({ w: 0, h: 0 })

  // The orbit is drawn in real pixels so its stroke and dashes stay even at any screen shape.
  useEffect(() => {
    const el = screen.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const px = ([x, y]: Pt) => `${((x * size.w) / 100).toFixed(1)} ${((y * size.h) / 100).toFixed(1)}`
  const d = `M ${px(curve[0])} C ${px(curve[1])} ${px(curve[2])} ${px(curve[3])}`

  useGSAP(
    () => {
      const panels = gsap.utils.toArray<HTMLElement>('.journey-panel')
      const copies = gsap.utils.toArray<HTMLElement>('.journey-copy')
      const travel = { t: 0 }

      const place = () => {
        const [x, y] = pointAt(curve, travel.t)
        gsap.set(star.current, { left: `${x}%`, top: `${y}%`, rotation: travel.t * 270 })
        root.current?.querySelector('.journey-trail')?.setAttribute('stroke-dashoffset', String(1 - travel.t))
      }

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: place,
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => setActive(Math.round(self.progress * LAST)),
        },
      })

      // One unit of timeline per hop: the star travels, then the next stage floods out from it.
      for (let i = 1; i <= LAST; i++) {
        const [x, y] = stations[i]
        const at = i - 1
        tl.to(travel, { t: i / LAST, duration: 0.6, ease: 'power2.inOut' }, at)
          .fromTo(
            panels[i],
            { clipPath: `circle(0% at ${x}% ${y}%)` },
            { clipPath: `circle(150% at ${x}% ${y}%)`, duration: 0.45, ease: 'power2.in' },
            at + 0.55,
          )
          .to(overlay.current, { color: STAGES[i].on, duration: 0.15 }, at + 0.55)
          .to(copies[i - 1], { y: -48, duration: 0.45 }, at + 0.55)
          .fromTo(copies[i], { y: 64 }, { y: 0, duration: 0.45, ease: 'power2.out' }, at + 0.55)
      }
      place()

      // Rest on a stage, never between two: when scrolling stops mid-hop, glide to the nearest one.
      const st = tl.scrollTrigger!
      const yFor = (progress: number) => st.start + (st.end - st.start) * progress
      const settle = () => {
        const p = st.progress
        if (!st.isActive || p <= 0.004 || p >= 0.996) return
        const nearest = Math.round(p * LAST) / LAST
        if (Math.abs(p - nearest) > 0.004) scrollToY(yFor(nearest), 0.55)
      }
      ScrollTrigger.addEventListener('scrollEnd', settle)
      goTo.current = (i) => scrollToY(yFor(i / LAST))

      return () => ScrollTrigger.removeEventListener('scrollEnd', settle)
    },
    { scope: root, dependencies: [wide], revertOnUpdate: true },
  )

  return (
    <section ref={root} aria-labelledby="stages-title" className="relative h-[310svh]">
      <StagesForReaders />
      <div ref={screen} className="sticky top-0 h-svh overflow-hidden">
        {STAGES.map((s, i) => (
          <div
            key={s.id}
            aria-hidden
            className="journey-panel absolute inset-0"
            style={{
              background: s.color,
              color: s.on,
              zIndex: i,
              clipPath: i ? `circle(0% at ${stations[i][0]}% ${stations[i][1]}%)` : undefined,
            }}
          >
            <StageCopy stage={s} index={i} pinned />
          </div>
        ))}

        <div ref={overlay} className="pointer-events-none absolute inset-0 z-10" style={{ color: STAGES[0].on }}>
          {size.w > 0 && (
            <svg viewBox={`0 0 ${size.w} ${size.h}`} className="absolute inset-0 size-full" aria-hidden focusable="false">
              <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 11" />
              <path
                className="journey-trail"
                d={d}
                pathLength={1}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="1"
                strokeDashoffset="1"
              />
            </svg>
          )}

          <nav aria-label="المراحل">
            {STAGES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo.current(i)}
                aria-label={s.fullName}
                aria-current={active === i ? 'step' : undefined}
                title={s.fullName}
                className="group pointer-events-auto absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                style={{ left: `${stations[i][0]}%`, top: `${stations[i][1]}%` }}
              >
                <span
                  className={cn(
                    'size-3 rounded-full border-2 border-current transition-transform duration-200 group-hover:scale-150',
                    i <= active && 'bg-current',
                  )}
                />
              </button>
            ))}
          </nav>

          <div
            ref={star}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${stations[0][0]}%`, top: `${stations[0][1]}%` }}
          >
            <Star className="size-12 md:size-16" />
          </div>

          <div className="absolute inset-x-0 bottom-5 md:top-[6.6rem] md:bottom-auto">
            <div className="mx-auto flex max-w-7xl justify-start px-4 sm:px-6 md:justify-end lg:px-10">
              <ButtonLink to="/program" variant="light" className="pointer-events-auto">
                تفاصيل البرنامج
                <ArrowLeft className="size-4" aria-hidden />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function StageJourney() {
  const reducedMotion = useMedia('(prefers-reduced-motion: reduce)')
  return reducedMotion ? <StaticStages /> : <PinnedJourney />
}
