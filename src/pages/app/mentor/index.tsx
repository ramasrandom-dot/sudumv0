import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Check, ClipboardCheck, ExternalLink, Plus, Trash2, Undo2 } from 'lucide-react'
import { StageBadge } from '@/components/brand'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Field, Input, Meta, PageHeader, Progress, Select, Textarea, useToast } from '@/components/ui'
import { ENTRY_POINTS, ROLE_COLOR, ROLE_LABEL, STAGE, TODAY } from '@/data/program'
import type { Milestone, Team } from '@/data/types'
import { fmtDay } from '@/lib/dates'
import { firstName } from '@/lib/cn'
import { useMe, useStore } from '@/store/AppStore'
import { byId, isOverdue, milestoneProgress, stageWeek, teamMilestones, teamsOf } from '@/store/selectors'
import { Count, DateChip, Hero, ListRow, MilestoneBadge, NextStep, Rel, SectionTitle, SessionBadge, sessionKind } from '../shared'

/* ───────────── Review widget (shared with the reviews queue) ───────────── */

function ReviewMilestone({ m, team }: { m: Milestone; team?: Team }) {
  const { actions } = useStore()
  const toast = useToast()
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const decide = (status: 'approved' | 'changes') => {
    if (status === 'changes' && feedback.trim().length < 8) {
      setError('اكتب للفريق ما المطلوب تعديله.')
      return
    }
    actions.reviewMilestone(m.id, status, feedback.trim() || 'معتمد.')
    toast(status === 'approved' ? `اعتُمدت مهمة «${m.title}»` : 'أُعيدت المهمة للفريق مع ملاحظاتك')
  }
  return (
    <li className="px-5 py-5">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1">
          {team && <p className="text-sm font-semibold text-blue-ink">{team.name}</p>}
          <p className="font-semibold text-navy">{m.title}</p>
          <p className="text-sm text-slate">
            سُلّم <span className="tabular">{m.submission ? fmtDay(m.submission.at) : ''}</span> · موعده{' '}
            <span className="tabular">{fmtDay(m.due)}</span>
          </p>
        </div>
        <MilestoneBadge m={m} />
      </div>
      {m.submission && (
        <div className="mt-3 rounded-lg bg-canvas p-4 text-sm">
          <a href={m.submission.link} target="_blank" rel="noreferrer" dir="ltr" className="inline-flex items-center gap-1 text-blue-ink hover:underline">
            <ExternalLink className="size-3.5" aria-hidden />
            {m.submission.link.replace(/^https?:\/\//, '')}
          </a>
          {m.submission.note && <p className="mt-2 text-navy">{m.submission.note}</p>}
        </div>
      )}
      <div className="mt-4 flex flex-col gap-3">
        <Field label="ملاحظاتك للفريق" htmlFor={`fb-${m.id}`} error={error}>
          <Textarea
            id={`fb-${m.id}`}
            className="min-h-20"
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value)
              setError('')
            }}
            aria-invalid={!!error}
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => decide('approved')}>
            <Check className="size-4" aria-hidden />
            اعتماد
          </Button>
          <Button variant="secondary" onClick={() => decide('changes')}>
            <Undo2 className="size-4" aria-hidden />
            طلب تعديل
          </Button>
        </div>
      </div>
    </li>
  )
}

/* ───────────── My teams ───────────── */

