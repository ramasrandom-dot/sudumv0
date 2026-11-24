import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Check, ChevronDown, X } from 'lucide-react'
import { StageBadge, Star } from '@/components/brand'
import { Avatar, Badge, Button, Card, CardHeader, EmptyState, Field, PageHeader, Progress, Segmented, Select, Textarea, useToast } from '@/components/ui'
import { ENTRY_POINTS, ESCALATION_LEVELS, STAGE, STAGES, TODAY, TRACKS } from '@/data/program'
import type { Application, ApplicationStatus, Role } from '@/data/types'
import { addWorkingDays, daysFromToday, fmtDate, fmtDay } from '@/lib/dates'
import { cn } from '@/lib/cn'
import { useStore } from '@/store/AppStore'
import { byId, isOverdue, milestoneProgress, peopleByRole, stageWeek, teamMilestones } from '@/store/selectors'
import { DateChip, ListRow, Rel, Stat, sessionKind } from '../shared'

/* ───────────── Dashboard ───────────── */

const FUNNEL = [
  { label: 'مسجّلات في الإلهام', n: 500, color: '#2086C2' },
  { label: 'مختبر الأفكار', n: 80, color: '#2086C2' },
  { label: 'فرق تكوين', n: 25, color: '#39B67E' },
  { label: 'فرق تمكين', n: 15, color: '#00535C' },
  { label: 'شركات سنام (مستهدف)', n: 8, color: '#090E3B' },
]

