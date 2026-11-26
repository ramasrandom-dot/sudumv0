import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, ExternalLink, Lock } from 'lucide-react'
import { StageBadge, Star } from '@/components/brand'
import { Badge, Card, CardHeader, EmptyState, Field, Meta, PageHeader, Progress, Textarea, buttonClass, useToast } from '@/components/ui'
import { CRITERIA, ENTRY_POINTS, STAGE } from '@/data/program'
import type { JudgingEvent } from '@/data/types'
import { fmtDate, fmtDay, relativeDays } from '@/lib/dates'
import { cn, firstName } from '@/lib/cn'
import { weightedTotal } from '@/lib/scoring'
import { useMe, useStore } from '@/store/AppStore'
import { byId, teamMilestones } from '@/store/selectors'
import { Hero, NextStep, SectionTitle } from '../shared'

function useMyEvents() {
  const me = useMe()
  const { state } = useStore()
  return state.events.filter((e) => e.judgeIds.includes(me.id)).sort((a, b) => a.date.localeCompare(b.date))
}

export function JudgeEvents() {
  const me = useMe()
  const { state } = useStore()
  const events = useMyEvents()

  const Item = ({ ev }: { ev: JudgingEvent }) => {
    const done = state.scores.filter((s) => s.eventId === ev.id && s.judgeId === me.id).length
    const total = ev.teamIds.length
    return (
      <li>
        <Link
          to={`/app/judge/events/${ev.id}`}
          className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-white p-5 shadow-card transition-[border-color,box-shadow] hover:border-navy/30 hover:shadow-raised"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-bold text-navy">{ev.title}</p>
              <StageBadge stage={ev.stage} full />
            </div>
            <p className="text-sm text-slate">
              <span className="tabular">{fmtDate(ev.date)}</span> · {relativeDays(ev.date)} · يتأهل <span className="tabular">{ev.capacity}</span> من{' '}
              <span className="tabular">{total || '—'}</span>
            </p>
          </div>
          {ev.published ? (
            <Badge tone="neutral"><Lock className="size-3" aria-hidden />أُعلنت النتائج</Badge>
          ) : total ? (
            <div className="w-44">
              <p className="mb-1 text-sm text-slate">
                قيّمت <span className="tabular font-semibold text-navy">{done}</span> من <span className="tabular">{total}</span>
              </p>
              <Progress value={(done / total) * 100} color={STAGE[ev.stage].color} label="تقدم التقييم" />
            </div>
          ) : (
            <Badge tone="neutral">تُحدَّد الفرق لاحقًا</Badge>
          )}
          <ArrowLeft className="size-5 text-slate" aria-hidden />
        </Link>
      </li>
    )
  }

  const open = events.filter((e) => !e.published)
  const current = open.find((e) => e.teamIds.length > 0)
  const scored = new Set(state.scores.filter((s) => s.eventId === current?.id && s.judgeId === me.id).map((s) => s.teamId))
  const nextTeamId = current?.teamIds.find((id) => !scored.has(id))
  const closed = events.filter((e) => e.published)
  return (
    <>
      <Hero
        hello={`أهلًا ${firstName(me.name)}`}
        line={
          current ? (
            <>
              {current.title} · <span className="tabular">{fmtDate(current.date)}</span>
            </>
          ) : (
            'لا أيام تحكيم قادمة'
          )
        }
      >
        {current && (
          <NextStep
            icon={Star}
            title={
              nextTeamId ? (
                <>
                  قيّمت <span className="tabular">{scored.size}</span> من <span className="tabular">{current.teamIds.length}</span> فريقًا
                </>
              ) : (
                'أكملت تقييم كل الفرق'
              )
            }
            hint="درجاتك سرية، ويرى الفريق ملاحظاتك دون اسمك."
            action={
              nextTeamId && (
                <Link to={`/app/judge/events/${current.id}/${nextTeamId}`} className={buttonClass('primary', 'lg')}>
                  {scored.size ? 'أكمل التقييم' : 'ابدأ التقييم'}
                </Link>
              )
            }
          />
        )}
      </Hero>
      <SectionTitle>القادمة</SectionTitle>
      {open.length ? <ul className="flex flex-col gap-3">{open.map((e) => <Item key={e.id} ev={e} />)}</ul> : <Card><EmptyState title="لا أيام تحكيم قادمة" /></Card>}
      <SectionTitle>السابقة</SectionTitle>
      <ul className="flex flex-col gap-3">{closed.map((e) => <Item key={e.id} ev={e} />)}</ul>
    </>
  )
}

