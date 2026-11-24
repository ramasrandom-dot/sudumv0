import { ArrowLeft } from 'lucide-react'
import { Star } from '@/components/brand'
import { ButtonLink } from '@/components/ui'
import { STAGES, WORKSHOPS } from '@/data/program'
import { fmtDay } from '@/lib/dates'
import PageHero from './PageHero'

export default function Program() {
  return (
    <>
      <PageHero
        title="من الفكرة إلى السوق في أربع محطات"
        lede="لكل مرحلة مدخل ومخرج وبوابة عبور معلنة مسبقًا. الاحتضان مشمول في تكوين وتمكين وسنام، ويرافق كل فريق مرشد طوال رحلته."
      >
        <nav aria-label="المراحل" className="mt-10 flex flex-wrap gap-2">
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

      {STAGES.map((s, i) => {
        const workshops = WORKSHOPS.filter((w) => w.stage === s.id)
        return (
          <section
            key={s.id}
            id={s.id}
            className={i % 2 ? 'scroll-mt-20 bg-white' : 'scroll-mt-20 bg-canvas'}
            aria-labelledby={`${s.id}-title`}
          >
            <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-10">
              <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr]">
                <div>
                  <h2 id={`${s.id}-title`} className="flex items-center gap-3 text-4xl font-bold text-navy md:text-5xl">
                    <Star className="size-8 shrink-0" color={s.color} />
                    {s.fullName}
                  </h2>
                  <p className="mt-4 max-w-[46ch] text-lg text-slate">{s.summary}</p>

                  <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line">
                    {[
                      ['المدة', `${s.weeks} ${s.weeks > 10 ? 'أسبوعًا' : 'أسابيع'}`],
                      [s.id === 'ilham' ? 'المشاركة' : 'الفرق', s.teamsLabel.split(' · ')[0]],
                      ['البوابة', fmtDay(s.gateDate)],
                    ].map(([k, v]) => (
                      <div key={k} className="bg-white px-4 py-4">
                        <dt className="text-xs text-slate">{k}</dt>
                        <dd className="tabular mt-1 text-lg font-bold text-navy">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-3 text-sm text-slate">
                    {s.teamsLabel} · <span className="tabular">{fmtDay(s.start)} – {fmtDay(s.end)} 2027</span>
                  </p>
                </div>

                <div className="flex flex-col gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-navy">ماذا تقدّم المرحلة</h3>
                    <ul className="mt-4 flex flex-col gap-3">
                      {s.offers.map((o) => (
                        <li key={o} className="flex gap-3 text-navy">
                          <Star className="mt-1.5 size-3.5 shrink-0" color={s.color} />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-navy">الورش</h3>
                    <p className="mt-1 text-sm font-semibold" style={{ color: s.ink }}>
                      {s.steps}
                    </p>
                    <ol className="mt-3 flex flex-col">
                      {workshops.map((w) => (
                        <li key={w.title} className="flex items-baseline gap-4 border-b border-line py-3 first:border-t">
                          <span className="tabular w-16 shrink-0 text-sm text-slate">أسبوع {w.week}</span>
                          <span className="font-medium text-navy">{w.title}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-xl px-5 py-4" style={{ background: s.color, color: s.on }}>
                    <p className="text-sm font-semibold opacity-80">المخرج</p>
                    <p className="mt-1 text-lg font-semibold leading-relaxed">{s.outcome}</p>
                    <p className="mt-2 text-sm opacity-80">
                      يُختتم بـ{s.gate} في <span className="tabular">{fmtDay(s.gateDate)} 2027</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <section className="bg-navy-deep text-white" id="workshops">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">جاهزة لأول خطوة؟</h2>
            <p className="mt-2 text-white/70">اختاري المسار المناسب لمرحلتك، ونتواصل معكِ.</p>
          </div>
          <ButtonLink to="/apply" variant="light" size="lg">
            سجّلي اهتمامك
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
