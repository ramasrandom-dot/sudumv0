import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, Plus } from 'lucide-react'
import SplitText from '@/components/reactbits/SplitText/SplitText'
import CountUp from '@/components/reactbits/CountUp/CountUp'
import { Star } from '@/components/brand'
import { ButtonLink, Segmented } from '@/components/ui'
import { ENTRY_POINTS, EXPERTISE, STAGE, STAGES, WORKSHOPS } from '@/data/program'
import type { StageId } from '@/data/types'
import { fmtDay } from '@/lib/dates'
import cover from '@/assets/brand/cover-background-stars.webp'
import starsOutline from '@/assets/brand/stars-outline-transparent.png'
import Timeline from './Timeline'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STAGE_COUNTS: Record<StageId, { n: number; unit: string; note: string }> = {
  ilham: { n: 500, unit: 'مسجّلة', note: 'تتأهل منها 25 فريقًا' },
  takween: { n: 25, unit: 'فريقًا', note: 'يعبر نصفها إلى تمكين' },
  tamkeen: { n: 15, unit: 'فريقًا', note: '10 متأهلة و5 مقاعد مفتوحة' },
  sanam: { n: 8, unit: 'شركات', note: '5 متأهلة و3 مقاعد مفتوحة' },
}

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
        <p className="hero-sub mt-6 max-w-[34ch] text-xl leading-relaxed text-white/75 sm:text-2xl">
          وتتلاقى المواهب والفرص، لتولد مشاريع تصنع أثرها.
        </p>
        <p className="hero-sub mt-4 max-w-[52ch] text-white/55">
          سُدُم حاضنة مركز الابتكار وريادة الأعمال في جامعة الأميرة نورة بنت عبدالرحمن. الدفعة الأولى: يناير – ديسمبر 2027.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink to="/apply" variant="light" size="lg" className="hero-cta">
            سجّلي اهتمامك
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink to="/join" variant="outline-light" size="lg" className="hero-cta">
            انضم مرشدًا أو خبيرًا
          </ButtonLink>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-10">
        <div className="relative">
          <div className="journey-line absolute inset-x-0 top-[7px] h-px bg-linear-to-l from-blue via-green to-white/40" aria-hidden />
          <ol className="relative grid grid-cols-4 gap-x-3">
            {STAGES.map((s) => (
              <li key={s.id} className="journey-stop">
                <Star className="size-[15px]" color={s.id === 'sanam' ? '#ffffff' : s.color} />
                <p className="mt-3 text-sm font-bold sm:text-lg">{s.fullName}</p>
                <p className="hidden text-sm text-white/60 sm:block">
                  <span className="tabular">{s.weeks}</span> {s.weeks > 10 ? 'أسبوعًا' : 'أسابيع'} ·{' '}
                  <span className="tabular">{fmtDay(s.start)}</span>
                </p>
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
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-[1.3fr_1fr] lg:px-10">
        <div>
          <h2 id="meaning-title" className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.35] font-bold text-navy">
            السُّدُم سحبٌ كونية من الغاز والغبار، <span className="text-blue-ink">تولد فيها النجوم.</span>
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-5 text-lg leading-relaxed text-slate lg:pb-2">
          <p>
            اخترنا الاسم لأن السدم بيئات تتكوّن فيها النجوم، وهكذا الحاضنة: موطنٌ تتشكّل فيه المشاريع.
          </p>
          <p className="text-navy">
            سُدُم مظلة واحدة تجمع رحلة ريادة الأعمال في الجامعة من الفكرة إلى السوق، في أربع مراحل متتابعة،
            يرافقها الاحتضان وتدعمها طبقة واحدة من التوجيه والإرشاد وتطوير المنتجات.
          </p>
        </div>
      </div>
    </section>
  )
}

