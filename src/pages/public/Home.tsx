import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowLeft } from 'lucide-react'
import SplitText from '@/components/reactbits/SplitText/SplitText'
import { Star } from '@/components/brand'
import { ButtonLink } from '@/components/ui'
import { ENTRY_POINTS, STAGES } from '@/data/program'
import type { EntryPoint } from '@/data/types'
import cover from '@/assets/brand/cover-background-stars.webp'
import darkStars from '@/assets/brand/dark-background-stars-2.webp'
import Partners from './Partners'
import StageJourney from './StageJourney'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* What is it? */
function Hero() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
        tl.from('.hero-sub', { y: 16, opacity: 0, filter: 'blur(6px)', duration: 1.1 }, 0.55)
          .from('.hero-cta', { y: 12, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.75)
          .from('.journey-line', { scaleX: 0, transformOrigin: 'right center', duration: 1.6, ease: 'power3.inOut' }, 0.9)
          .from('.journey-stop', { y: 10, opacity: 0, duration: 0.8, stagger: 0.14 }, 1.1)
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#03050a] text-white"
      aria-labelledby="hero-title"
    >
      <img
        src={cover}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-10 size-full object-cover object-left"
        width={2000}
        height={1125}
        fetchPriority="high"
      />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-10 pt-32 sm:px-6 lg:px-10">
        <h1 id="hero-title" className="max-w-[14ch] text-[clamp(2.75rem,8vw,6rem)] leading-[1.15] font-bold tracking-[-0.01em]">
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

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-10" aria-hidden>
        <div className="relative">
          <div className="journey-line absolute inset-x-0 top-[7px] h-px bg-linear-to-l from-blue via-green to-white/40" />
          <ol className="relative grid grid-cols-4 gap-x-3">
            {STAGES.map((s) => (
              <li key={s.id} className="journey-stop">
                <Star className="size-[15px]" color={s.id === 'sanam' ? '#ffffff' : s.color} />
                <p className="mt-3 text-sm font-bold sm:text-lg">{s.fullName}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* Who is it for? Three words set very large; each lights up in its own colour as it crosses the screen. */
const AUDIENCE_TONE: Record<EntryPoint, { color: string; on: string }> = {
  student: { color: '#2086C2', on: '#FFFFFF' },
  research: { color: '#39B67E', on: '#0A0F3C' },
  founder: { color: '#00535C', on: '#FFFFFF' },
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
    <section ref={root} className="bg-canvas" aria-labelledby="audience-title">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 md:pt-20 lg:px-10">
        <h2 id="audience-title" className="text-3xl font-bold text-navy md:text-4xl">
          لمن سُدُم؟
        </h2>
      </div>
      <ul className="mt-8 border-t border-line-strong">
        {(Object.keys(ENTRY_POINTS) as EntryPoint[]).map((k) => {
          const tone = AUDIENCE_TONE[k]
          return (
            <li
              key={k}
              className="aud-row relative isolate overflow-hidden border-b border-line-strong"
              style={{ '--tone': tone.color, '--on': tone.on } as React.CSSProperties}
            >
              <span aria-hidden className="aud-fill absolute inset-0 -z-10" />
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-10 gap-y-0.5 px-4 py-4 sm:px-6 md:py-5 lg:px-10">
                <h3 className="aud-ink flex items-center gap-[0.3em] text-[clamp(1.875rem,4.4vw,3.25rem)] leading-[1.25] font-bold text-navy">
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

/* How do I start? One invitation, one button, and the star keeps circling. */
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
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-36 lg:px-10">
        <h2 id="closing-title" className="max-w-[11ch] text-[clamp(2.75rem,7.5vw,6rem)] leading-[1.15] font-bold">
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
      <StageJourney />
      <Audience />
      <Closing />
    </>
  )
}
