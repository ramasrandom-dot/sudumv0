import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpCircle, CheckCircle2, Plus } from 'lucide-react'
import { StageBadge } from '@/components/brand'
import { Avatar, Badge, Button, Card, CardHeader, ConfirmAction, EmptyState, Field, Input, PageHeader, Progress, Segmented, Select, Textarea, useToast } from '@/components/ui'
import { ESCALATION_LEVELS, STAGE, STAGES, TODAY, nextStage } from '@/data/program'
import type { Escalation } from '@/data/types'
import { addWorkingDays, fmtDate, fmtDay, relativeDays } from '@/lib/dates'
import { cn } from '@/lib/cn'
import { eventResults } from '@/lib/scoring'
import { useMe, useStore } from '@/store/AppStore'
import { byId } from '@/store/selectors'
import { TimelineChart } from '@/pages/public/Timeline'
import { DateChip, ListRow } from '../shared'

/* ───────────── Judging events ───────────── */

export function AdminJudging() {
  const { state } = useStore()
  return (
    <>
      <PageHeader title="التحكيم وبوابات العبور" lede="لكل بوابة لجنة خارجية وبطاقة تقييم موحدة. تُعلن النتائج بعد اكتمال بطاقات المحكّمين." />
      <ul className="flex flex-col gap-3">
        {state.events.map((ev) => {
          const expected = ev.teamIds.length * ev.judgeIds.length
          const got = state.scores.filter((s) => s.eventId === ev.id).length
          return (
            <li key={ev.id}>
              <Link
                to={`/app/admin/judging/${ev.id}`}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-white p-5 shadow-card transition-[border-color,box-shadow] hover:border-navy/30 hover:shadow-raised"
              >
                <DateChip iso={ev.date} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-bold text-navy">{ev.title}</p>
                    <StageBadge stage={ev.stage} full />
                  </div>
                  <p className="text-sm text-slate">
                    <span className="tabular">{ev.teamIds.length || '—'}</span> فرق · <span className="tabular">{ev.judgeIds.length}</span> محكّمين · يعبر{' '}
                    <span className="tabular">{ev.capacity}</span> · {relativeDays(ev.date)}
                  </p>
                </div>
                {ev.published ? (
                  <Badge tone="green"><CheckCircle2 className="size-3" aria-hidden />أُعلنت النتائج</Badge>
                ) : expected ? (
                  <div className="w-44">
                    <p className="mb-1 text-sm text-slate">
                      بطاقات <span className="tabular font-semibold text-navy">{got}</span> من <span className="tabular">{expected}</span>
                    </p>
                    <Progress value={(got / expected) * 100} color={STAGE[ev.stage].color} label="اكتمال بطاقات التقييم" />
                  </div>
                ) : (
                  <Badge tone="neutral">بانتظار تحديد الفرق</Badge>
                )}
                <ArrowLeft className="size-5 text-slate" aria-hidden />
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export function AdminJudgingEvent() {
  const { eventId } = useParams()
  const { state, actions } = useStore()
  const toast = useToast()
  const ev = byId(state.events, eventId)
  const results = ev ? eventResults(ev, state.scores) : []
  const [selected, setSelected] = useState<string[]>(
    () => ev?.advancedIds ?? results.filter((r) => r.sheets > 0).slice(0, ev?.capacity ?? 0).map((r) => r.teamId),
  )
  if (!ev) return <Navigate to="/app/admin/judging" replace />

  const next = nextStage(ev.stage)
  const toggle = (id: string) =>
    setSelected((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]))
  const expected = ev.teamIds.length * ev.judgeIds.length
  const got = state.scores.filter((s) => s.eventId === ev.id).length

  return (
    <>
      <Link to="/app/admin/judging" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-slate hover:text-navy">
        <ArrowRight className="size-4" aria-hidden />
        التحكيم وبوابات العبور
      </Link>
      <PageHeader
        title={ev.title}
        lede={<><span className="tabular">{fmtDate(ev.date)}</span> · يعبر <span className="tabular">{ev.capacity}</span> {next ? `إلى ${STAGE[next].fullName}` : 'إلى المستثمرين'}</>}
        actions={<StageBadge stage={ev.stage} full />}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <Card>
          <CardHeader
            title="الترتيب"
            sub="متوسط الدرجات الموزونة من بطاقات المحكّمين"
            action={!ev.published && <span className="text-sm text-slate">المحدد للعبور: <span className="tabular font-bold text-navy">{selected.length}</span> / <span className="tabular">{ev.capacity}</span></span>}
          />
          {results.length ? (
            <table className="rtable w-full text-sm">
              <thead>
                <tr className="border-b border-line text-slate">
                  <th className="w-14 px-5 py-2.5 text-start font-semibold">#</th>
                  <th className="px-3 py-2.5 text-start font-semibold">الفريق</th>
                  <th className="px-3 py-2.5 text-start font-semibold">المتوسط</th>
                  <th className="px-3 py-2.5 text-start font-semibold">البطاقات</th>
                  <th className="px-5 py-2.5 text-start font-semibold">العبور</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {results.map((r) => {
                  const t = byId(state.teams, r.teamId)
                  const on = ev.published ? ev.advancedIds?.includes(r.teamId) : selected.includes(r.teamId)
                  return (
                    <tr key={r.teamId} className={cn(on && 'bg-tint-mint/35')}>
                      <td data-label="الترتيب" className="tabular px-5 py-3 font-semibold text-slate">{r.rank}</td>
                      <td data-label="الفريق" className="px-3 py-3">
                        <p className="font-bold text-navy">{t?.name}</p>
                        <p className="text-xs text-slate">{t?.sector}</p>
                      </td>
                      <td data-label="المتوسط" className="px-3 py-3">
                        <div className="flex min-w-32 items-center gap-2">
                          <span className="tabular w-8 font-bold text-navy">{r.sheets ? r.average : '—'}</span>
                          <Progress value={r.average} color={STAGE[ev.stage].color} label={`متوسط ${t?.name}`} />
                        </div>
                      </td>
                      <td data-label="البطاقات" className="tabular px-3 py-3 text-slate">{r.sheets} / {ev.judgeIds.length}</td>
                      <td data-label="العبور" className="px-5 py-3">
                        {ev.published ? (
                          on ? <Badge tone="green">عبر</Badge> : <Badge tone="neutral">لم يعبر</Badge>
                        ) : (
                          <label className="inline-flex cursor-pointer items-center gap-2">
                            <input type="checkbox" className="size-4 accent-navy" checked={on} onChange={() => toggle(r.teamId)} />
                            <span className="text-navy">يعبر</span>
                          </label>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <EmptyState title="لم تُحدَّد فرق هذه البوابة بعد">تُضاف الشركات تلقائيًا عند إعلان نتائج البوابة السابقة.</EmptyState>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="اللجنة" sub={<>بطاقات <span className="tabular">{got}</span> من <span className="tabular">{expected}</span></>} />
            <ul className="divide-y divide-line">
              {ev.judgeIds.map((id) => {
                const j = byId(state.people, id)
                const n = state.scores.filter((s) => s.eventId === ev.id && s.judgeId === id).length
                return (
                  <ListRow key={id} className="py-3">
                    <Avatar name={j?.name ?? ''} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-navy">{j?.name}</p>
                      <Progress value={ev.teamIds.length ? (n / ev.teamIds.length) * 100 : 0} label={`تقدم ${j?.name}`} />
                    </div>
                    <span className="tabular text-xs text-slate">{n}/{ev.teamIds.length}</span>
                  </ListRow>
                )
              })}
            </ul>
          </Card>

          {!ev.published && results.length > 0 && (
            <Card className="p-5">
              <p className="text-sm text-navy">
                عند الإعلان ينتقل <span className="tabular font-bold">{selected.length}</span> فرق إلى {next ? STAGE[next].fullName : 'المستثمرين'}، ويرى كل فريق
                نتيجته وملاحظات المحكّمين.
              </p>
              {got < expected && (
                <p className="mt-2 text-sm font-semibold text-warn">
                  <span className="tabular">{expected - got}</span> بطاقة لم تصل بعد.
                </p>
              )}
              <ConfirmAction
                className="mt-4"
                question={<>إعلان النتائج وعبور <span className="tabular">{selected.length}</span> فرق؟</>}
                confirmLabel="نعم، أعلن"
                onConfirm={() => {
                  actions.publishResults(ev.id, selected)
                  toast('أُعلنت النتائج ووصلت إلى الفرق')
                }}
              >
                {(ask) => (
                  <Button className="mt-4 w-full" disabled={selected.length === 0} onClick={ask}>
                    إعلان النتائج
                  </Button>
                )}
              </ConfirmAction>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

/* ───────────── Escalations ───────────── */

const LEVEL_TONE = { 1: 'blue', 2: 'warn', 3: 'danger' } as const

function EscalationRow({ e }: { e: Escalation }) {
  const { state, actions } = useStore()
  const toast = useToast()
  const [resolving, setResolving] = useState(false)
  const [text, setText] = useState('')
  const lvl = ESCALATION_LEVELS[e.level]
  const due = addWorkingDays(e.at, lvl.days)
  const overdue = e.status === 'open' && due < TODAY
  const team = byId(state.teams, e.teamId)

  return (
    <li className="px-5 py-5">
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
        <Badge tone={LEVEL_TONE[e.level]}>المستوى <span className="tabular">{e.level}</span> · {lvl.label}</Badge>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy">{e.title}</p>
          <p className="text-sm text-slate">
            الجهة: {lvl.owner} · فُتح <span className="tabular">{fmtDay(e.at)}</span> · حد المعالجة <span className="tabular">{fmtDay(due)}</span>
            {team && <> · فريق {team.name}</>}
          </p>
          <p className="mt-2 text-navy/90">{e.detail}</p>
          {e.resolution && <p className="mt-2 rounded-lg bg-tint-mint/50 px-3 py-2 text-sm text-navy"><span className="font-semibold">المعالجة: </span>{e.resolution}</p>}
        </div>
        {e.status === 'open' ? (
          overdue ? <Badge tone="danger">تجاوز الحد</Badge> : <Badge tone="neutral">ضمن الحد</Badge>
        ) : (
          <Badge tone="green">معالَج</Badge>
        )}
      </div>
      {e.status === 'open' && !resolving && (
        <div className="mt-3 flex flex-wrap gap-2 ps-0 sm:ps-28">
          <Button size="sm" variant="secondary" onClick={() => setResolving(true)}>
            <CheckCircle2 className="size-4" aria-hidden />
            تسجيل المعالجة
          </Button>
          {e.level < 3 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                actions.raiseEscalationLevel(e.id)
                toast(`صُعّد إلى ${ESCALATION_LEVELS[(e.level + 1) as 2 | 3].owner}`)
              }}
            >
              <ArrowUpCircle className="size-4" aria-hidden />
              تصعيد للمستوى التالي
            </Button>
          )}
        </div>
      )}
      {resolving && (
        <form
          className="mt-3 flex flex-col gap-3 rounded-lg bg-canvas p-4 sm:ms-28"
          onSubmit={(ev) => {
            ev.preventDefault()
            if (text.trim().length < 5) return
            actions.resolveEscalation(e.id, text.trim())
            toast('سُجّلت المعالجة في السجل الموحد')
          }}
        >
          <Field label="كيف عولج؟" htmlFor={`res-${e.id}`}>
            <Textarea id={`res-${e.id}`} className="min-h-20" value={text} onChange={(x) => setText(x.target.value)} />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" size="sm">حفظ</Button>
            <Button size="sm" variant="ghost" onClick={() => setResolving(false)}>إلغاء</Button>
          </div>
        </form>
      )}
    </li>
  )
}

export function AdminEscalations() {
  const me = useMe()
  const { state, actions } = useStore()
  const toast = useToast()
  const [filter, setFilter] = useState<'open' | 'resolved'>('open')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ level: '1', title: '', detail: '', teamId: '' })
  const [error, setError] = useState('')
  const list = state.escalations.filter((e) => e.status === filter)
  const activeTeams = state.teams.filter((t) => t.status === 'active')

  return (
    <>
      <PageHeader
        title="مصفوفة التصعيد"
        lede="يُتخذ القرار عند المستوى المختص ويُوثَّق في سجل موحّد. ما لا يُعالج في حدّه الزمني يُرفع إلى المستوى التالي."
        actions={!adding && <Button onClick={() => setAdding(true)}><Plus className="size-4" aria-hidden />تسجيل تحدٍّ</Button>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {([1, 2, 3] as const).map((l) => (
          <div key={l} className="rounded-xl border border-line bg-white p-4 shadow-card">
            <p className="text-sm text-slate">المستوى <span className="tabular">{l}</span> · {ESCALATION_LEVELS[l].label}</p>
            <p className="font-bold text-navy">{ESCALATION_LEVELS[l].owner}</p>
            <p className="text-sm text-slate">حد المعالجة <span className="tabular">{ESCALATION_LEVELS[l].days}</span> أيام عمل</p>
          </div>
        ))}
      </div>

      {adding && (
        <Card className="mb-6">
          <CardHeader title="تحدٍّ جديد" />
          <form
            className="grid gap-4 p-5 md:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (form.title.trim().length < 5 || form.detail.trim().length < 10) {
                setError('اكتب عنوانًا ووصفًا واضحًا للتحدي.')
                return
              }
              actions.addEscalation({ level: Number(form.level) as 1 | 2 | 3, title: form.title, detail: form.detail, teamId: form.teamId || undefined, raisedBy: me.id })
              toast('سُجّل التحدي وأُبلغت الجهة المسؤولة')
              setForm({ level: '1', title: '', detail: '', teamId: '' })
              setAdding(false)
              setError('')
              setFilter('open')
            }}
          >
            <Field label="المستوى" htmlFor="esc-level">
              <Select id="esc-level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                {([1, 2, 3] as const).map((l) => <option key={l} value={l}>المستوى {l} · {ESCALATION_LEVELS[l].label} · {ESCALATION_LEVELS[l].owner}</option>)}
              </Select>
            </Field>
            <Field label="الفريق (اختياري)" htmlFor="esc-team">
              <Select id="esc-team" value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })}>
                <option value="">لا يخص فريقًا</option>
                {activeTeams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="العنوان" htmlFor="esc-title">
                <Input id="esc-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="الوصف" htmlFor="esc-detail" error={error}>
                <Textarea id="esc-detail" value={form.detail} onChange={(e) => setForm({ ...form, detail: e.target.value })} />
              </Field>
            </div>
            <div className="flex gap-2 md:col-span-2">
              <Button type="submit">تسجيل</Button>
              <Button variant="ghost" onClick={() => setAdding(false)}>إلغاء</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mb-4">
        <Segmented
          label="الحالة"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'open', label: 'مفتوحة', count: state.escalations.filter((e) => e.status === 'open').length },
            { value: 'resolved', label: 'معالَجة', count: state.escalations.filter((e) => e.status === 'resolved').length },
          ]}
        />
      </div>
      <Card>
        {list.length ? <ul className="divide-y divide-line">{list.map((e) => <EscalationRow key={e.id} e={e} />)}</ul> : <EmptyState title="لا تحديات في هذه الحالة" />}
      </Card>
    </>
  )
}

/* ───────────── Timeline ───────────── */

export function AdminTimeline() {
  const { state } = useStore()
  const upcoming = [
    ...STAGES.map((s) => ({ date: s.gateDate, title: s.gate, sub: s.fullName, stage: s.id })),
    ...state.workshops.map((w) => ({ date: w.date, title: w.title, sub: `ورشة الأسبوع ${w.week}`, stage: w.stage })),
  ]
    .filter((x) => x.date >= TODAY)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 10)
  return (
    <>
      <PageHeader title="الجدول الزمني" lede="33 أسبوعًا من البرنامج على امتداد 2027، مع بوابات العبور والتوقفات." />
      <Card className="p-5">
        <TimelineChart today={TODAY} />
      </Card>
      <Card className="mt-6">
        <CardHeader title="المحطات القادمة" />
        <ul className="divide-y divide-line">
          {upcoming.map((x) => (
            <ListRow key={x.date + x.title}>
              <DateChip iso={x.date} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy">{x.title}</p>
                <p className="text-sm text-slate">{x.sub}</p>
              </div>
              <StageBadge stage={x.stage} />
            </ListRow>
          ))}
        </ul>
      </Card>
    </>
  )
}
