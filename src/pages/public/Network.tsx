import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowLeft } from 'lucide-react'
import { Star } from '@/components/brand'
import { ButtonLink, Segmented } from '@/components/ui'
import { EXPERTISE, STAGES } from '@/data/program'
import { cn } from '@/lib/cn'
import PageHero from './PageHero'

gsap.registerPlugin(useGSAP)

type Kind = 'mentor' | 'expert'

const KIND: Record<Kind, { tab: string; name: string }> = {
  mentor: { tab: 'المرشدون', name: 'اسم المرشد/ة' },
  expert: { tab: 'الخبراء', name: 'اسم الخبير/ة' },
}

/** Each expertise area borrows one stage colour, so a card's colour says its area at a glance. */
const toneFor = (areaIndex: number) => STAGES[areaIndex % STAGES.length]

/**
 * Placeholder profiles. Real names, photos and bios replace these when the network is
 * confirmed; nothing here stands for a real person.
 */
const SLOTS: Record<Kind, number> = { mentor: 10, expert: 10 }
const placeholders = (kind: Kind) =>
  Array.from({ length: SLOTS[kind] }, (_, i) => {
    const areaIndex = i % EXPERTISE.length
    const area = EXPERTISE[areaIndex]
    return { id: `${kind}-${i}`, areaIndex, area, field: area.fields[(i * 2 + (kind === 'expert' ? 1 : 0)) % area.fields.length] }
  })

export default function Network() {
  const [kind, setKind] = useState<Kind>('mentor')
  const [area, setArea] = useState<string>('all')
  const grid = useRef<HTMLUListElement>(null)
  const list = placeholders(kind).filter((p) => area === 'all' || p.area.id === area)

  // Cards settle in one after another whenever the selection changes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.profile-card', { y: 28, opacity: 0, rotate: -2, duration: 0.55, ease: 'power3.out', stagger: 0.045 })
      })
    },
    { scope: grid, dependencies: [kind, area] },
  )

  return (
    <>
      <PageHero title="المرشدون والخبراء" lede="من يرافق الفرق في رحلتها." />

      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Segmented
              label="الفئة"
              value={kind}
              onChange={setKind}
              options={(Object.keys(KIND) as Kind[]).map((k) => ({ value: k, label: KIND[k].tab, count: SLOTS[k] }))}
            />
            <p className="rounded-full border border-dashed border-line-strong px-4 py-1.5 text-sm text-slate">ملفات مؤقتة حتى تُضاف الأسماء والصور</p>
          </div>

          <div role="group" aria-label="المجال" className="mt-5 flex flex-wrap gap-2">
            {[{ id: 'all', title: 'كل المجالات' }, ...EXPERTISE].map((a, i) => {
              const on = area === a.id
              const tone = i === 0 ? undefined : toneFor(i - 1)
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setArea(a.id)}
                  className={cn(
                    'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-150',
                    on ? 'border-transparent' : 'border-line-strong bg-white text-navy hover:border-navy/40',
                  )}
                  style={on ? { background: tone?.color ?? '#0A0F3C', color: tone?.on ?? '#fff' } : undefined}
                >
                  {tone && <Star className="size-3" color={on ? tone.on : tone.color} />}
                  {a.title}
                </button>
              )
            })}
          </div>

          <ul ref={grid} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((p) => {
              const tone = toneFor(p.areaIndex)
              return (
                <li
                  key={p.id}
                  className="profile-card group overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-raised"
                >
                  <div className="relative h-24 overflow-hidden" style={{ background: tone.color, color: tone.on }} aria-hidden>
                    <Star outline strokeWidth={1.5} className="absolute -top-8 -left-6 size-36 opacity-40 transition-transform duration-700 ease-out group-hover:rotate-45" />
                    <Star className="absolute right-5 bottom-4 size-4 opacity-70" />
                  </div>
                  <div className="-mt-10 flex flex-col items-center px-5 pb-6 text-center">
                    <span
                      aria-hidden
                      className="relative grid size-20 place-items-center rounded-full border-4 border-white"
                      style={{ background: tone.tint, color: tone.ink }}
                    >
                      <Star className="size-8 transition-transform duration-700 ease-out group-hover:rotate-90" />
                    </span>
                    <p className="mt-3 text-lg font-bold text-navy">{KIND[kind].name}</p>
                    <p className="text-sm font-semibold" style={{ color: tone.ink }}>
                      {p.area.title}
                    </p>
                    <p className="mt-2 text-sm text-slate">{p.field}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="bg-navy-deep text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <h2 className="text-2xl font-bold md:text-3xl">مكانك بينهم؟</h2>
          <ButtonLink to="/apply" variant="light" size="lg">
            قدّم الآن
            <ArrowLeft className="size-4" aria-hidden />
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
