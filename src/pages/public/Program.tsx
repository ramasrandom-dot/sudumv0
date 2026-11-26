import { ArrowLeft } from 'lucide-react'
import { Star } from '@/components/brand'
import { ButtonLink } from '@/components/ui'
import { STAGES, WORKSHOPS } from '@/data/program'
import { fmtDay } from '@/lib/dates'
import { cn } from '@/lib/cn'
import PageHero from './PageHero'
import Timeline from './Timeline'

/**
 * The program as four chapters. Each stage is a full screen in its own colour with a ghost
 * numeral behind it; on desktop a chapter holds the screen while the next slides over it.
 */
export default function Program() {
  return (
    <>
      <PageHero title="برنامج سُدُم" lede="أربع مراحل في عام 2027.">
        <nav aria-label="المراحل" className="mt-8 flex flex-wrap gap-2">
          {STAGES.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:border-white/50 hover:text-white"
            >
              <Star className="size-3" color={s.id === 'sanam' ? '#fff' : s.color} />
              {s.fullName}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="relative bg-[#03050a]">
        {STAGES.map((s, i) => {
          const workshops = WORKSHOPS.filter((w) => w.stage === s.id)
          const [count, ...unit] = s.teamsLabel.split(' ')
          const facts = [
            { value: String(s.weeks), label: s.weeks > 10 ? 'أسبوعًا' : 'أسابيع' },
            { value: count, label: unit.join(' ') },
            { value: fmtDay(s.gateDate), label: s.gate },
          ]
          return (
            <div key={s.id} className="contents">
              {/* A plain anchor: a held (sticky) chapter cannot be scrolled to directly. */}
              <div id={s.id} aria-hidden className="h-0" />
              <section
                aria-labelledby={`${s.id}-title`}
                className={cn(
                  'chapter relative isolate flex flex-col justify-center overflow-hidden',
                  i > 0 && 'rounded-t-[2rem] shadow-[0_-24px_60px_rgb(0_0_0/0.28)] md:rounded-t-[3rem]',
                )}
                style={{ background: s.color, color: s.on }}
              >
                <span
                  aria-hidden
                  className="tabular pointer-events-none absolute top-4 left-[4%] -z-10 text-[9rem] leading-none font-bold opacity-[0.08] select-none lg:top-auto lg:bottom-[-5svh] lg:text-[58svh]"
                >
                  {s.index}
                </span>

                <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-14 lg:px-10 lg:pt-28 lg:pb-16">
                  <div>
                    <h2 id={`${s.id}-title`} className="text-[clamp(3.5rem,10vw,8rem)] leading-[1.1] font-bold">
                      {s.fullName}
                    </h2>
                    <p className="mt-3 text-xl opacity-85 md:text-2xl">{s.summary}</p>
                    <p className="mt-8 flex items-start gap-3 text-2xl leading-snug font-semibold md:text-3xl">
                      <Star className="mt-2 size-5 shrink-0" />
                      <span>
                        <span className="font-normal opacity-80">النتيجة: </span>
                        {s.outcome}
                      </span>
                    </p>
                  </div>

                  <div>
                    <ul className="grid grid-cols-3 gap-2 md:gap-3">
                      {facts.map((f) => (
                        <li key={f.label} className="rounded-2xl bg-black/15 p-4 md:p-5">
                          <p className="tabular text-xl leading-tight font-bold whitespace-nowrap md:text-3xl">{f.value}</p>
                          <p className="mt-1.5 text-sm opacity-85 md:text-base">{f.label}</p>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-8 text-sm font-semibold opacity-80">
                      الورش · <span className="tabular">{workshops.length}</span>
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {workshops.map((w) => (
                        <li key={w.title} className="rounded-full bg-black/15 px-4 py-2 text-sm font-medium md:text-base">
                          {w.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>
          )
        })}
      </div>

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