export function MentorTeams() {
  const me = useMe()
  const { state } = useStore()
  const teams = teamsOf(state, me)
  const queue = state.milestones
    .filter((m) => m.status === 'submitted' && teams.some((t) => t.id === m.teamId))
    .sort((a, b) => a.due.localeCompare(b.due))
  const dates = state.sessions
    .filter((s) => s.hostId === me.id && s.status === 'scheduled' && s.date >= TODAY)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const week = stageWeek('tamkeen')
  const tone = ROLE_COLOR.mentor

  return (
    <>
      <Hero
        tag={ROLE_LABEL.mentor}
        color={tone.color}
        on={tone.on}
        hello={`أهلًا ${firstName(me.name)}`}
        line={
          <>
            <span className="tabular">{teams.length}</span> فرق · تمكين، الأسبوع <span className="tabular">{week}</span> من <span className="tabular">12</span>
          </>
        }
      >
        <NextStep
          icon={ClipboardCheck}
          title={queue.length ? <><span className="tabular">{queue.length}</span> مهام بانتظار اعتمادك</> : 'لا شيء بانتظارك الآن'}
          hint={queue.length ? 'اعتمدها أو أعدها للفريق بملاحظة.' : 'تظهر هنا تسليمات فرقك الجديدة.'}
          action={
            queue.length > 0 && (
              <Button size="lg" onClick={() => document.getElementById('queue')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                ابدأ الاعتماد
              </Button>
            )
          }
        />
      </Hero>

      <SectionTitle>
        <span id="queue" className="scroll-mt-24">
          بانتظارك <Count n={queue.length} />
        </span>
      </SectionTitle>
      <Card>
        {queue.length ? (
          <ul className="divide-y divide-line">
            {queue.map((m) => (
              <ReviewMilestone key={m.id} m={m} team={byId(state.teams, m.teamId)} />
            ))}
          </ul>
        ) : (
          <EmptyState title="لا شيء بانتظارك الآن">تظهر هنا تسليمات فرقك عند وصولها.</EmptyState>
        )}
      </Card>

      <SectionTitle
        action={
          <Link to="/app/mentor/dates" className="text-sm font-semibold text-blue-ink hover:underline">
            كل المواعيد
          </Link>
        }
      >
        مواعيدك القادمة <Count n={dates.length} />
      </SectionTitle>
      <Card>
        {dates.length ? (
          <ul className="divide-y divide-line">
            {dates.slice(0, 3).map((s) => (
              <ListRow key={s.id}>
                <DateChip iso={s.date} time={s.time} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{s.topic}</p>
                  <p className="text-sm text-slate">
                    فريق {byId(state.teams, s.teamId)?.name} · {sessionKind(s.kind)}
                  </p>
                </div>
                <Rel iso={s.date} />
              </ListRow>
            ))}
          </ul>
        ) : (
          <EmptyState title="لا مواعيد قادمة" />
        )}
      </Card>

      <SectionTitle>
        فرقك <Count n={teams.length} />
      </SectionTitle>
      {teams.length === 0 ? (
        <Card><EmptyState title="لم تُسند إليك فرق بعد" /></Card>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {teams.map((t) => {
            const ms = teamMilestones(state, t.id)
            const p = milestoneProgress(ms)
            const waiting = ms.filter((m) => m.status === 'submitted').length
            const late = ms.filter(isOverdue).length
            const next = dates.find((s) => s.teamId === t.id)
            return (
              <li key={t.id}>
                <Link
                  to={`/app/mentor/teams/${t.id}`}
                  className="flex h-full flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition-[border-color,box-shadow] duration-200 hover:border-navy/30 hover:shadow-raised"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-lg font-bold text-navy">{t.name}</p>
                      <p className="line-clamp-2 text-sm text-slate">{t.idea}</p>
                    </div>
                    <StageBadge stage={t.stage} />
                  </div>
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span className="text-slate">المهام المعتمدة</span>
                      <span className="tabular font-semibold text-navy">{p.approved} / {p.total}</span>
                    </div>
                    <Progress value={p.pct} color={STAGE[t.stage].color} label={`مهام ${t.name}`} />
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-2 text-sm">
                    {waiting > 0 && <Badge tone="blue"><span className="tabular">{waiting}</span> بانتظار الاعتماد</Badge>}
                    {late > 0 && <Badge tone="danger"><span className="tabular">{late}</span> متأخر</Badge>}
                    <span className="ms-auto text-slate">
                      {next ? <>الجلسة القادمة <span className="tabular">{fmtDay(next.date)}</span></> : 'لا جلسة مجدولة'}
                    </span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

/* ───────────── Team detail ───────────── */

export function MentorTeamDetail() {
  const { teamId } = useParams()
  const me = useMe()
  const { state, actions } = useStore()
  const toast = useToast()
  const team = byId(state.teams, teamId)
  const [form, setForm] = useState({ date: TODAY, topic: '', notes: '' })
  const [error, setError] = useState('')
  if (!team) return <Navigate to="/app/mentor" replace />

  const ms = teamMilestones(state, team.id)
  const sessions = state.sessions.filter((s) => s.teamId === team.id).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <Link to="/app/mentor" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate hover:text-navy">
        <ArrowRight className="size-4" aria-hidden />
        فرقي
      </Link>
      <PageHeader title={team.name} lede={team.idea} actions={<StageBadge stage={team.stage} full />} />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="المهام" />
            <ul className="divide-y divide-line">
              {ms.map((m) =>
                m.status === 'submitted' ? (
                  <ReviewMilestone key={m.id} m={m} />
                ) : (
                  <ListRow key={m.id}>
                    <span className="tabular w-16 shrink-0 text-sm text-slate">أسبوع {m.week}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-navy">{m.title}</p>
                      {m.feedback && <p className="text-sm text-slate">{m.feedback}</p>}
                    </div>
                    <MilestoneBadge m={m} />
                  </ListRow>
                ),
              )}
            </ul>
          </Card>

          <Card>
            <CardHeader title="سجّل جلسة" />
            <form
              className="grid gap-4 p-5 sm:grid-cols-[10rem_1fr]"
              onSubmit={(e) => {
                e.preventDefault()
                if (form.topic.trim().length < 3 || form.notes.trim().length < 8) {
                  setError('اكتب موضوع الجلسة وملخصًا لما اتفقتم عليه.')
                  return
                }
                actions.logSession({ teamId: team.id, hostId: me.id, kind: 'mentoring', date: form.date, time: '10:00', topic: form.topic, notes: form.notes })
                toast('سُجّلت الجلسة')
                setForm({ date: TODAY, topic: '', notes: '' })
                setError('')
              }}
            >
              <Field label="التاريخ" htmlFor="ls-date">
                <Input id="ls-date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </Field>
              <Field label="الموضوع" htmlFor="ls-topic">
                <Input id="ls-topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="ما اتفقتم عليه" htmlFor="ls-notes" error={error}>
                  <Textarea id="ls-notes" className="min-h-20" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Button type="submit">حفظ الجلسة</Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-5">
            <dl className="grid grid-cols-2 gap-4">
              <Meta label="مستخدمون"><span className="tabular">{team.metrics?.users ?? 0}</span></Meta>
              <Meta label="مقابلات"><span className="tabular">{team.metrics?.interviews ?? 0}</span></Meta>
              <Meta label="القطاع">{team.sector}</Meta>
              <Meta label="الفئة">{ENTRY_POINTS[team.entry].label}</Meta>
            </dl>
          </Card>
          <Card>
            <CardHeader title="الفريق" />
            <ul className="divide-y divide-line">
              {team.members.map((m) => (
                <ListRow key={m.name}>
                  <Avatar name={m.name} size="sm" />
                  <span className="flex-1 font-semibold text-navy">{m.name}</span>
                  <span className="text-sm text-slate">{m.role}</span>
                </ListRow>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="الجلسات" />
            <ul className="divide-y divide-line">
              {sessions.map((s) => (
                <li key={s.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-slate">
                      <span className="tabular">{fmtDay(s.date)}</span> · {sessionKind(s.kind)}
                    </p>
                    <SessionBadge s={s} />
                  </div>
                  <p className="font-semibold text-navy">{s.topic}</p>
                  {s.notes && <p className="text-sm text-navy/80">{s.notes}</p>}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}

/* ───────────── Sessions ───────────── */

export function MentorDates() {
  const me = useMe()
  const { state } = useStore()
  const mine = state.sessions.filter((s) => s.hostId === me.id)
  const upcoming = mine.filter((s) => s.status === 'scheduled' && s.date >= TODAY).sort((a, b) => a.date.localeCompare(b.date))
  const past = mine.filter((s) => s.status === 'done').sort((a, b) => b.date.localeCompare(a.date))
  const Row = ({ s }: { s: (typeof mine)[number] }) => {
    const team = byId(state.teams, s.teamId)
    return (
      <ListRow>
        <DateChip iso={s.date} time={s.time} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy">{s.topic}</p>
          <p className="text-sm text-slate">
            {team && <Link className="font-semibold text-blue-ink hover:underline" to={`/app/mentor/teams/${team.id}`}>{team.name}</Link>} · {sessionKind(s.kind)}
          </p>
          {s.notes && <p className="mt-1 text-sm text-navy/80">{s.notes}</p>}
        </div>
        <Rel iso={s.date} />
      </ListRow>
    )
  }
  return (
    <>
      <PageHeader title="مواعيدي" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="القادمة" />
          {upcoming.length ? <ul className="divide-y divide-line">{upcoming.map((s) => <Row key={s.id} s={s} />)}</ul> : <EmptyState title="لا جلسات قادمة" />}
        </Card>
        <Card>
          <CardHeader title="المنعقدة" />
          {past.length ? <ul className="divide-y divide-line">{past.map((s) => <Row key={s.id} s={s} />)}</ul> : <EmptyState title="لا جلسات بعد" />}
        </Card>
      </div>
      <MentorHours />
    </>
  )
}

/* ───────────── Office hours ───────────── */

function MentorHours() {
  const me = useMe()
  const { state, actions } = useStore()
  const toast = useToast()
  const slots = state.slots.filter((s) => s.hostId === me.id).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const [date, setDate] = useState('2027-06-20')
  const [time, setTime] = useState('09:00')

  return (
    <>
      <SectionTitle>الساعات المكتبية</SectionTitle>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="مواعيدك" />
          {slots.length ? (
            <ul className="divide-y divide-line">
              {slots.map((s) => {
                const team = byId(state.teams, s.bookedBy)
                return (
                  <ListRow key={s.id}>
                    <DateChip iso={s.date} time={s.time} />
                    <div className="flex-1">
                      {team ? (
                        <p className="font-semibold text-navy">محجوز لفريق {team.name}</p>
                      ) : (
                        <p className="text-slate">متاح</p>
                      )}
                    </div>
                    {team ? (
                      <Badge tone="green">محجوز</Badge>
                    ) : (
                      <Button size="sm" variant="ghost" aria-label="حذف الموعد" onClick={() => actions.removeSlot(s.id)}>
                        <Trash2 className="size-4" aria-hidden />
                        حذف
                      </Button>
                    )}
                  </ListRow>
                )
              })}
            </ul>
          ) : (
            <EmptyState title="لا مواعيد بعد">أضف أول موعد من النموذج المجاور.</EmptyState>
          )}
        </Card>
        <Card>
          <CardHeader title="أضف موعدًا" />
          <form
            className="flex flex-col gap-4 p-5"
            onSubmit={(e) => {
              e.preventDefault()
              actions.addSlot(me.id, date, time)
              toast(`أُضيف موعد ${fmtDay(date)} الساعة ${time}`)
            }}
          >
            <Field label="اليوم" htmlFor="slot-date">
              <Input id="slot-date" type="date" min={TODAY} value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <Field label="الوقت" htmlFor="slot-time">
              <Select id="slot-time" value={time} onChange={(e) => setTime(e.target.value)}>
                {['09:00', '09:30', '10:00', '10:30', '11:00', '12:00', '13:00', '13:30', '14:00'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </Field>
            <Button type="submit">
              <Plus className="size-4" aria-hidden />
              إضافة
            </Button>
          </form>
        </Card>
      </div>
    </>
  )
}
