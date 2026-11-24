import { Star } from '@/components/brand'
import { PAUSES, STAGES } from '@/data/program'
import { fmtDay, fmtMonth, yearFraction } from '@/lib/dates'

const pos = (start: string, end: string) => {
  const a = yearFraction(start)
  const b = yearFraction(end)
  return { insetInlineStart: `${a * 100}%`, width: `${Math.max(b - a, 0.012) * 100}%` }
}

/** The 2027 cohort as a Gantt: stages, pauses and the four gates. */
export default function Timeline() {
  return (
    <section className="bg-white" aria-labelledby="timeline-title">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="timeline-title" className="text-3xl font-bold text-navy md:text-4xl">
            الدفعة الأولى: <span className="tabular">33</span> أسبوعًا في عام <span className="tabular">2027</span>
          </h2>
          <p className="max-w-[46ch] text-slate">
            كل بوابة عبور معلنة بتاريخها من اليوم الأول. تتوقف الورش في رمضان وإجازة عيد الأضحى.
          </p>
        </div>

        <div className="mt-12">
          <TimelineChart />
        </div>
      </div>
    </section>
  )
}

/** The Gantt itself: months, stage bars, pauses and gates. Pass `today` to mark the current date. */
export function TimelineChart({ today }: { today?: string }) {
  return (
    <div className="overflow-x-auto pb-2" tabIndex={0} aria-label="الجدول الزمني للدفعة الأولى">
          <div className="tl-chart relative min-w-[760px]">
            <div className="grid grid-cols-12 border-b border-line-strong pb-3 text-sm text-slate">
              {Array.from({ length: 12 }, (_, m) => (
                <span key={m} className="text-center">
                  {fmtMonth(m)}
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-9 bottom-0 grid grid-cols-12" aria-hidden>
              {Array.from({ length: 12 }, (_, m) => (
                <span key={m} className="border-s border-line first:border-s-0" />
              ))}
            </div>

            {today && (
              <div
                className="pointer-events-none absolute top-7 bottom-0 z-10 w-px bg-danger"
                style={{ insetInlineStart: `${yearFraction(today) * 100}%` }}
                aria-hidden
              >
                <span className="absolute -top-1 -translate-x-1/2 rounded-full bg-danger px-2 py-0.5 text-[0.7rem] font-semibold whitespace-nowrap text-white rtl:translate-x-1/2">
                  اليوم
                </span>
              </div>
            )}
            <ul className="relative flex flex-col gap-3 pt-5">
              {STAGES.map((s) => (
                <li key={s.id} className="relative h-11">
                  <div
                    className="tl-bar absolute inset-y-0 flex items-center overflow-hidden rounded-lg px-3 text-sm font-semibold whitespace-nowrap"
                    style={{ ...pos(s.start, s.end), background: s.color, color: s.on }}
                  >
                    {s.fullName}
                  </div>
                </li>
              ))}
              <li className="relative h-9">
                {PAUSES.map((p) => (
                  <div
                    key={p.label}
                    className="tl-bar absolute inset-y-0 flex items-center overflow-hidden rounded-lg px-3 text-xs font-medium whitespace-nowrap text-navy"
                    style={{ ...pos(p.start, p.end), background: p.color }}
                    title={p.title}
                  >
                    {p.label}
                  </div>
                ))}
              </li>
            </ul>

            <div className="relative mt-6 h-20 border-t border-dashed border-line-strong">
              {STAGES.map((s) => (
                <div
                  key={s.id}
                  className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1 pt-2 text-center rtl:translate-x-1/2"
                  style={{ insetInlineStart: `${yearFraction(s.gateDate) * 100}%` }}
                >
                  <Star className="tl-gate size-5" color={s.color} />
                  <span className="text-xs font-semibold whitespace-nowrap text-navy">{s.gate}</span>
                  <span className="tabular text-xs text-slate">{fmtDay(s.gateDate)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}
