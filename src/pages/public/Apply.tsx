import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Gavel, MessagesSquare, Presentation, Rocket, type LucideIcon } from 'lucide-react'
import { Star } from '@/components/brand'
import { ROLE_COLOR, SOON, STAGE, TRACKS } from '@/data/program'
import type { NominationKind, Track } from '@/data/types'
import cover from '@/assets/brand/cover-background-stars.webp'
import JoinForm from './JoinForm'
import PageHero from './PageHero'
import StageApplication from './StageApplication'

/* ───────────── Which stage? Each one has its own registration. ───────────── */

const DOORS = Object.keys(TRACKS) as Track[]

function DoorPicker() {
  return (
    <>
      <PageHero title="من أين تبدئين؟" lede="التسجيل مفتوح الآن لمرحلة الإلهام. بقية المراحل قريبًا.">
        <ChangePersona />
      </PageHero>
      <section className="bg-canvas">
        <ul className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 md:py-20 lg:px-10">
          {DOORS.map((t) => {
            const track = TRACKS[t]
            const stage = STAGE[track.stage]
            const open = stage.registration.open
            return (
              <li key={t} className="flex">
                {open ? (
                  <Link
                    to={`/apply?as=participant&stage=${t}`}
                    className="group flex w-full flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-[translate,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-raised"
                  >
                  <span className="relative flex h-28 items-end overflow-hidden p-6" style={{ background: stage.color, color: stage.on }}>
                      <Star outline strokeWidth={1.5} className="pointer-events-none absolute -top-10 -left-8 size-44 opacity-30 transition-transform duration-700 ease-out group-hover:rotate-45" />
                      <span className="relative flex items-center gap-2 text-sm font-medium">
                        <Star className="size-3.5" />
                        مرحلة {stage.name}
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col p-6">
                      <span className="text-2xl font-bold text-navy">{track.door}</span>
                      <span className="mt-2 text-lg text-slate">{track.detail}</span>
                      <span className="mt-6 flex flex-col gap-1 border-t border-line pt-4 text-navy">
                        <span className="tabular font-medium">{track.seats}</span>
                        <span className="tabular text-sm text-slate">{stage.registration.window}</span>
                      </span>
                      <span className="mt-auto flex items-center justify-between pt-6 font-semibold" style={{ color: stage.ink }}>
                        ابدئي التسجيل
                        <span className="grid size-10 place-items-center rounded-full text-white transition-transform duration-300 group-hover:-translate-x-1.5" style={{ background: stage.color, color: stage.on }}>
                          <ArrowLeft className="size-5" aria-hidden />
                        </span>
                      </span>
                    </span>
  </Link>
                ) : (
                  <div className="group flex w-full flex-col overflow-hidden rounded-3xl bg-white opacity-70 shadow-card" aria-disabled="true">
                  <span className="relative flex h-28 items-end overflow-hidden p-6" style={{ background: stage.color, color: stage.on }}>
                      <Star outline strokeWidth={1.5} className="pointer-events-none absolute -top-10 -left-8 size-44 opacity-30 transition-transform duration-700 ease-out group-hover:rotate-45" />
                      <span className="relative flex items-center gap-2 text-sm font-medium">
                        <Star className="size-3.5" />
                        مرحلة {stage.name}
                      </span>
                    </span>
                    <span className="flex flex-1 flex-col p-6">
                      <span className="text-2xl font-bold text-navy">{track.door}</span>
                      <span className="mt-2 text-lg text-slate">{track.detail}</span>
                      <span className="mt-auto flex items-center justify-between pt-6 font-semibold" style={{ color: stage.ink }}>
                        التسجيل {SOON}
                      </span>
                    </span>
  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}

/* ───────────── Who is applying? ───────────── */

type Persona = 'participant' | NominationKind

/** The three supporting roles keep their fixed colour everywhere; رائدة الأعمال takes the mint. */
const PERSONAS: { as: Persona; label: string; line: string; color: string; on: string; icon: LucideIcon }[] = [
  { as: 'participant', label: 'رائدة أعمال', line: 'لديكِ فكرة أو مشروع.', color: '#8FDD90', on: '#031330', icon: Rocket },
  { as: 'mentor', label: 'مرشد/ة', line: 'ترافق فريقًا بجلسة أسبوعية.', ...ROLE_COLOR.mentor, icon: MessagesSquare },
  { as: 'expert', label: 'خبير/ة', line: 'تقدّم ورشة أو استشارة.', ...ROLE_COLOR.expert, icon: Presentation },
  { as: 'judge', label: 'محكّم/ة', line: 'تقيّم الفرق في أيام التحكيم.', ...ROLE_COLOR.judge, icon: Gavel },
]

const JOIN_TITLE: Record<NominationKind, string> = {
  mentor: 'انضم مرشدًا',
  expert: 'انضم خبيرًا',
  judge: 'انضم محكّمًا',
}

function ChangePersona() {
  return (
    <Link to="/apply" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white">
      <ArrowRight className="size-4" aria-hidden />
      تغيير الصفة
    </Link>
  )
}

/**
 * Four colour panels, one per way of joining. The one under the pointer (or focus) opens
 * wider, like the stage colours taking over on the home page.
 */
function PersonaPicker() {
  return (
    <section className="relative isolate flex min-h-svh flex-col bg-[#03050a] text-white" aria-labelledby="persona-title">
      <img src={cover} alt="" aria-hidden width={2000} height={1125} fetchPriority="high" className="absolute inset-0 -z-10 size-full object-cover object-left" />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pt-32 pb-12 sm:px-6 lg:px-10">
        <h1 id="persona-title" className="text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.2] font-bold">
          بأي صفة تنضم إلى سُدُم؟
        </h1>
        <ul className="mt-10 flex flex-1 flex-col gap-3 md:min-h-[26rem] md:flex-row">
          {PERSONAS.map((p) => (
            <li key={p.as} className="flex min-h-32 min-w-0 flex-1 transition-[flex-grow] duration-500 ease-[var(--ease-out-expo)] md:hover:grow-[2.4] md:focus-within:grow-[2.4]">
              <Link
                to={`/apply?as=${p.as}`}
                className="group relative flex w-full flex-col justify-end overflow-hidden rounded-3xl p-6 md:p-7"
                style={{ background: p.color, color: p.on }}
              >
                <Star
                  outline
                  strokeWidth={1.5}
                  className="pointer-events-none absolute -top-10 -left-10 size-52 opacity-30 transition-transform duration-700 ease-out group-hover:rotate-45 group-focus-visible:rotate-45 md:size-72"
                />
                <span className="absolute top-7 right-7 hidden size-14 place-items-center rounded-full bg-black/15 md:grid">
                  <p.icon className="size-7" aria-hidden />
                </span>
                <span className="relative text-3xl font-bold whitespace-nowrap">{p.label}</span>
                <span className="relative mt-1 flex items-center justify-between gap-4 text-base opacity-90 md:text-lg">
                  <span className="overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-500 ease-[var(--ease-out-expo)] md:max-w-0 md:opacity-0 md:group-hover:max-w-80 md:group-hover:opacity-100 md:group-focus-visible:max-w-80 md:group-focus-visible:opacity-100">
                    {p.line}
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-navy transition-transform duration-300 group-hover:-translate-x-1.5">
                    <ArrowLeft className="size-5" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Apply() {
  const [params] = useSearchParams()
  const as = params.get('as')
  const stage = params.get('stage')
  if (as === 'participant') {
    return stage && stage in TRACKS && STAGE[TRACKS[stage as Track].stage].registration.open ? <StageApplication key={stage} door={stage as Track} /> : <DoorPicker />
  }
  if (as === 'mentor' || as === 'expert' || as === 'judge') {
    return (
      <>
        <PageHero title={JOIN_TITLE[as]} lede="بياناتك هنا هي ملفك التعريفي في صفحة الشبكة.">
          <ChangePersona />
        </PageHero>
        <section className="bg-canvas">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-10">
            <JoinForm key={as} kind={as} />
          </div>
        </section>
      </>
    )
  }
  return <PersonaPicker />
}
