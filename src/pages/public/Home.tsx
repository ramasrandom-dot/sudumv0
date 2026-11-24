import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowLeft } from 'lucide-react'
import SplitText from '@/components/reactbits/SplitText/SplitText'
import { Star } from '@/components/brand'
import { ButtonLink } from '@/components/ui'
import { ENTRY_POINTS, STAGES } from '@/data/program'
import type { EntryPoint } from '@/data/types'
import cover from '@/assets/brand/cover-background-stars.webp'
import starsOutline from '@/assets/brand/stars-outline-transparent.png'

gsap.registerPlugin(useGSAP)

const weeksLabel = (n: number) => `${n} ${n > 10 ? 'أسبوعًا' : 'أسابيع'}`

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
            text="هنا تتشكّل الأفكار"
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
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/apply" variant="light" size="lg" className="hero-cta">
            قدّمي الآن
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink to="/join" variant="outline-light" size="lg" className="hero-cta">
            انضم مرشدًا أو خبيرًا
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

function Meaning() {
  return (
    <section className="relative overflow-hidden bg-canvas" aria-labelledby="meaning-title">
      <img
        src={starsOutline}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-full w-auto max-w-none opacity-60"
        width={2000}
        height={1125}
        loading="lazy"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <h2 id="meaning-title" className="max-w-[20ch] text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.35] font-bold text-navy">
          السُّدُم سحبٌ كونية <span className="text-blue-ink">تولد فيها النجوم.</span>
        </h2>
      </div>
    </section>
  )
}

/* How does it work? */
function Stages() {
  return (
    <section className="bg-white" aria-labelledby="stages-title">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-10">
        <h2 id="stages-title" className="text-3xl font-bold text-navy md:text-4xl">
          أربع مراحل من الفكرة إلى الشركة
        </h2>
        <ol className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((s) => (
            <li key={s.id} className="flex flex-col gap-3">
              <span className="h-1.5 rounded-full" style={{ background: s.color }} aria-hidden />
              <h3 className="mt-2 flex items-center gap-2 text-2xl font-bold text-navy">
                <Star className="size-5 shrink-0" color={s.color} />
                {s.fullName}
              </h3>
              <p className="tabular text-sm font-semibold" style={{ color: s.ink }}>
                {weeksLabel(s.weeks)}
              </p>
              <p className="text-lg text-navy">{s.outcome}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <ButtonLink to="/program" variant="secondary">
            تفاصيل البرنامج
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

/* Who is it for? */
function Audience() {
  return (
    <section className="bg-canvas" aria-labelledby="audience-title">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-10">
        <h2 id="audience-title" className="text-3xl font-bold text-navy md:text-4xl">
          لمن سُدُم؟
        </h2>
        <ul className="mt-10 grid divide-y divide-line-strong border-y border-line-strong md:grid-cols-3 md:divide-x md:divide-y-0">
          {(Object.keys(ENTRY_POINTS) as EntryPoint[]).map((k) => (
            <li key={k} className="py-7 md:px-8 md:first:pr-0 md:last:pl-0">
              <h3 className="text-xl font-bold text-navy">{ENTRY_POINTS[k].label}</h3>
              <p className="mt-1 text-slate">{ENTRY_POINTS[k].detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* How do I start? */
function Closing() {
  return (
    <section className="bg-navy-deep text-white" aria-labelledby="closing-title">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.4fr_1fr] md:items-end md:py-24 lg:px-10">
        <div>
          <h2 id="closing-title" className="text-4xl font-bold md:text-5xl">
            فكرتك تنتظر مكانها
          </h2>
          <ButtonLink to="/apply" variant="light" size="lg" className="mt-8">
            قدّمي الآن
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
        </div>
        <div className="border-t border-white/15 pt-8 md:border-t-0 md:border-s md:ps-10 md:pt-0">
          <h3 className="text-xl font-bold">مرشد أو خبير أو محكّم؟</h3>
          <p className="mt-1 text-white/70">شارك خبرتك مع الفرق.</p>
          <ButtonLink to="/join" variant="outline-light" className="mt-5">
            انضم إلينا
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Meaning />
      <Stages />
      <Audience />
      <Closing />
    </>
  )
}