export function JudgeEvent() {
  const { eventId, teamId } = useParams()
  const me = useMe()
  const { state, actions } = useStore()
  const toast = useToast()
  const ev = byId(state.events, eventId)
  const team = byId(state.teams, teamId ?? ev?.teamIds[0])
  const existing = state.scores.find((s) => s.eventId === ev?.id && s.teamId === team?.id && s.judgeId === me.id)
  const [values, setValues] = useState<Record<string, number>>(existing?.values ?? {})
  const [comment, setComment] = useState(existing?.comment ?? '')
  const [error, setError] = useState('')
  const [lastTeam, setLastTeam] = useState(team?.id)

  // Reset the sheet when the judge moves to another team.
  if (team?.id !== lastTeam) {
    setLastTeam(team?.id)
    setValues(existing?.values ?? {})
    setComment(existing?.comment ?? '')
    setError('')
  }

  if (!ev || !ev.judgeIds.includes(me.id)) return <Navigate to="/app/judge" replace />

  const myScores = state.scores.filter((s) => s.eventId === ev.id && s.judgeId === me.id)
  const locked = ev.published
  const complete = CRITERIA.every((c) => values[c.id])
  const total = weightedTotal(values)
  const idx = team ? ev.teamIds.indexOf(team.id) : -1
  const nextTeamId = ev.teamIds[idx + 1]
  const ms = team ? teamMilestones(state, team.id).filter((m) => m.submission) : []

  return (
    <>
      <Link to="/app/judge" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate hover:text-navy">
        <ArrowRight className="size-4" aria-hidden />
        أيام التحكيم
      </Link>
      <PageHeader
        title={ev.title}
        lede={<><span className="tabular">{fmtDate(ev.date)}</span> · قيّمت <span className="tabular">{myScores.length}</span> من <span className="tabular">{ev.teamIds.length}</span> فريقًا</>}
        actions={<StageBadge stage={ev.stage} full />}
      />

      {ev.teamIds.length === 0 ? (
        <Card><EmptyState title="لم تُحدَّد الفرق بعد">تظهر الشركات هنا بعد إعلان نتائج ختام تمكين.</EmptyState></Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="الفرق" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
              {ev.teamIds.map((id) => {
                const t = byId(state.teams, id)
                const scored = myScores.find((s) => s.teamId === id)
                const active = id === team?.id
                return (
                  <li key={id} className="shrink-0">
                    <Link
                      to={`/app/judge/events/${ev.id}/${id}`}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors',
                        active ? 'bg-navy font-semibold text-white' : 'text-navy hover:bg-white',
                      )}
                    >
                      <span className="flex-1">{t?.name}</span>
                      {scored ? (
                        <span className={cn('tabular text-xs', active ? 'text-white/75' : 'text-green-ink')}>{weightedTotal(scored.values)}</span>
                      ) : (
                        <span className={cn('size-1.5 rounded-full', active ? 'bg-white/50' : 'bg-line-strong')} aria-label="لم يُقيَّم" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {team && (
            <div className="flex min-w-0 flex-col gap-6">
              <Card>
                <CardHeader title={`ملف فريق ${team.name}`} sub={team.idea} />
                <div className="grid gap-6 p-5 md:grid-cols-[1fr_1.2fr]">
                  <dl className="grid grid-cols-2 gap-4">
                    <Meta label="القطاع">{team.sector}</Meta>
                    <Meta label="الفئة">{ENTRY_POINTS[team.entry].label}</Meta>
                    <Meta label="مستخدمون"><span className="tabular">{team.metrics?.users ?? 0}</span></Meta>
                    <Meta label="مقابلات"><span className="tabular">{team.metrics?.interviews ?? 0}</span></Meta>
                    {team.metrics?.revenue ? <Meta label="إيراد (ريال)"><span className="tabular">{team.metrics.revenue.toLocaleString('en-US')}</span></Meta> : null}
                    <Meta label="الأعضاء"><span className="tabular">{team.members.length}</span></Meta>
                  </dl>
                  <div>
                    <p className="text-sm font-semibold text-navy">التسليمات</p>
                    <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                      {ms.length ? ms.map((m) => (
                        <li key={m.id}>
                          <a href={m.submission!.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-blue-ink hover:underline">
                            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                            {m.title}
                          </a>
                        </li>
                      )) : <li className="text-slate">لا تسليمات مرفقة.</li>}
                    </ul>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="بطاقة التقييم"
                  sub="من نجمة إلى خمس نجوم لكل معيار"
                  action={
                    <span className="tabular text-2xl font-bold text-navy" aria-live="polite">
                      {complete ? total : '—'}
                      <span className="text-sm font-normal text-slate"> / 100</span>
                    </span>
                  }
                />
                <form
                  className="flex flex-col"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!complete) {
                      setError('قيّم المعايير الخمسة قبل الحفظ.')
                      return
                    }
                    if (comment.trim().length < 10) {
                      setError('اكتب ملاحظة للفريق في جملة على الأقل.')
                      return
                    }
                    actions.submitScore(ev.id, team.id, me.id, values, comment.trim())
                    toast(`حُفظ تقييم فريق ${team.name}`)
                  }}
                >
                  <fieldset disabled={locked} className="divide-y divide-line">
                    {CRITERIA.map((c) => (
                      <div key={c.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
                        <div>
                          <p className="font-semibold text-navy">
                            {c.label} <span className="tabular text-sm font-normal text-slate">· {c.weight}%</span>
                          </p>
                          <p className="text-sm text-slate">{c.hint}</p>
                        </div>
                        <div role="radiogroup" aria-label={c.label} className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <label key={n} className="cursor-pointer">
                              <input
                                type="radio"
                                className="peer sr-only"
                                name={c.id}
                                checked={values[c.id] === n}
                                onChange={() => {
                                  setValues((v) => ({ ...v, [c.id]: n }))
                                  setError('')
                                }}
                              />
                              <span className="block rounded-lg p-0.5 transition-transform duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-blue hover:scale-110">
                                <Star className={cn('size-9', (values[c.id] ?? 0) >= n ? 'text-blue' : 'text-line-strong')} />
                                <span className="sr-only">{n}</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="px-5 py-4">
                      <Field label="ملاحظة للفريق" htmlFor="j-comment" hint="تظهر للفريق دون اسمك." error={error}>
                        <Textarea id="j-comment" value={comment} onChange={(e) => { setComment(e.target.value); setError('') }} />
                      </Field>
                    </div>
                  </fieldset>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
                    {locked ? (
                      <p className="flex items-center gap-2 text-sm text-slate"><Lock className="size-4" aria-hidden />أُعلنت النتائج، والتقييم مقفل.</p>
                    ) : (
                      <button type="submit" className={buttonClass('primary')}>
                        <Check className="size-4" aria-hidden />
                        {existing ? 'تحديث التقييم' : 'حفظ التقييم'}
                      </button>
                    )}
                    {nextTeamId && (
                      <Link to={`/app/judge/events/${ev.id}/${nextTeamId}`} className={buttonClass('ghost')}>
                        الفريق التالي: {byId(state.teams, nextTeamId)?.name}
                        <ArrowLeft className="size-4" aria-hidden />
                      </Link>
                    )}
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export function JudgeScores() {
  const me = useMe()
  const { state } = useStore()
  const mine = state.scores.filter((s) => s.judgeId === me.id).sort((a, b) => b.at.localeCompare(a.at))
  return (
    <>
      <PageHeader title="تقييماتي" lede="يمكن تعديلها حتى إعلان النتائج." />
      <Card>
        {mine.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-start text-slate">
                  <th className="px-5 py-3 text-start font-semibold">الفريق</th>
                  <th className="px-5 py-3 text-start font-semibold">يوم التحكيم</th>
                  {CRITERIA.map((c) => <th key={c.id} className="px-2 py-3 text-center font-semibold" title={c.label}>{c.label.split(' ')[0]}</th>)}
                  <th className="px-5 py-3 text-center font-semibold">المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {mine.map((s) => {
                  const ev = byId(state.events, s.eventId)
                  return (
                    <tr key={s.id} className="hover:bg-canvas/60">
                      <td className="px-5 py-3">
                        <Link className="font-semibold text-navy hover:text-blue-ink hover:underline" to={`/app/judge/events/${s.eventId}/${s.teamId}`}>
                          {byId(state.teams, s.teamId)?.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-slate">{ev?.title} · <span className="tabular">{ev && fmtDay(ev.date)}</span></td>
                      {CRITERIA.map((c) => <td key={c.id} className="tabular px-2 py-3 text-center text-navy">{s.values[c.id]}</td>)}
                      <td className="tabular px-5 py-3 text-center font-bold text-navy">{weightedTotal(s.values)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="لم تقدّم تقييمات بعد" />
        )}
      </Card>
    </>
  )
}
