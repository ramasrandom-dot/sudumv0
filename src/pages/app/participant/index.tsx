import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Check, ExternalLink, Send, Stethoscope } from 'lucide-react'
import { StageBadge, StageTrack, Star } from '@/components/brand'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Field, Input, Meta, PageHeader, Progress, Select, Textarea, buttonClass, useToast } from '@/components/ui'
import { CRITERIA, ENTRY_POINTS, STAGE, TODAY, nextLabel } from '@/data/program'
import type { Milestone, Team } from '@/data/types'
import { daysFromToday, fmtDate, fmtDay } from '@/lib/dates'
import { cn } from '@/lib/cn'
import { eventResults, weightedTotal } from '@/lib/scoring'
import { useMe, useStore, type AppState } from '@/store/AppStore'
import { byId, milestoneProgress, peopleByRole, stageWeek, teamMilestones } from '@/store/selectors'
import { Chip, DateChip, Hero, ListRow, MilestoneBadge, NextStep, Rel, SectionTitle, SessionBadge, sessionKind } from '../shared'

function useMyTeam() {
  const me = useMe()
  const { state } = useStore()
  const team = byId(state.teams, me.teamId)
  if (!team) throw new Error('Participant has no team')
  return team
}

interface Upcoming {
  id: string
  date: string
  time?: string
  title: string
  sub: string
  badge?: React.ReactNode
}

/** Everything on the team's calendar from today on: sessions, consultations and workshops. */
const upcomingFor = (state: AppState, team: Team): Upcoming[] =>
  [
    ...state.sessions
      .filter((s) => s.teamId === team.id && s.date >= TODAY && (s.status === 'scheduled' || s.status === 'requested'))
      .map((s) => ({
        id: s.id,
        date: s.date,
        time: s.time,
        title: s.topic,
        sub: `${sessionKind(s.kind)} · ${byId(state.people, s.hostId)?.name ?? ''}`,
        badge: <SessionBadge s={s} />,
      })),
    ...state.workshops
      .filter((w) => w.stage === team.stage && w.date >= TODAY)
      .map((w) => ({ id: w.id, date: w.date, title: w.title, sub: 'ورشة', badge: <Badge tone="blue">ورشة</Badge> })),
  ].sort((a, b) => a.date.localeCompare(b.date))

/* ───────────── رحلتي: the stage, the next task, the whole task path ───────────── */

function SubmitForm({ m, onDone }: { m: Milestone; onDone: () => void }) {
  const { actions } = useStore()
  const toast = useToast()
  const [link, setLink] = useState(m.submission?.link ?? '')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  return (
    <form
      className="mt-4 flex flex-col gap-4 rounded-xl bg-canvas p-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!/^https?:\/\//.test(link)) {
          setError('أضيفي رابطًا يبدأ بـ https://')
          return
        }
        actions.submitMilestone(m.id, link, note)
        toast('أُرسلت المهمة إلى مرشدتكِ')
        onDone()
      }}
    >
      <Field label="رابط التسليم" htmlFor={`link-${m.id}`} error={error} required>
        <Input
          id={`link-${m.id}`}
          dir="ltr"
          value={link}
          onChange={(e) => {
            setLink(e.target.value)
            setError('')
          }}
          placeholder="https://"
          aria-invalid={!!error}
        />
      </Field>
      <Field label="ملاحظة للمرشدة" htmlFor={`note-${m.id}`}>
        <Textarea id={`note-${m.id}`} className="min-h-20" value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <div className="flex gap-2">
        <Button type="submit">
          <Send className="size-4" aria-hidden />
          إرسال للاعتماد
        </Button>
        <Button variant="ghost" onClick={onDone}>
          إلغاء
        </Button>
      </div>
    </form>
  )
}

