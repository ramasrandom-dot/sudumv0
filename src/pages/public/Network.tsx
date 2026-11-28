import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowLeft } from 'lucide-react'
import { ButtonLink } from '@/components/ui'
import { EXPERTISE, ROLE_COLOR } from '@/data/program'
import type { NominationKind } from '@/data/types'
import { cn } from '@/lib/cn'
import PageHero from './PageHero'
import ProfileCard, { type Profile } from './ProfileCard'

gsap.registerPlugin(useGSAP)

const KINDS: NominationKind[] = ['mentor', 'expert', 'judge']

const KIND: Record<NominationKind, { tab: string; name: string; does: string }> = {
  mentor: { tab: 'المرشدون', name: 'اسم المرشد/ة', does: 'يرافقون الفرق بجلسة أسبوعية.' },
  expert: { tab: 'الخبراء', name: 'اسم الخبير/ة', does: 'يقدّمون الورش والاستشارات.' },
  judge: { tab: 'المحكّمون', name: 'اسم المحكّم/ة', does: 'يقيّمون الفرق في نهاية كل مرحلة.' },
}

/**
 * Placeholder profiles. Real names, photos and bios replace these when the network is
 * confirmed; nothing here stands for a real person.
 */
const SLOTS: Record<NominationKind, number> = { mentor: 10, expert: 10, judge: 5 }
const placeholders = (kind: NominationKind) =>
  Array.from({ length: SLOTS[kind] }, (_, i) => {
    const area = EXPERTISE[i % EXPERTISE.length]
    const profile: Profile = {
      name: KIND[kind].name,
      title: 'المسمى الوظيفي',
      org: 'الجهة',
      areas: [area.fields[(i * 2 + KINDS.indexOf(kind)) % area.fields.length]],
      bio: 'نبذة قصيرة عن الخبرة، تُكتب من بيانات التسجيل.',
    }
    return { id: `${kind}-${i}`, area: area.id, profile }
  })

export default function Network() {
  const [kind, setKind] = useState<NominationKind>('mentor')
  const [area, setArea] = useState<string>('all')
  const grid = useRef<HTMLUListElement>(null)
  const list = placeholders(kind).filter((p) => area === 'all' || p.area === area)
  const tone = ROLE_COLOR[kind]

  // Cards settle in one after another whenever the selection changes.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.profile-card', { y: 28, opacity: 0, duration: 0.55, ease: 'power3.out', stagger: 0.045 })
      })
    },
    { scope: grid, dependencies: [kind, area] },
  )

  return (
    <>
      <PageHero title="المرشدون والخبراء والمحكّمون" lede="من يرافق الفرق في رحلتها. لكل فئة لونها." />

      <section className="bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-10">
          <div role="tablist" aria-label="الفئة" className="grid gap-3 sm:grid-cols-3">
            {KINDS.map((k) => {
              const on = k === kind
              const c = ROLE_COLOR[k]
              return (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setKind(k)}
                  className={cn('rounded-2xl border-2 p-4 text-start transition-colors duration-200', on ? 'border-transparent shadow-raised' : 'bg-white hover:bg-canvas')}
                  style={on ? { background: c.color, color: c.on } : { borderColor: c.color, color: c.ink }}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-xl font-bold">{KIND[k].tab}</span>
                    <span className="tabular text-sm opacity-80">{SLOTS[k]}</span>
                  </span>
                  <span className={cn('mt-1 block text-sm', on ? 'opacity-90' : 'text-slate')}>{KIND[k].does}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div role="group" aria-label="المجال" className="flex flex-wrap gap-2">
              {[{ id: 'all', title: 'كل المجالات' }, ...EXPERTISE].map((a) => {
                const on = area === a.id
                return (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setArea(a.id)}
                    className={cn(
                      'inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors duration-150',
                      on ? 'border-transparent' : 'border-line-strong bg-white text-navy hover:border-navy/40',
                    )}
                    style={on ? { background: tone.color, color: tone.on } : undefined}
                  >
                    {a.title}
                  </button>
                )
              })}
            </div>
            <p className="rounded-full border border-dashed border-line-strong px-4 py-1.5 text-sm text-slate">ملفات مؤقتة حتى تُضاف الأسماء والصور</p>
          </div>

          <ul ref={grid} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {list.map((p) => (
              <li key={p.id} className="profile-card transition-[translate] duration-300 hover:-translate-y-1.5">
                <ProfileCard kind={kind} profile={p.profile} muted />
              </li>
            ))}
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
