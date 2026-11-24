import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Star } from '@/components/brand'
import { ButtonLink } from '@/components/ui'
import { STAGES, WORKSHOPS } from '@/data/program'
import { fmtDay } from '@/lib/dates'
import PageHero from './PageHero'
import Timeline from './Timeline'

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

      <Timeline />

      {STAGES.map((s, i) => {
        const workshops = WORKSHOPS.filter((w) => w.stage === s.id)
        return (
          <section
            key={s.id}
            id={s.id}
            className={i % 2 ? 'scroll-mt-20 bg-white' : 'scroll-mt-20 bg-canvas'}
            aria-labelledby={`${s.id}-title`}
          >
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1fr_1.4fr] lg:gap-12 lg:px-10">
              <div>
                <h2 id={`${s.id}-title`} className="flex items-center gap-3 text-4xl font-bold text-navy md:text-5xl">
                  <Star className="size-8 shrink-0" color={s.color} />
                  {s.fullName}
                </h2>
                <p className="mt-3 text-lg text-slate">{s.summary}</p>
              </div>

              <div className="flex flex-col gap-4">
                <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
                  {[
                    ['المدة', `${s.weeks} ${s.weeks > 10 ? 'أسبوعًا' : 'أسابيع'}`],
                    ['العدد', s.teamsLabel],
                    [s.gate, fmtDay(s.gateDate)],
                  ].map(([k, v]) => (
                    <div key={k} className="bg-white px-4 py-4">
                      <dt className="text-xs text-slate">{k}</dt>
                      <dd className="tabular mt-1 text-lg font-bold text-navy">{v}</dd>
                    </div>
                  ))}
                </dl>

                <p className="rounded-xl px-5 py-4 text-lg font-semibold" style={{ background: s.color, color: s.on }}>
                  <span className="font-normal opacity-80">النتيجة: </span>
                  {s.outcome}
                </p>

                <details className="group rounded-xl border border-line bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3.5 font-semibold text-navy [&::-webkit-details-marker]:hidden">
                    <span>
                      الورش <span className="tabular font-normal text-slate">({workshops.length})</span>
                    </span>
                    <ChevronDown className="size-5 text-slate transition-transform duration-200 group-open:rotate-180" aria-hidden />
                  </summary>
                  <ol className="border-t border-line px-5 py-2">
                    {workshops.map((w) => (
                      <li key={w.title} className="flex items-baseline gap-4 border-b border-line py-2.5 last:border-b-0">
                        <span className="tabular w-16 shrink-0 text-sm text-slate">أسبوع {w.week}</span>
                        <span className="text-navy">{w.title}</span>
                      </li>
                    ))}
                  </ol>
                </details>
              </div>
            </div>
          </section>
        )
      })}

      <section className="bg-navy-deep text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <h2 className="text-2xl font-bold md:text-3xl">جاهزة لأول خطوة؟</h2>
          <ButtonLink to="/apply" variant="light" size="lg">
            قدّمي الآن
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