export function ParticipantHome() {
  const me = useMe()
  const team = useMyTeam()
  const { state } = useStore()
  const [open, setOpen] = useState<string | null>(null)

  const stage = STAGE[team.stage]
  const week = stageWeek(team.stage)
  const exited = team.status === 'exited'
  const ms = teamMilestones(state, team.id)
  const progress = milestoneProgress(ms)
  const current = exited ? undefined : ms.find((m) => m.status === 'todo' || m.status === 'changes')
  const nextUp = upcomingFor(state, team)[0]
  const gateIn = daysFromToday(stage.gateDate)

  const line = exited
    ? 'لم يتأهل الفريق هذه المرة. ملاحظات المحكّمين في صفحة «فريقي».'
    : week === 0
      ? `فريق ${team.name} · ${stage.fullName} · تبدأ ${fmtDay(stage.start)}`
      : `فريق ${team.name} · ${stage.fullName} · الأسبوع ${week} من ${stage.weeks}`

  return (
    <>
      <Hero hello={`أهلًا ${me.name.split(' ')[0]}`} line={line} color={stage.color} on={stage.on}>
        {!exited && (
          <div className="flex flex-wrap gap-2">
            {gateIn > 0 && (
              <Chip>
                <span className="tabular">{gateIn}</span> يومًا على {stage.gate}
              </Chip>
            )}
            {progress.total > 0 && (
              <Chip>
                <span className="tabular">{progress.approved}</span> من <span className="tabular">{progress.total}</span> مهام معتمدة
              </Chip>
            )}
          </div>
        )}
        {current && (
          <NextStep
            icon={Star}
            title={current.title}
            hint={
              <>
                خطوتك القادمة · التسليم <span className="tabular">{fmtDay(current.due)}</span>
              </>
            }
            action={
              <a href="#tasks" className={buttonClass('primary', 'lg')} onClick={() => setOpen(current.id)}>
                {current.status === 'changes' ? 'عدّلي وأعيدي التسليم' : 'سلّمي المهمة'}
              </a>
            }
          />
        )}
      </Hero>

      <Card className="mt-6 px-5 py-4 md:px-6">
        <StageTrack current={team.stage} exited={exited} />
      </Card>

      <SectionTitle>مهامك</SectionTitle>
      {ms.length === 0 ? (
        <Card>
          <EmptyState title="لا مهام بعد">
            تبدأ {stage.fullName} في <span className="tabular">{fmtDay(stage.start)}</span>.
          </EmptyState>
        </Card>
      ) : (
        <ol id="tasks" className="flex scroll-mt-24 flex-col gap-3">
          {ms.map((m) => {
            const done = m.status === 'approved'
            const isCurrent = m.id === current?.id
            const canSubmit = !exited && (m.status === 'todo' || m.status === 'changes')
            return (
              <li
                key={m.id}
                className={cn('rounded-2xl border bg-white p-4 md:p-5', isCurrent ? 'border-transparent' : 'border-line shadow-card')}
                style={isCurrent ? { boxShadow: `0 0 0 2px ${stage.color}, var(--shadow-raised)` } : undefined}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full"
                    style={done ? { background: stage.color, color: stage.on } : { background: stage.tint, color: stage.ink }}
                  >
                    {done ? <Check className="size-5" aria-hidden /> : <Star className="size-5" outline={!isCurrent} strokeWidth={2} />}
                  </span>
                  <div className="min-w-0 flex-1 basis-52">
                    <p className={cn('font-bold text-navy', isCurrent && 'text-lg')}>{m.title}</p>
                    <p className="text-sm text-slate">
                      الأسبوع <span className="tabular">{m.week}</span> · التسليم <span className="tabular">{fmtDay(m.due)}</span>
                      {!done && (
                        <>
                          {' '}· <Rel iso={m.due} />
                        </>
                      )}
                    </p>
                  </div>
                  <MilestoneBadge m={m} />
                  {canSubmit && open !== m.id && (
                    <Button size={isCurrent ? 'md' : 'sm'} variant={isCurrent ? 'primary' : 'secondary'} onClick={() => setOpen(m.id)}>
                      {m.status === 'changes' ? 'إعادة التسليم' : 'تسليم'}
                    </Button>
                  )}
                </div>
                {done && m.feedback && <p className="mt-2 text-sm text-slate md:ps-14">ملاحظة المرشدة: {m.feedback}</p>}
                {!done && (m.submission || m.feedback) && (
                  <div className="mt-3 flex flex-col gap-2 text-sm md:ps-14">
                    {m.submission && (
                      <a href={m.submission.link} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-1 text-blue-ink hover:underline" dir="ltr">
                        <ExternalLink className="size-3.5" aria-hidden />
                        {m.submission.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    {m.feedback && (
                      <p className="rounded-xl bg-canvas px-3 py-2 text-navy">
                        <span className="font-semibold">ملاحظة المرشدة: </span>
                        {m.feedback}
                      </p>
                    )}
                  </div>
                )}
                {open === m.id && <SubmitForm m={m} onDone={() => setOpen(null)} />}
              </li>
            )
          })}
        </ol>
      )}

      {nextUp && (
        <>
          <SectionTitle
            action={
              <Link to="/app/participant/dates" className="text-sm font-semibold text-blue-ink hover:underline">
                كل المواعيد
              </Link>
            }
          >
            موعدك القادم
          </SectionTitle>
          <Card>
            <ul>
              <ListRow>
                <DateChip iso={nextUp.date} time={nextUp.time} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-navy">{nextUp.title}</p>
                  <p className="text-sm text-slate">{nextUp.sub}</p>
                </div>
                <Rel iso={nextUp.date} />
              </ListRow>
            </ul>
          </Card>
        </>
      )}
    </>
  )
}

/* ───────────── مواعيدي: what is coming, book an hour, ask an expert ───────────── */

export function ParticipantDates() {
  const team = useMyTeam()
  const { state, actions } = useStore()
  const toast = useToast()
  const mentor = byId(state.people, team.mentorId)
  const upcoming = upcomingFor(state, team)
  const past = state.sessions.filter((s) => s.teamId === team.id && s.status === 'done').sort((a, b) => b.date.localeCompare(a.date))
  const freeSlots = state.slots.filter((s) => s.hostId === team.mentorId && !s.bookedBy && s.date >= TODAY)
  const experts = peopleByRole(state, 'expert')
  const [topic, setTopic] = useState('')
  const [ask, setAsk] = useState({ expertId: '', topic: '', date: '' })
  const [askError, setAskError] = useState('')

  return (
    <>
      <PageHeader title="مواعيدي" />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="القادم" />
            {upcoming.length ? (
              <ul className="divide-y divide-line">
                {upcoming.map((u) => (
                  <ListRow key={u.id}>
                    <DateChip iso={u.date} time={u.time} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-navy">{u.title}</p>
                      <p className="text-sm text-slate">{u.sub}</p>
                    </div>
                    {u.badge}
                  </ListRow>
                ))}
              </ul>
            ) : (
              <EmptyState title="لا مواعيد قادمة">احجزي ساعة مع مرشدتكِ أو اطلبي استشارة.</EmptyState>
            )}
          </Card>

          {past.length > 0 && (
            <details className="group rounded-2xl border border-line bg-white shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-bold text-navy [&::-webkit-details-marker]:hidden">
                جلسات سابقة <span className="tabular text-sm font-normal text-slate">{past.length}</span>
              </summary>
              <ul className="divide-y divide-line border-t border-line">
                {past.map((s) => (
                  <li key={s.id} className="px-5 py-4">
                    <p className="text-sm text-slate">
                      <span className="tabular">{fmtDay(s.date)}</span> · {sessionKind(s.kind)} · {byId(state.people, s.hostId)?.name}
                    </p>
                    <p className="font-semibold text-navy">{s.topic}</p>
                    {s.notes && <p className="mt-1 text-navy/85">{s.notes}</p>}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="احجزي ساعة مع مرشدتكِ" sub={mentor?.name} />
            <div className="p-5">
              {freeSlots.length ? (
                <>
                  <Field label="عن ماذا؟" htmlFor="oh-topic">
                    <Input id="oh-topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="مثال: مراجعة صفحة التسعير…" />
                  </Field>
                  <ul className="mt-4 grid grid-cols-2 gap-2">
                    {freeSlots.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          className="flex w-full flex-col items-center rounded-xl border border-line-strong px-3 py-2 text-sm transition-colors hover:border-navy hover:bg-tint-blue/40"
                          onClick={() => {
                            actions.bookSlot(s.id, team.id, topic.trim() || 'ساعة مكتبية')
                            toast(`حُجزت الساعة يوم ${fmtDay(s.date)} الساعة ${s.time}`)
                            setTopic('')
                          }}
                        >
                          <span className="font-semibold text-navy">{fmtDay(s.date)}</span>
                          <span className="tabular text-slate">{s.time}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-slate">لا ساعات متاحة الآن.</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="اطلبي استشارة من خبير" />
            <form
              className="flex flex-col gap-4 p-5"
              onSubmit={(e) => {
                e.preventDefault()
                if (!ask.expertId || ask.topic.trim().length < 5 || !ask.date) {
                  setAskError('اختاري الخبير والموعد واكتبي الموضوع.')
                  return
                }
                actions.requestSession({ teamId: team.id, hostId: ask.expertId, kind: 'clinic', date: ask.date, time: '13:00', topic: ask.topic })
                toast('أُرسل طلب الاستشارة إلى الخبير')
                setAsk({ expertId: '', topic: '', date: '' })
                setAskError('')
              }}
            >
              <Field label="الخبير" htmlFor="cl-expert">
                <Select id="cl-expert" value={ask.expertId} onChange={(e) => setAsk({ ...ask, expertId: e.target.value })}>
                  <option value="">اختاري…</option>
                  {experts.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name} · {x.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="الموعد المفضل" htmlFor="cl-date">
                <Input id="cl-date" type="date" min={TODAY} value={ask.date} onChange={(e) => setAsk({ ...ask, date: e.target.value })} />
              </Field>
              <Field label="الموضوع" htmlFor="cl-topic" error={askError}>
                <Textarea id="cl-topic" className="min-h-20" value={ask.topic} onChange={(e) => setAsk({ ...ask, topic: e.target.value })} />
              </Field>
              <Button type="submit" variant="secondary">
                <Stethoscope className="size-4" aria-hidden />
                إرسال الطلب
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}

/* ───────────── فريقي: the people, and how the team did on judging days ───────────── */

export function ParticipantTeam() {
  const team = useMyTeam()
  const { state } = useStore()
  const mentor = byId(state.people, team.mentorId)
  const events = state.events.filter((e) => e.teamIds.includes(team.id)).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHeader title={`فريق ${team.name}`} lede={team.idea} actions={<StageBadge stage={team.stage} full />} />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader title="الأعضاء" />
          <ul className="divide-y divide-line">
            {team.members.map((m) => (
              <ListRow key={m.name}>
                <Avatar name={m.name} />
                <div className="flex-1">
                  <p className="font-semibold text-navy">{m.name}</p>
                  <p className="text-sm text-slate">{m.role}</p>
                </div>
              </ListRow>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <dl className="grid grid-cols-2 gap-4">
            <Meta label="الفئة">{ENTRY_POINTS[team.entry].label}</Meta>
            <Meta label="القطاع">{team.sector}</Meta>
            <Meta label="مستخدمون">
              <span className="tabular">{team.metrics?.users ?? 0}</span>
            </Meta>
            <Meta label="مقابلات">
              <span className="tabular">{team.metrics?.interviews ?? 0}</span>
            </Meta>
            {mentor && <Meta label="المرشدة">{mentor.name}</Meta>}
          </dl>
          {team.charter && (
            <p className="mt-5 border-t border-line pt-4 text-sm leading-loose text-navy">
              <span className="font-bold">اتفاق الفريق: </span>
              {team.charter}
            </p>
          )}
        </Card>
      </div>

      <SectionTitle>أيام التحكيم</SectionTitle>
      <div className="flex flex-col gap-4">
        {events.map((ev) => {
          const stage = STAGE[ev.stage]
          if (!ev.published) {
            return (
              <Card key={ev.id}>
                <CardHeader
                  title={ev.title}
                  sub={
                    <>
                      <span className="tabular">{fmtDate(ev.date)}</span> · يتأهل <span className="tabular">{ev.capacity}</span> فرق إلى {nextLabel(ev.stage)}
                    </>
                  }
                  action={<Badge tone="blue">قادم</Badge>}
                />
                <details className="group px-5 py-3">
                  <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-blue-ink [&::-webkit-details-marker]:hidden">
                    <CalendarDays className="size-4" aria-hidden />
                    على ماذا يُقيَّم الفريق؟
                  </summary>
                  <ul className="mt-3 grid gap-2 pb-2 sm:grid-cols-2">
                    {CRITERIA.map((c) => (
                      <li key={c.id} className="flex justify-between gap-3 rounded-xl bg-canvas px-4 py-2.5 text-sm font-semibold text-navy">
                        {c.label}
                        <span className="tabular text-slate">{c.weight}%</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </Card>
            )
          }
          const advanced = ev.advancedIds?.includes(team.id)
          const sheets = state.scores.filter((s) => s.eventId === ev.id && s.teamId === team.id)
          const results = eventResults(ev, state.scores)
          const mine = results.find((r) => r.teamId === team.id)
          return (
            <Card key={ev.id}>
              <CardHeader
                title={ev.title}
                sub={<span className="tabular">{fmtDate(ev.date)}</span>}
                action={advanced ? <Badge tone="green">تأهل الفريق</Badge> : <Badge tone="neutral">لم يتأهل</Badge>}
              />
              {sheets.length > 0 && mine ? (
                <div className="grid gap-6 p-5 md:grid-cols-[11rem_1fr]">
                  <div>
                    <p className="text-sm text-slate">الدرجة</p>
                    <p className="tabular text-5xl font-bold" style={{ color: stage.ink }}>
                      {mine.average}
                    </p>
                    <p className="text-sm text-slate">
                      الترتيب <span className="tabular">{mine.rank}</span> من <span className="tabular">{results.length}</span>
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {CRITERIA.map((c) => {
                      const avg = sheets.reduce((a, s) => a + (s.values[c.id] ?? 0), 0) / sheets.length
                      return (
                        <div key={c.id} className="grid grid-cols-[minmax(0,10rem)_1fr_2.5rem] items-center gap-3 text-sm">
                          <span className="text-navy">{c.label}</span>
                          <Progress value={(avg / 5) * 100} color={stage.color} label={c.label} />
                          <span className="tabular text-slate">{avg.toFixed(1)}</span>
                        </div>
                      )
                    })}
                    <ul className="mt-2 flex flex-col gap-2">
                      {sheets.map((s, i) => (
                        <li key={s.id} className="rounded-xl bg-canvas px-4 py-3 text-sm text-navy">
                          <span className="font-semibold">
                            محكّم {i + 1} · <span className="tabular">{weightedTotal(s.values)}</span>:{' '}
                          </span>
                          {s.comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="p-5 text-sm text-slate">تأهل الفريق بعد مقابلة القبول.</p>
              )}
            </Card>
          )
        })}
      </div>
    </>
  )
}