export function AdminDashboard() {
  const { state } = useStore()
  const active = state.teams.filter((t) => t.status === 'active')
  const stage = STAGE.tamkeen
  const week = stageWeek('tamkeen')
  const awaiting = state.milestones.filter((m) => m.status === 'submitted').length
  const newApps = state.applications.filter((a) => a.status === 'new').length
  const openEsc = state.escalations.filter((e) => e.status === 'open')
  const overdueEsc = openEsc.filter((e) => addWorkingDays(e.at, ESCALATION_LEVELS[e.level].days) < TODAY).length
  const newNoms = state.nominations.filter((n) => n.status === 'new').length

  const atRisk = active
    .map((t) => {
      const ms = teamMilestones(state, t.id)
      const late = ms.filter(isOverdue)
      const changes = ms.filter((m) => m.status === 'changes' && !isOverdue(m))
      return { t, late, changes }
    })
    .filter((x) => x.late.length || x.changes.length)

  const allMs = state.milestones.filter((m) => active.some((t) => t.id === m.teamId))
  const progress = milestoneProgress(allMs)
  const mentors = peopleByRole(state, 'mentor')
  const weekAhead = [
    ...state.workshops.filter((w) => w.date >= TODAY && daysFromToday(w.date) <= 14).map((w) => ({ id: w.id, date: w.date, title: w.title, sub: `ورشة · ${STAGE[w.stage].fullName}` })),
    ...state.sessions
      .filter((s) => s.status === 'scheduled' && s.date >= TODAY && daysFromToday(s.date) <= 7)
      .map((s) => ({ id: s.id, date: s.date, title: s.topic, sub: `${sessionKind(s.kind)} · ${byId(state.teams, s.teamId)?.name}` })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  const max = FUNNEL[0].n

  return (
    <>
      <PageHeader
        title="لوحة المؤشرات"
        lede={<>الدفعة الأولى 2027 · {stage.fullName}، الأسبوع <span className="tabular">{week}</span> من <span className="tabular">{stage.weeks}</span></>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="فرق نشطة في تمكين" value={active.length} note={<>يتأهل <span className="tabular">5</span> منها إلى سنام</>} accent={stage.ink} />
        <Stat label="مهام بانتظار المرشدين" value={awaiting} />
        <Stat label="طلبات تقديم جديدة" value={newApps} note={<Link className="text-blue-ink hover:underline" to="/app/admin/applications">مراجعة الطلبات</Link>} />
        <Stat
          label="تحديات مفتوحة"
          value={openEsc.length}
          note={overdueEsc ? <span className="font-semibold text-danger"><span className="tabular">{overdueEsc}</span> تجاوز حد المعالجة</span> : 'ضمن حدود المعالجة'}
          accent={overdueEsc ? '#B42335' : undefined}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader title="رحلة الدفعة" />
          <ul className="flex flex-col gap-4 p-5">
            {FUNNEL.map((f) => (
              <li key={f.label} className="grid grid-cols-[minmax(0,9.5rem)_1fr_3rem] items-center gap-3 text-sm">
                <span className="text-navy">{f.label}</span>
                <span className="h-6 overflow-hidden rounded-md bg-canvas">
                  <span className="block h-full rounded-md" style={{ width: `${Math.max((f.n / max) * 100, 1.5)}%`, background: f.color }} />
                </span>
                <span className="tabular text-end font-bold text-navy">{f.n}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title={`${stage.fullName}: يوم التحكيم`} sub={<span className="tabular">{fmtDate(stage.gateDate)}</span>} action={<StageBadge stage="tamkeen" solid />} />
          <div className="flex flex-1 flex-col justify-between gap-5 p-5">
            <p className="tabular text-5xl font-bold" style={{ color: stage.ink }}>
              {daysFromToday(stage.gateDate)}
              <span className="ms-2 text-base font-normal text-slate">يومًا متبقيًا</span>
            </p>
            <div>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-slate">المهام المعتمدة</span>
                <span className="tabular font-semibold text-navy">{progress.approved} / {progress.total}</span>
              </div>
              <Progress value={progress.pct} color={stage.color} label="المهام المعتمدة" />
            </div>
            <Link to="/app/admin/judging" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-ink hover:underline">
              إعداد يوم التحكيم
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="فرق تحتاج متابعة" />
          {atRisk.length ? (
            <ul className="divide-y divide-line">
              {atRisk.map(({ t, late, changes }) => (
                <ListRow key={t.id}>
                  <AlertTriangle className={cn('size-4 shrink-0', late.length ? 'text-danger' : 'text-warn')} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy">{t.name}</p>
                    <p className="truncate text-sm text-slate">{[...late, ...changes][0]?.title}</p>
                  </div>
                  {late.length > 0 && <Badge tone="danger"><span className="tabular">{late.length}</span> متأخر</Badge>}
                  {changes.length > 0 && <Badge tone="warn"><span className="tabular">{changes.length}</span> للتعديل</Badge>}
                  <span className="text-sm text-slate">{byId(state.people, t.mentorId)?.name}</span>
                </ListRow>
              ))}
            </ul>
          ) : (
            <EmptyState title="كل الفرق في موعدها" />
          )}
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader title="الأسبوعان القادمان" />
            <ul className="divide-y divide-line">
              {weekAhead.slice(0, 6).map((x) => (
                <ListRow key={x.id}>
                  <DateChip iso={x.date} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-navy">{x.title}</p>
                    <p className="truncate text-xs text-slate">{x.sub}</p>
                  </div>
                </ListRow>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader
              title="أحمال المرشدين"
              action={newNoms > 0 && <Link to="/app/admin/people" className="text-sm font-semibold text-blue-ink hover:underline"><span className="tabular">{newNoms}</span> طلبات انضمام</Link>}
            />
            <ul className="divide-y divide-line">
              {mentors.map((m) => {
                const n = active.filter((t) => t.mentorId === m.id).length
                return (
                  <ListRow key={m.id} className="py-3">
                    <Avatar name={m.name} size="sm" />
                    <span className="flex-1 text-sm font-semibold text-navy">{m.name}</span>
                    <span className={cn('tabular text-sm', n > 3 ? 'font-bold text-warn' : 'text-slate')}>{n} فرق</span>
                  </ListRow>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>
    </>
  )
}

/* ───────────── Applications ───────────── */

const APP_STATUS: Record<ApplicationStatus, { label: string; tone: 'warn' | 'blue' | 'green' | 'neutral' }> = {
  new: { label: 'جديد', tone: 'warn' },
  interview: { label: 'مقابلة فرز', tone: 'blue' },
  accepted: { label: 'مقبول', tone: 'green' },
  declined: { label: 'معتذر عنه', tone: 'neutral' },
}

function ApplicationRow({ a }: { a: Application }) {
  const { actions } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(a.note ?? '')
  const decide = (status: ApplicationStatus, msg: string) => {
    actions.reviewApplication(a.id, status, note.trim() || undefined)
    toast(msg)
  }
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-start hover:bg-canvas/60"
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy">
            {a.leadName}
            {a.teamName && <span className="font-normal text-slate"> · {a.teamName}</span>}
          </p>
          <p className="truncate text-sm text-slate">{a.problem}</p>
        </div>
        <Badge tone="neutral">{TRACKS[a.track].label}</Badge>
        <Badge tone={APP_STATUS[a.status].tone}>{APP_STATUS[a.status].label}</Badge>
        <span className="tabular w-20 text-sm text-slate">{fmtDay(a.at)}</span>
        <ChevronDown className={cn('size-4 text-slate transition-transform', open && 'rotate-180')} aria-hidden />
      </button>
      {open && (
        <div className="grid gap-6 border-t border-line bg-canvas/50 px-5 py-5 md:grid-cols-[1.3fr_1fr]">
          <dl className="grid gap-3 text-sm">
            <div><dt className="text-slate">الفئة</dt><dd className="text-navy">{ENTRY_POINTS[a.entry].label}</dd></div>
            <div><dt className="text-slate">الكلية أو الجهة</dt><dd className="text-navy">{a.college}</dd></div>
            <div><dt className="text-slate">المشكلة</dt><dd className="text-navy">{a.problem}</dd></div>
            <div><dt className="text-slate">الفكرة</dt><dd className="text-navy">{a.idea}</dd></div>
            <div className="flex flex-wrap gap-x-6">
              <div><dt className="text-slate">البريد</dt><dd className="text-navy" dir="ltr">{a.email}</dd></div>
              <div><dt className="text-slate">الجوال</dt><dd className="tabular text-navy" dir="ltr">{a.phone}</dd></div>
              <div><dt className="text-slate">حجم الفريق</dt><dd className="tabular text-navy">{a.teamSize}</dd></div>
            </div>
          </dl>
          <div className="flex flex-col gap-3">
            <Field label="ملاحظة القرار" htmlFor={`an-${a.id}`} hint="تُحفظ في سجل الطلب">
              <Textarea id={`an-${a.id}`} className="min-h-20" value={note} onChange={(e) => setNote(e.target.value)} />
            </Field>
            <div className="flex flex-wrap gap-2">
              {a.status === 'new' && <Button size="sm" onClick={() => decide('interview', `دُعيت ${a.leadName} لمقابلة القبول`)}>دعوة لمقابلة القبول</Button>}
              {a.status !== 'accepted' && <Button size="sm" variant="secondary" onClick={() => decide('accepted', `قُبل طلب ${a.leadName}`)}><Check className="size-4" aria-hidden />قبول</Button>}
              {a.status !== 'declined' && <Button size="sm" variant="ghost" onClick={() => decide('declined', 'سُجّل الاعتذار')}><X className="size-4" aria-hidden />اعتذار</Button>}
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

export function AdminApplications() {
  const { state } = useStore()
  const [status, setStatus] = useState<ApplicationStatus | 'all'>('new')
  const list = state.applications.filter((a) => status === 'all' || a.status === status)
  const count = (s: ApplicationStatus) => state.applications.filter((a) => a.status === s).length
  return (
    <>
      <PageHeader title="طلبات التقديم" />
      <div className="mb-4">
        <Segmented
          label="حالة الطلب"
          value={status}
          onChange={setStatus}
          options={[
            { value: 'new', label: 'جديدة', count: count('new') },
            { value: 'interview', label: 'مقابلة', count: count('interview') },
            { value: 'accepted', label: 'مقبولة', count: count('accepted') },
            { value: 'declined', label: 'معتذر عنها', count: count('declined') },
            { value: 'all', label: 'الكل', count: state.applications.length },
          ]}
        />
      </div>
      <Card>
        {list.length ? <ul className="divide-y divide-line">{list.map((a) => <ApplicationRow key={a.id} a={a} />)}</ul> : <EmptyState title="لا طلبات في هذه الحالة" />}
      </Card>
    </>
  )
}

/* ───────────── Teams ───────────── */

export function AdminTeams() {
  const { state, actions } = useStore()
  const toast = useToast()
  const [filter, setFilter] = useState<'active' | 'exited' | 'all'>('active')
  const mentors = peopleByRole(state, 'mentor')
  const list = state.teams.filter((t) => filter === 'all' || (filter === 'active' ? t.status === 'active' : t.status !== 'active'))

  return (
    <>
      <PageHeader title="الفرق" />
      <div className="mb-4">
        <Segmented
          label="تصفية الفرق"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'active', label: 'النشطة', count: state.teams.filter((t) => t.status === 'active').length },
            { value: 'exited', label: 'لم تتأهل', count: state.teams.filter((t) => t.status !== 'active').length },
            { value: 'all', label: 'الكل', count: state.teams.length },
          ]}
        />
      </div>
      <Card>
        <table className="rtable w-full text-sm">
          <thead>
            <tr className="border-b border-line text-slate">
              <th className="px-5 py-3 text-start font-semibold">الفريق</th>
              <th className="px-3 py-3 text-start font-semibold">المرحلة</th>
              <th className="px-3 py-3 text-start font-semibold">المرشد</th>
              <th className="px-3 py-3 text-start font-semibold">المهام</th>
              <th className="px-3 py-3 text-start font-semibold">مستخدمون</th>
              <th className="px-5 py-3 text-start font-semibold">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((t) => {
              const ms = teamMilestones(state, t.id)
              const p = milestoneProgress(ms)
              const late = ms.filter(isOverdue).length
              return (
                <tr key={t.id} className="hover:bg-canvas/50">
                  <td data-label="الفريق" className="px-5 py-3">
                    <p className="font-bold text-navy">{t.name}</p>
                    <p className="text-xs text-slate">{t.sector} · {t.joinedVia === 'open-seat' ? 'مقعد مفتوح' : 'متأهل'}</p>
                  </td>
                  <td data-label="المرحلة" className="px-3 py-3"><StageBadge stage={t.stage} /></td>
                  <td data-label="المرشد" className="px-3 py-3">
                    {t.status === 'active' ? (
                      <Select
                        aria-label={`مرشد فريق ${t.name}`}
                        className="h-9 min-w-40 text-sm"
                        value={t.mentorId ?? ''}
                        onChange={(e) => {
                          actions.assignMentor(t.id, e.target.value)
                          toast(`أُسند فريق ${t.name} إلى ${byId(state.people, e.target.value)?.name}`)
                        }}
                      >
                        <option value="" disabled>اختر…</option>
                        {mentors.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </Select>
                    ) : (
                      <span className="text-slate">—</span>
                    )}
                  </td>
                  <td data-label="المهام" className="px-3 py-3">
                    {ms.length ? (
                      <div className="flex min-w-28 items-center gap-2">
                        <Progress value={p.pct} color={STAGE[t.stage].color} label={`مهام ${t.name}`} />
                        <span className="tabular text-xs text-slate">{p.approved}/{p.total}</span>
                        {late > 0 && <Badge tone="danger"><span className="tabular">{late}</span></Badge>}
                      </div>
                    ) : <span className="text-slate">—</span>}
                  </td>
                  <td data-label="مستخدمون" className="tabular px-3 py-3 text-navy">{t.metrics?.users ?? '—'}</td>
                  <td data-label="الحالة" className="px-5 py-3">
                    {t.status === 'active' ? <Badge tone="green">نشط</Badge> : t.status === 'graduated' ? <Badge tone="navy">متخرج</Badge> : <Badge tone="neutral">لم يتأهل من {STAGE[t.stage].name}</Badge>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>
    </>
  )
}

/* ───────────── Workshops ───────────── */

export function AdminWorkshops() {
  const { state, actions } = useStore()
  const toast = useToast()
  const experts = peopleByRole(state, 'expert')
  const unassigned = state.workshops.filter((w) => !w.expertId && w.date >= TODAY).length
  return (
    <>
      <PageHeader
        title="الورش"
        lede={unassigned > 0 ? <span className="font-semibold text-warn">ورش قادمة بلا خبير: <span className="tabular">{unassigned}</span></span> : undefined}
      />
      <div className="flex flex-col gap-6">
        {STAGES.map((s) => (
          <Card key={s.id}>
            <CardHeader title={<span className="flex items-center gap-2"><Star className="size-4" color={s.color} />{s.fullName}</span>} />
            <table className="rtable w-full text-sm">
              <thead>
                <tr className="border-b border-line text-slate">
                  <th className="w-20 px-5 py-2.5 text-start font-semibold">الأسبوع</th>
                  <th className="px-3 py-2.5 text-start font-semibold">الورشة</th>
                  <th className="px-3 py-2.5 text-start font-semibold">التاريخ</th>
                  <th className="px-3 py-2.5 text-start font-semibold">الخبير</th>
                  <th className="px-5 py-2.5 text-start font-semibold">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {state.workshops.filter((w) => w.stage === s.id).map((w) => {
                  const past = w.date < TODAY
                  return (
                    <tr key={w.id}>
                      <td data-label="الأسبوع" className="tabular px-5 py-3 text-slate">{w.week}</td>
                      <td data-label="الورشة" className="px-3 py-3 font-semibold text-navy">{w.title}</td>
                      <td data-label="التاريخ" className="tabular px-3 py-3 whitespace-nowrap text-slate">{fmtDay(w.date)}</td>
                      <td data-label="الخبير" className="px-3 py-3">
                        <Select
                          aria-label={`خبير ورشة ${w.title}`}
                          className={cn('h-9 min-w-44 text-sm', !w.expertId && !past && 'border-warn/60')}
                          value={w.expertId ?? ''}
                          disabled={past}
                          onChange={(e) => {
                            actions.assignExpert(w.id, e.target.value)
                            toast('حُدّث خبير الورشة')
                          }}
                        >
                          <option value="">فريق البرنامج</option>
                          {experts.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                        </Select>
                      </td>
                      <td data-label="الحالة" className="px-5 py-3">
                        {past ? (
                          <Badge tone="neutral">منعقدة{w.attended && <> · <span className="tabular">{w.attended.length}</span> فريقًا</>}</Badge>
                        ) : (
                          <Badge tone="blue">قادمة</Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        ))}
      </div>
    </>
  )
}

/* ───────────── People ───────────── */

const KIND_LABEL: Record<string, string> = { mentor: 'مرشد/ة', expert: 'خبير/ة', judge: 'محكّم/ة' }

export function AdminPeople() {
  const { state, actions } = useStore()
  const toast = useToast()
  const [tab, setTab] = useState<'mentor' | 'expert' | 'judge' | 'nominations'>('mentor')
  const newNoms = state.nominations.filter((n) => n.status === 'new')
  const load = (id: string, role: Role) => {
    if (role === 'mentor') return `${state.teams.filter((t) => t.mentorId === id && t.status === 'active').length} فرق`
    if (role === 'expert') return `${state.workshops.filter((w) => w.expertId === id).length} ورش`
    return `${state.events.filter((e) => e.judgeIds.includes(id)).length} أيام تحكيم`
  }

  return (
    <>
      <PageHeader title="المرشدون والخبراء والمحكّمون" />
      <div className="mb-4">
        <Segmented
          label="الفئة"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'mentor', label: 'المرشدون', count: peopleByRole(state, 'mentor').length },
            { value: 'expert', label: 'الخبراء', count: peopleByRole(state, 'expert').length },
            { value: 'judge', label: 'المحكّمون', count: peopleByRole(state, 'judge').length },
            { value: 'nominations', label: 'طلبات انضمام', count: newNoms.length },
          ]}
        />
      </div>
      <Card>
        {tab === 'nominations' ? (
          newNoms.length ? (
            <ul className="divide-y divide-line">
              {newNoms.map((n) => (
                <li key={n.id} className="px-5 py-5">
                  <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                    <Avatar name={n.name} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-navy">{n.name} <Badge tone="blue">{KIND_LABEL[n.kind]}</Badge></p>
                      <p className="text-sm text-slate">{n.org} · <span className="tabular">{n.years}</span> سنوات خبرة · <Rel iso={n.at} /></p>
                      <p className="mt-2 text-sm text-navy">{n.note}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {n.areas.map((a) => <Badge key={a} tone="neutral">{a}</Badge>)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => { actions.reviewNomination(n.id, 'approved'); toast(`انضم ${n.name} إلى الشبكة`) }}>
                        <Check className="size-4" aria-hidden />اعتماد
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { actions.reviewNomination(n.id, 'declined'); toast('سُجّل الاعتذار') }}>
                        اعتذار
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="لا طلبات انضمام جديدة" />
          )
        ) : (
          <ul className="divide-y divide-line">
            {peopleByRole(state, tab).map((p) => (
              <ListRow key={p.id}>
                <Avatar name={p.name} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{p.name}</p>
                  <p className="text-sm text-slate">{p.title}{p.org && p.org !== p.title ? ` · ${p.org}` : ''}</p>
                </div>
                <div className="hidden max-w-sm flex-wrap justify-end gap-1.5 md:flex">
                  {p.areas?.slice(0, 2).map((a) => <Badge key={a} tone="neutral">{a}</Badge>)}
                </div>
                <span className="tabular w-24 text-end text-sm font-semibold text-navy">{load(p.id, p.role)}</span>
              </ListRow>
            ))}
          </ul>
        )}
      </Card>
    </>
  )
}
