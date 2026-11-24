import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { StageBadge, Star } from '@/components/brand'
import { Badge, Button, Card, CardHeader, EmptyState, Field, Meta, PageHeader, Textarea, useToast } from '@/components/ui'
import { TODAY } from '@/data/program'
import type { Session } from '@/data/types'
import { fmtDay } from '@/lib/dates'
import { useMe, useStore } from '@/store/AppStore'
import { byId } from '@/store/selectors'
import { DateChip, ListRow, Rel, SessionBadge } from '../shared'

export function ExpertWorkshops() {
  const me = useMe()
  const { state } = useStore()
  const mine = state.workshops.filter((w) => w.expertId === me.id).sort((a, b) => a.date.localeCompare(b.date))
  const upcoming = mine.filter((w) => w.date >= TODAY)
  const past = mine.filter((w) => w.date < TODAY)
  const activeTeams = state.teams.filter((t) => t.status === 'active').length

  return (
    <>
      <PageHeader title="ورشي" lede="كل ورشة في أسبوعها من المرحلة. البناء هو العمل، والورشة خدمة مساندة له." />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader title="القادمة" />
          {upcoming.length ? (
            <ul className="divide-y divide-line">
              {upcoming.map((w) => (
                <ListRow key={w.id}>
                  <DateChip iso={w.date} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy">{w.title}</p>
                    <p className="text-sm text-slate">
                      الأسبوع <span className="tabular">{w.week}</span> · {w.verb}
                      {w.stage === 'tamkeen' && <> · <span className="tabular">{activeTeams}</span> فريقًا متوقعًا</>}
                    </p>
                  </div>
                  <StageBadge stage={w.stage} full />
                  <Rel iso={w.date} />
                </ListRow>
              ))}
            </ul>
          ) : (
            <EmptyState title="لا ورش قادمة مسندة إليك" />
          )}
        </Card>
        <Card>
          <CardHeader title="المنعقدة" />
          {past.length ? (
            <ul className="divide-y divide-line">
              {past.map((w) => (
                <ListRow key={w.id}>
                  <DateChip iso={w.date} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy">{w.title}</p>
                    <p className="text-sm text-slate">
                      {w.attended ? <>حضرها <span className="tabular">{w.attended.length}</span> فريقًا</> : 'منعقدة'}
                    </p>
                  </div>
                  <StageBadge stage={w.stage} full />
                </ListRow>
              ))}
            </ul>
          ) : (
            <EmptyState title="لا ورش منعقدة بعد" />
          )}
        </Card>
      </div>
    </>
  )
}

function ClinicRow({ s }: { s: Session }) {
  const { state, actions } = useStore()
  const toast = useToast()
  const team = byId(state.teams, s.teamId)
  const [notes, setNotes] = useState('')
  const [closing, setClosing] = useState(false)
  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <DateChip iso={s.date} time={s.time} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-navy">{s.topic}</p>
          <p className="text-sm text-slate">
            فريق {team?.name} · {team?.sector}
          </p>
        </div>
        <SessionBadge s={s} />
        {s.status === 'requested' && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => { actions.updateSession(s.id, { status: 'scheduled' }); toast(`أُكّدت العيادة مع فريق ${team?.name}`) }}>
              <Check className="size-4" aria-hidden />
              قبول
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { actions.updateSession(s.id, { status: 'declined' }); toast('أُبلغ الفريق بالاعتذار') }}>
              <X className="size-4" aria-hidden />
              اعتذار
            </Button>
          </div>
        )}
        {s.status === 'scheduled' && !closing && (
          <Button size="sm" variant="secondary" onClick={() => setClosing(true)}>
            تسجيل انعقادها
          </Button>
        )}
      </div>
      {s.notes && <p className="mt-2 ps-[5.5rem] text-sm text-navy/80">{s.notes}</p>}
      {closing && (
        <form
          className="mt-3 flex flex-col gap-3 rounded-lg bg-canvas p-4"
          onSubmit={(e) => {
            e.preventDefault()
            actions.updateSession(s.id, { status: 'done', notes: notes.trim() || 'انعقدت العيادة.' })
            toast('سُجّلت العيادة')
            setClosing(false)
          }}
        >
          <Field label="خلاصة العيادة للفريق" htmlFor={`cn-${s.id}`}>
            <Textarea id={`cn-${s.id}`} className="min-h-20" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" size="sm">حفظ</Button>
            <Button size="sm" variant="ghost" onClick={() => setClosing(false)}>إلغاء</Button>
          </div>
        </form>
      )}
    </li>
  )
}

export function ExpertClinics() {
  const me = useMe()
  const { state } = useStore()
  const mine = state.sessions.filter((s) => s.hostId === me.id && s.kind === 'clinic')
  const requested = mine.filter((s) => s.status === 'requested')
  const scheduled = mine.filter((s) => s.status === 'scheduled')
  const done = mine.filter((s) => s.status === 'done' || s.status === 'declined')
  return (
    <>
      <PageHeader title="طلبات العيادات" lede="جلسات متخصصة قصيرة تطلبها الفرق عند الحاجة. يصل ردّك للفريق مباشرة." />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader title="طلبات جديدة" action={requested.length > 0 && <Badge tone="warn"><span className="tabular">{requested.length}</span></Badge>} />
          {requested.length ? <ul className="divide-y divide-line">{requested.map((s) => <ClinicRow key={s.id} s={s} />)}</ul> : <EmptyState title="لا طلبات جديدة" />}
        </Card>
        <Card>
          <CardHeader title="مجدولة" />
          {scheduled.length ? <ul className="divide-y divide-line">{scheduled.map((s) => <ClinicRow key={s.id} s={s} />)}</ul> : <EmptyState title="لا عيادات مجدولة" />}
        </Card>
        <Card>
          <CardHeader title="السجل" />
          {done.length ? <ul className="divide-y divide-line">{done.map((s) => <ClinicRow key={s.id} s={s} />)}</ul> : <EmptyState title="لا عيادات سابقة" />}
        </Card>
      </div>
    </>
  )
}

export function ExpertProfile() {
  const me = useMe()
  const { state } = useStore()
  const workshops = state.workshops.filter((w) => w.expertId === me.id).length
  const clinics = state.sessions.filter((s) => s.hostId === me.id && s.status === 'done').length
  return (
    <>
      <PageHeader title="ملفي" lede="تستخدم إدارة البرنامج مجالاتك لمطابقتك مع الورش واحتياج الفرق." />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="p-6">
          <p className="text-2xl font-bold text-navy">{me.name}</p>
          <p className="text-slate">{me.title}</p>
          <h2 className="mt-6 text-sm font-semibold text-navy">مجالات الخبرة</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {me.areas?.map((a) => (
              <li key={a} className="flex items-center gap-2 text-navy">
                <Star className="size-3" color="#2086C2" />
                {a}
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6">
          <dl className="grid grid-cols-2 gap-6">
            <Meta label="ورش مسندة"><span className="tabular text-2xl">{workshops}</span></Meta>
            <Meta label="عيادات منعقدة"><span className="tabular text-2xl">{clinics}</span></Meta>
            <Meta label="الجهة">{me.org}</Meta>
            <Meta label="آخر تحديث"><span className="tabular">{fmtDay(TODAY)}</span></Meta>
          </dl>
        </Card>
      </div>
    </>
  )
}
