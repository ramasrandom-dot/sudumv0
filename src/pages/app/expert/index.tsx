import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Stethoscope, X } from 'lucide-react'
import { StageBadge } from '@/components/brand'
import { Badge, Button, Card, CardHeader, EmptyState, Field, PageHeader, Textarea, buttonClass, useToast } from '@/components/ui'
import { TODAY } from '@/data/program'
import type { Session } from '@/data/types'
import { firstName } from '@/lib/cn'
import { useMe, useStore } from '@/store/AppStore'
import { byId } from '@/store/selectors'
import { DateChip, Hero, ListRow, NextStep, Rel, SessionBadge } from '../shared'

export function ExpertWorkshops() {
  const me = useMe()
  const { state } = useStore()
  const mine = state.workshops.filter((w) => w.expertId === me.id).sort((a, b) => a.date.localeCompare(b.date))
  const upcoming = mine.filter((w) => w.date >= TODAY)
  const past = mine.filter((w) => w.date < TODAY)
  const activeTeams = state.teams.filter((t) => t.status === 'active').length
  const requests = state.sessions.filter((s) => s.hostId === me.id && s.kind === 'clinic' && s.status === 'requested').length

  return (
    <>
      <Hero
        hello={`أهلًا ${firstName(me.name)}`}
        line={
          <>
            ورشك القادمة: <span className="tabular">{upcoming.length}</span>
          </>
        }
      >
        <NextStep
          icon={Stethoscope}
          title={requests ? <><span className="tabular">{requests}</span> طلبات استشارة جديدة</> : 'لا طلبات استشارة جديدة'}
          action={
            requests > 0 && (
              <Link to="/app/expert/clinics" className={buttonClass('primary', 'lg')}>
                ردّ على الطلبات
              </Link>
            )
          }
        />
      </Hero>
      <div className="mt-6 flex flex-col gap-6">
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
                      الأسبوع <span className="tabular">{w.week}</span>
                      {w.stage === 'tamkeen' && <> · <span className="tabular">{activeTeams}</span> فريقًا متوقعًا</>}
                    </p>
                  </div>
                  <StageBadge stage={w.stage} full />
                  <Rel iso={w.date} />
                </ListRow>
              ))}
            </ul>
          ) : (
            <EmptyState title="لا ورش قادمة" />
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
            <Button size="sm" onClick={() => { actions.updateSession(s.id, { status: 'scheduled' }); toast(`أُكّدت الاستشارة مع فريق ${team?.name}`) }}>
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
            actions.updateSession(s.id, { status: 'done', notes: notes.trim() || 'انعقدت الاستشارة.' })
            toast('سُجّلت الاستشارة')
            setClosing(false)
          }}
        >
          <Field label="خلاصة الاستشارة للفريق" htmlFor={`cn-${s.id}`}>
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
      <PageHeader title="طلبات الاستشارات" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader title="طلبات جديدة" action={requested.length > 0 && <Badge tone="warn"><span className="tabular">{requested.length}</span></Badge>} />
          {requested.length ? <ul className="divide-y divide-line">{requested.map((s) => <ClinicRow key={s.id} s={s} />)}</ul> : <EmptyState title="لا طلبات جديدة" />}
        </Card>
        <Card>
          <CardHeader title="مجدولة" />
          {scheduled.length ? <ul className="divide-y divide-line">{scheduled.map((s) => <ClinicRow key={s.id} s={s} />)}</ul> : <EmptyState title="لا استشارات مجدولة" />}
        </Card>
        <Card>
          <CardHeader title="السجل" />
          {done.length ? <ul className="divide-y divide-line">{done.map((s) => <ClinicRow key={s.id} s={s} />)}</ul> : <EmptyState title="لا استشارات سابقة" />}
        </Card>
      </div>
    </>
  )
}