function EntryPoints() {
  const starts: Record<string, string> = {
    research: 'تبدأ من الإلهام، أو من تكوين لمخرج بحثي ناضج',
    student: 'تبدأ من الإلهام',
    founder: 'مقعد مفتوح في تمكين أو مسرعة سنام',
  }
  return (
    <section className="bg-white" aria-labelledby="entry-title">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="entry-title" className="text-3xl font-bold text-navy md:text-4xl">
            ثلاث نقاط دخول، ورحلة واحدة
          </h2>
          <p className="max-w-[48ch] text-slate">
            مهما كانت نقطة البداية، تمرّ كل المشاريع بالبوابات نفسها، بمعايير معلنة مسبقًا.
          </p>
        </div>
        <div className="mt-12 grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0 md:divide-x-reverse">
          {(Object.keys(ENTRY_POINTS) as (keyof typeof ENTRY_POINTS)[]).map((k) => (
            <div key={k} className="flex flex-col gap-3 py-8 md:px-8 md:first:pr-0 md:last:pl-0">
              <h3 className="text-xl font-bold text-navy">{ENTRY_POINTS[k].label}</h3>
              <p className="text-sm font-semibold text-blue-ink">{ENTRY_POINTS[k].who}</p>
              <p className="text-slate">{ENTRY_POINTS[k].detail}</p>
              <p className="mt-auto flex items-center gap-2 pt-4 text-sm text-navy">
                <Star className="size-3" color="#2086C2" />
                {starts[k]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Journey() {
  return (
    <section className="bg-canvas" aria-labelledby="journey-title">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <div className="max-w-[52ch]">
          <h2 id="journey-title" className="text-3xl font-bold text-navy md:text-4xl">
            رحلة المشروع في أربع محطات
          </h2>
          <p className="mt-3 text-lg text-slate">
            لكل محطة مدخل ومخرج وبوابة عبور معلنة مسبقًا، والاحتضان يرافق المشروع في تكوين وتمكين وسنام.
          </p>
        </div>

        <ol className="mt-14 flex flex-col">
          {STAGES.map((s) => {
            const c = STAGE_COUNTS[s.id]
            return (
              <li
                key={s.id}
                className="grid gap-6 border-t border-line-strong py-10 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,1.3fr)] md:gap-10"
              >
                <div>
                  <p className="tabular text-6xl leading-none font-bold" style={{ color: s.ink }}>
                    <CountUp to={c.n} duration={1.6} separator="," trigger="view" />
                  </p>
                  <p className="mt-2 font-semibold text-navy">{c.unit}</p>
                  <p className="text-sm text-slate">{c.note}</p>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-2xl font-bold text-navy">
                    <Star className="size-5" color={s.color} />
                    {s.fullName}
                  </h3>
                  <p className="mt-2 text-slate">
                    <span className="tabular">{s.weeks}</span> {s.weeks > 10 ? 'أسبوعًا' : 'أسابيع'} ·{' '}
                    <span className="tabular">
                      {fmtDay(s.start)} – {fmtDay(s.end)}
                    </span>
                  </p>
                  <p className="mt-3 text-sm font-semibold" style={{ color: s.ink }}>
                    {s.steps}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-navy">{s.summary}</p>
                  <p className="rounded-lg px-4 py-3 text-sm" style={{ background: s.tint, color: s.id === 'takween' ? '#0A0F3C' : s.ink }}>
                    <span className="font-bold">المخرج: </span>
                    {s.outcome}
                  </p>
                  <p className="text-sm text-slate">
                    تُختتم بـ<span className="font-semibold text-navy">{s.gate}</span> في{' '}
                    <span className="tabular">{fmtDay(s.gateDate)}</span>
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
        <div className="border-t border-line-strong pt-8">
          <ButtonLink to="/program" variant="secondary">
            تفاصيل كل مرحلة
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

function Workshops() {
  const [stage, setStage] = useState<StageId>('takween')
  const list = WORKSHOPS.filter((w) => w.stage === stage)
  const s = STAGE[stage]
  return (
    <section className="bg-canvas" aria-labelledby="workshops-title">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1fr_1.5fr] lg:px-10">
        <div>
          <h2 id="workshops-title" className="text-3xl font-bold text-navy md:text-4xl">
            <span className="tabular">23</span> ورشة على امتداد الرحلة
          </h2>
          <p className="mt-3 max-w-[40ch] text-lg text-slate">
            البناء هو العمل، والورشة خدمة مساندة. كل ورشة في أسبوعها، وتتبعها عيادات عند الحاجة.
          </p>
          <div className="mt-8">
            <Segmented
              label="المرحلة"
              value={stage}
              onChange={setStage}
              options={STAGES.map((x) => ({ value: x.id, label: x.name }))}
            />
          </div>
        </div>
        <ol className="flex flex-col" key={stage}>
          {list.map((w) => (
            <li key={w.title} className="flex items-baseline gap-5 border-b border-line py-5 first:border-t">
              <span className="w-24 shrink-0 text-sm text-slate">
                أسبوع <span className="tabular">{w.week}</span>
                <span className="block font-semibold" style={{ color: s.ink }}>
                  {w.verb}
                </span>
              </span>
              <span className="text-lg font-semibold text-navy">{w.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CallForExperts() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-white" aria-labelledby="experts-title">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1fr_1.4fr] lg:px-10">
        <div>
          <h2 id="experts-title" className="text-3xl font-bold md:text-4xl">
            خبرتك تصنع الفرق في رحلة فريق
          </h2>
          <p className="mt-4 max-w-[42ch] text-lg text-white/70">
            نرشّح مرشدين وخبراء ومحكّمين في خمسة محاور، لجلسات إرشاد أسبوعية، وورش، وعيادات، وأيام تحكيم.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/join" variant="light" size="lg">
              رشّح نفسك
            </ButtonLink>
            <ButtonLink to="/join?kind=judge" variant="outline-light" size="lg">
              انضم إلى لجان التحكيم
            </ButtonLink>
          </div>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-xl bg-white/10 sm:grid-cols-2">
          {EXPERTISE.map((a, i) => (
            <li key={a.id} className={`bg-navy-deep p-6 ${i === EXPERTISE.length - 1 ? 'sm:col-span-2' : ''}`}>
              <p className="flex items-center gap-2 font-bold">
                <Star className="size-3.5" color="#2086C2" />
                {a.title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{a.fields.slice(0, 3).join('، ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const FAQ = [
  {
    q: 'من يمكنها التقديم؟',
    a: 'طالبات الجامعة وطالبات الدراسات العليا، وعضوات هيئة التدريس والباحثات بمخرجات بحثية، ورائدات الأعمال بمنتج قائم عبر المقاعد المفتوحة.',
  },
  {
    q: 'هل أحتاج إلى فريق قبل التقديم؟',
    a: 'لا. مختبر الأفكار في مرحلة الإلهام مخصص لبناء الفرق بأدوار متكاملة وميثاق عمل.',
  },
  {
    q: 'كيف يُتخذ قرار العبور بين المراحل؟',
    a: 'لكل مرحلة بوابة عبور معلنة مسبقًا، تقيّم فيها لجنة خارجية الفرق ببطاقة تقييم موحدة، وتُعلن النتائج بعد يوم التحكيم.',
  },
  {
    q: 'ما الذي تحصل عليه الفرق خلال الاحتضان؟',
    a: 'ورش أسبوعية تطبيقية، ومرشد مرافق، وساعات مكتبية، وعيادات قانونية ومالية وتسويقية عند الحاجة، وتجربة ميدانية في تمكين.',
  },
  {
    q: 'هل تتوقف الورش في الإجازات؟',
    a: 'نعم، تتوقف خلال رمضان وإجازة عيد الفطر، وأسبوعين في إجازة عيد الأضحى، ويُستثمر الفاصل الصيفي في بناء خط المستثمرين.',
  },
]

function Faq() {
  return (
    <section className="bg-canvas" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1fr_1.6fr] lg:px-10">
        <h2 id="faq-title" className="text-3xl font-bold text-navy md:text-4xl">
          أسئلة شائعة
        </h2>
        <div className="divide-y divide-line-strong border-y border-line-strong">
          {FAQ.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {f.q}
                <Plus className="size-5 shrink-0 text-blue transition-transform duration-200 group-open:rotate-45" aria-hidden />
              </summary>
              <p className="mt-3 max-w-[65ch] text-slate">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="bg-white" aria-labelledby="cta-title">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-20 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-10">
        <div>
          <h2 id="cta-title" className="text-3xl font-bold text-navy md:text-5xl">
            فكرتك تنتظر مكانها
          </h2>
          <p className="mt-3 text-lg text-slate">سجّلي اهتمامك، ونتواصل معكِ عند فتح التسجيل في المرحلة المناسبة.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink to="/apply" size="lg">
            سجّلي اهتمامك
          </ButtonLink>
          <Link to="/login" className="inline-flex h-12 items-center px-2 font-semibold text-blue-ink underline-offset-4 hover:underline">
            أو جرّبي المنصة
          </Link>
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
      <EntryPoints />
      <Journey />
      <Timeline />
      <Workshops />
      <CallForExperts />
      <Faq />
      <FinalCta />
    </>
  )
}
