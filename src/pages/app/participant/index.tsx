import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Send, Stethoscope, Users } from 'lucide-react'
import { StageBadge, StageTrack, Star } from '@/components/brand'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Field, Input, Meta, PageHeader, Progress, Select, Textarea, useToast } from '@/components/ui'
import { CRITERIA, ENTRY_POINTS, STAGE, TODAY, nextStage } from '@/data/program'
import type { Milestone } from '@/data/types'
import { daysFromToday, fmtDate, fmtDay } from '@/lib/dates'
import { eventResults, weightedTotal } from '@/lib/scoring'
import { useMe, useStore } from '@/store/AppStore'
import { byId, isOverdue, milestoneProgress, peopleByRole, stageWeek, teamMilestones } from '@/store/selectors'
import { DateChip, ListRow, MilestoneBadge, Rel, SessionBadge, sessionKind } from '../shared'

function useMyTeam() {
  const me = useMe()
  const { state } = useStore()
  const team = byId(state.teams, me.teamId)
  if (!team) throw new Error('Participant has no team')
  return team
}

/* ───────────── Overview ───────────── */

export function ParticipantOverview() {
  const me = useMe()
  const team = useMyTeam()
  const { state } = useStore()
  const stage = STAGE[team.stage]
  const week = stageWeek(team.stage)
  const ms = teamMilestones(state, team.id)
  const progress = milestoneProgress(ms)
  const nextMilestone = ms.find((m) => m.status === 'todo' || m.status === 'changes')
  const nextWorkshop = state.workshops.filter((w) => w.stage === team.stage && w.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))[0]
  const nextSession = state.sessions
    .filter((s) => s.teamId === team.id && s.status === 'scheduled' && s.date >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  const mentor = byId(state.people, team.mentorId)
  const gateIn = daysFromToday(stage.gateDate)

  return (
    <>
      <PageHeader title={`أهلًا ${me.name.split(' ')[0]}`} lede={`فريق ${team.name} · ${team.idea}`} />

      <section
        className="overflow-hidden rounded-xl text-white shadow-raised"
        style={{ background: stage.color, color: stage.on }}
        aria-label="موقع الفريق في الرحلة"
      >
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:p-8">
          <div>
            <p className="text-sm font-semibold opacity-80">{team.status === 'exited' ? 'آخر مرحلة' : 'المرحلة الحالية'}</p>
            <p className="mt-1 text-3xl font-bold md:text-4xl">
              {stage.fullName} ·{' '}
              {week === 0 ? (
                <>تبدأ <span className="tabular">{fmtDay(stage.start)}</span></>
              ) : (
                <>الأسبوع <span className="tabular">{week}</span> من <span className="tabular">{stage.weeks}</span></>
              )}
            </p>
            <p className="mt-2 max-w-[60ch] opacity-85">
              {team.status === 'exited'
                ? 'لم يتأهل الفريق. ملاحظات المحكّمين في صفحة النتائج.'
                : `النتيجة المطلوبة: ${stage.outcome}`}
            </p>
          </div>
          <div className="flex flex-col justify-center rounded-xl bg-black/15 px-6 py-4 text-center">
            <span className="tabular text-4xl font-bold">{gateIn}</span>
            <span className="text-sm opacity-85">يومًا على {stage.gate}</span>
            <span className="tabular text-xs opacity-70">{fmtDate(stage.gateDate)}</span>
          </div>
        </div>
        <div className="bg-white px-6 py-4 md:px-8">
          <StageTrack current={team.stage} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader title="ما عليكِ هذا الأسبوع" />
          <ul className="divide-y divide-line">
            {nextMilestone && (
              <ListRow>
                <Star className="size-4 shrink-0" color={stage.color} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{nextMilestone.title}</p>
                  <p className="text-sm text-slate">
                    مهمة الأسبوع <span className="tabular">{nextMilestone.week}</span> · التسليم{' '}
                    <span className="tabular">{fmtDay(nextMilestone.due)}</span> · <Rel iso={nextMilestone.due} />
                  </p>
                </div>
                <Link to="/app/participant/milestones" className="text-sm font-semibold text-blue-ink hover:underline">
                  تسليم
                </Link>
              </ListRow>
            )}
            {nextSession && (
              <ListRow>
                <DateChip iso={nextSession.date} time={nextSession.time} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{nextSession.topic}</p>
                  <p className="text-sm text-slate">
                    {sessionKind(nextSession.kind)} مع {byId(state.people, nextSession.hostId)?.name}
                  </p>
                </div>
              </ListRow>
            )}
            {nextWorkshop && (
              <ListRow>
                <DateChip iso={nextWorkshop.date} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{nextWorkshop.title}</p>
                  <p className="text-sm text-slate">
                    ورشة الأسبوع <span className="tabular">{nextWorkshop.week}</span>
                  </p>
                </div>
              </ListRow>
            )}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <h2 className="font-bold text-navy">المهام المعتمدة</h2>
            <p className="tabular mt-2 text-3xl font-bold text-navy">
              {progress.approved}
              <span className="text-lg text-slate"> / {progress.total}</span>
            </p>
            <div className="mt-3">
              <Progress value={progress.pct} color={stage.color} label="نسبة المهام المعتمدة" />
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-bold text-navy">مؤشرات المنتج</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4">
              <Meta label="مستخدمون فعليون">
                <span className="tabular">{team.metrics?.users ?? 0}</span>
                <span className="text-sm font-normal text-slate"> من 20</span>
              </Meta>
              <Meta label="مقابلات مستخدمين">
                <span className="tabular">{team.metrics?.interviews ?? 0}</span>
              </Meta>
            </dl>
          </Card>
          {mentor && (
            <Card className="flex items-center gap-3 p-5">
              <Avatar name={mentor.name} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate">مرشدتكِ</p>
                <p className="font-bold text-navy">{mentor.name}</p>
              </div>
              <Link to="/app/participant/mentoring" className="text-sm font-semibold text-blue-ink hover:underline">
                احجزي ساعة
              </Link>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

/* ───────────── Milestones ───────────── */

function SubmitForm({ m, onDone }: { m: Milestone; onDone: () => void }) {
  const { actions } = useStore()
  const toast = useToast()
  const [link, setLink] = useState(m.submission?.link ?? '')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  return (
    <form
      className="mt-4 flex flex-col gap-4 rounded-lg bg-canvas p-4"
      onSubmit={(e) => {
        e.preventDefault()
        if (!/^https?:\/\//.test(link)) {
          setError('أضيفي رابطًا يبدأ بـ https:// لملف التسليم.')
          return
        }
        actions.submitMilestone(m.id, link, note)
        toast('أُرسل التسليم إلى مرشدتكِ للاعتماد')
        onDone()
      }}
    >
      <Field label="رابط التسليم" htmlFor={`link-${m.id}`} error={error} required>
        <Input id={`link-${m.id}`} dir="ltr" value={link} onChange={(e) => { setLink(e.target.value); setError('') }} placeholder="https://" aria-invalid={!!error} />
      </Field>
      <Field label="ملاحظة للمرشدة" htmlFor={`note-${m.id}`}>
        <Textarea id={`note-${m.id}`} className="min-h-20" value={note} onChange={(e) => setNote(e.target.value)} />
      </Field>
      <div className="flex gap-2">
        <Button type="submit">
          <Send className="size-4" aria-hidden />
          إرسال للاعتماد
        </Button>
        <Button variant="ghost" onClick={onDone}>إلغاء</Button>
      </div>
    </form>
  )
}

export function ParticipantMilestones() {
  const team = useMyTeam()
  const { state } = useStore()
  const ms = teamMilestones(state, team.id)
  const [open, setOpen] = useState<string | null>(null)
  const stage = STAGE[team.stage]

  return (
    <>
      <PageHeader title="المهام" />
      <Card>
        {ms.length === 0 && (
          <EmptyState title="لا مهام بعد">تبدأ {stage.fullName} في {fmtDay(stage.start)}.</EmptyState>
        )}
        <ol className="divide-y divide-line">
          {ms.map((m) => {
            const canSubmit = m.status === 'todo' || m.status === 'changes'
            return (
              <li key={m.id} className="px-5 py-5">
                <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                  <span className="tabular w-16 shrink-0 pt-0.5 text-sm text-slate">أسبوع {m.week}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy">{m.title}</p>
                    <p className="text-sm text-slate">
                      التسليم <span className="tabular">{fmtDay(m.due)}</span> · <Rel iso={m.due} />
                    </p>
                  </div>
                  <MilestoneBadge m={m} />
                  {canSubmit && open !== m.id && (
                    <Button size="sm" variant={isOverdue(m) || m.status === 'changes' ? 'primary' : 'secondary'} onClick={() => setOpen(m.id)}>
                      {m.status === 'changes' ? 'إعادة التسليم' : 'تسليم'}
                    </Button>
                  )}
                </div>
                {(m.submission || m.feedback) && (
                  <div className="mt-3 flex flex-col gap-2 ps-20 text-sm">
                    {m.submission && (
                      <a href={m.submission.link} target="_blank" rel="noreferrer" className="inline-flex w-fit items-center gap-1 text-blue-ink hover:underline" dir="ltr">
                        <ExternalLink className="size-3.5" aria-hidden />
                        {m.submission.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    {m.feedback && (
                      <p className="rounded-lg bg-canvas px-3 py-2 text-navy">
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
      </Card>
    </>
  )
}

/* ───────────── Workshops ───────────── */

export function ParticipantWorkshops() {
  const team = useMyTeam()
  const { state } = useStore()
  const list = state.workshops.filter((w) => w.stage === team.stage)
  return (
    <>
      <PageHeader title="الورش" lede={STAGE[team.stage].fullName} />
      <Card>
        <ul className="divide-y divide-line">
          {list.map((w) => {
            const past = w.date < TODAY
            const attended = w.attended?.includes(team.id)
            const expert = byId(state.people, w.expertId)
            return (
              <ListRow key={w.id} className={past ? 'opacity-80' : ''}>
                <DateChip iso={w.date} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{w.title}</p>
                  <p className="text-sm text-slate">
                    الأسبوع <span className="tabular">{w.week}</span>
                    {expert && <> · {expert.name}</>}
                  </p>
                </div>
                {past ? (
                  attended ? <Badge tone="green">حضر الفريق</Badge> : <Badge tone="warn">لم يُسجّل حضور</Badge>
                ) : (
                  <Badge tone="blue">قادمة · <Rel iso={w.date} /></Badge>
                )}
              </ListRow>
            )
          })}
        </ul>
      </Card>
    </>
  )
}

/* ───────────── Mentoring ───────────── */

export function ParticipantMentoring() {
  const team = useMyTeam()
  const { state, actions } = useStore()
  const toast = useToast()
  const mentor = byId(state.people, team.mentorId)
  const sessions = state.sessions.filter((s) => s.teamId === team.id).sort((a, b) => b.date.localeCompare(a.date))
  const upcoming = sessions.filter((s) => s.date >= TODAY && s.status !== 'done' && s.status !== 'declined').reverse()
  const past = sessions.filter((s) => s.status === 'done')
  const freeSlots = state.slots.filter((s) => s.hostId === team.mentorId && !s.bookedBy && s.date >= TODAY)
  const experts = peopleByRole(state, 'expert')
  const [topic, setTopic] = useState('')
  const [clinic, setClinic] = useState({ expertId: '', topic: '', date: '' })
  const [clinicError, setClinicError] = useState('')

  return (
    <>
      <PageHeader title="الإرشاد والاستشارات" />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="الجلسات القادمة" />
            {upcoming.length ? (
              <ul className="divide-y divide-line">
                {upcoming.map((s) => (
                  <ListRow key={s.id}>
                    <DateChip iso={s.date} time={s.time} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-navy">{s.topic}</p>
                      <p className="text-sm text-slate">{sessionKind(s.kind)} · {byId(state.people, s.hostId)?.name}</p>
                    </div>
                    <SessionBadge s={s} />
                  </ListRow>
                ))}
              </ul>
            ) : (
              <EmptyState title="لا جلسات قادمة">احجزي ساعة مكتبية أو اطلبي استشارة.</EmptyState>
            )}
          </Card>
          <Card>
            <CardHeader title="سجل الجلسات" />
            <ul className="divide-y divide-line">
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
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="احجزي ساعة مكتبية" sub={mentor ? `مع ${mentor.name}` : undefined} />
            <div className="p-5">
              {freeSlots.length ? (
                <>
                  <Field label="موضوع الساعة" htmlFor="oh-topic">
                    <Input id="oh-topic" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="مثال: مراجعة صفحة التسعير" />
                  </Field>
                  <ul className="mt-4 grid grid-cols-2 gap-2">
                    {freeSlots.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          className="flex w-full flex-col items-center rounded-lg border border-line-strong px-3 py-2 text-sm hover:border-navy hover:bg-tint-blue/40"
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
                <p className="text-sm text-slate">لا توجد ساعات متاحة هذا الأسبوع. تُضاف الساعات كل أحد.</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="اطلبي استشارة" sub="قانونية، مالية، تقنية، تسويقية" />
            <form
              className="flex flex-col gap-4 p-5"
              onSubmit={(e) => {
                e.preventDefault()
                if (!clinic.expertId || clinic.topic.trim().length < 5 || !clinic.date) {
                  setClinicError('اختاري الخبير والموعد واكتبي الموضوع.')
                  return
                }
                actions.requestSession({ teamId: team.id, hostId: clinic.expertId, kind: 'clinic', date: clinic.date, time: '13:00', topic: clinic.topic })
                toast('أُرسل طلب الاستشارة إلى الخبير')
                setClinic({ expertId: '', topic: '', date: '' })
                setClinicError('')
              }}
            >
              <Field label="الخبير" htmlFor="cl-expert">
                <Select id="cl-expert" value={clinic.expertId} onChange={(e) => setClinic({ ...clinic, expertId: e.target.value })}>
                  <option value="">اختاري…</option>
                  {experts.map((x) => (
                    <option key={x.id} value={x.id}>{x.name} · {x.title}</option>
                  ))}
                </Select>
              </Field>
              <Field label="الموعد المفضل" htmlFor="cl-date">
                <Input id="cl-date" type="date" min={TODAY} value={clinic.date} onChange={(e) => setClinic({ ...clinic, date: e.target.value })} />
              </Field>
              <Field label="الموضوع" htmlFor="cl-topic" error={clinicError}>
                <Textarea id="cl-topic" className="min-h-20" value={clinic.topic} onChange={(e) => setClinic({ ...clinic, topic: e.target.value })} />
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

/* ───────────── Results ───────────── */

export function ParticipantResults() {
  const team = useMyTeam()
  const { state } = useStore()
  const events = state.events.filter((e) => e.teamIds.includes(team.id)).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHeader title="نتائج التحكيم" />
      <div className="flex flex-col gap-6">
        {events.map((ev) => {
          const stage = STAGE[ev.stage]
          if (!ev.published) {
            return (
              <Card key={ev.id}>
                <CardHeader
                  title={ev.title}
                  sub={<>القادم · <span className="tabular">{fmtDate(ev.date)}</span> · يتأهل <span className="tabular">{ev.capacity}</span> فرق{nextStage(ev.stage) ? ` إلى ${STAGE[nextStage(ev.stage)!].fullName}` : ''}</>}
                  action={<StageBadge stage={ev.stage} />}
                />
                <div className="p-5">
                  <p className="text-sm font-semibold text-navy">معايير بطاقة التقييم</p>
                  <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                    {CRITERIA.map((c) => (
                      <li key={c.id} className="rounded-lg bg-canvas px-4 py-3">
                        <p className="flex justify-between gap-2 font-semibold text-navy">
                          {c.label}
                          <span className="tabular text-slate">{c.weight}%</span>
                        </p>
                        <p className="text-sm text-slate">{c.hint}</p>
                      </li>
                    ))}
                  </ul>
                </div>
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
                <div className="grid gap-6 p-5 md:grid-cols-[12rem_1fr]">
                  <div>
                    <p className="text-sm text-slate">متوسط الدرجة</p>
                    <p className="tabular text-5xl font-bold" style={{ color: stage.ink }}>{mine.average}</p>
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
                        <li key={s.id} className="rounded-lg bg-canvas px-4 py-3 text-sm text-navy">
                          <span className="font-semibold">محكّم {i + 1} · <span className="tabular">{weightedTotal(s.values)}</span>: </span>
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

/* ───────────── Team ───────────── */

export function ParticipantTeam() {
  const team = useMyTeam()
  const { state } = useStore()
  const mentor = byId(state.people, team.mentorId)
  return (
    <>
      <PageHeader title={`فريق ${team.name}`} lede={team.idea} />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader title="الأعضاء" action={<Badge tone="neutral"><Users className="size-3" aria-hidden /><span className="tabular">{team.members.length}</span></Badge>} />
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
          <dl className="grid gap-4">
            <Meta label="المرحلة"><StageBadge stage={team.stage} full /></Meta>
            <Meta label="الفئة">{ENTRY_POINTS[team.entry].label}</Meta>
            <Meta label="القطاع">{team.sector}</Meta>
            <Meta label="الانضمام">{team.joinedVia === 'advanced' ? 'تأهل من المرحلة السابقة' : 'مقعد مفتوح'}</Meta>
            {mentor && <Meta label="المرشدة">{mentor.name}</Meta>}
          </dl>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="اتفاق الفريق" />
          <p className="max-w-[70ch] p-5 leading-loose text-navy">
            {team.charter ?? 'لم يُكتب اتفاق الفريق بعد.'}
          </p>
        </Card>
      </div>
    </>
  )
}
