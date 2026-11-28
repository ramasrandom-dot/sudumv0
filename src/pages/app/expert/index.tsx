import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Stethoscope, X } from 'lucide-react'
import { StageBadge } from '@/components/brand'
import { Badge, Button, Card, CardHeader, EmptyState, Field, PageHeader, Textarea, useToast } from '@/components/ui'
import { ROLE_COLOR, ROLE_LABEL, TODAY } from '@/data/program'
import type { Session } from '@/data/types'
import { firstName } from '@/lib/cn'
import { useMe, useStore } from '@/store/AppStore'
import { byId } from '@/store/selectors'
import { Count, DateChip, Hero, ListRow, NextStep, Rel, SectionTitle, SessionBadge } from '../shared'

export function ExpertWorkshops() {
  const me = useMe()
  const { state } = useStore()
  const mine = state.workshops.filter((w) => w.expertId === me.id).sort((a, b) => a.date.localeCompare(b.date))
  const upcoming = mine.filter((w) => w.date >= TODAY)
  const past = mine.filter((w) => w.date < TODAY).reverse()
  const clinics = state.sessions.filter((s) => s.hostId === me.id && s.kind === 'clinic')
  const requests = clinics.filter((s) => s.status === 'requested')
  const booked = clinics.filter((s) => s.status === 'scheduled' && s.date >= TODAY)
  const tone = ROLE_COLOR.expert

  // Workshops and confirmed consultations on one list, soonest first.
  const dates = [
    ...upcoming.map((w) => ({ id: w.id, date: w.date, time: undefined as string | undefined, title: w.title, sub: `ورشة · الأسبوع ${w.week}`, stage: w.stage })),
    ...booked.map((s) => ({ id: s.id, date: s.date, time: s.time as string | undefined, title: s.topic, sub: `استشارة · فريق ${byId(state.teams, s.teamId)?.name ?? ''}`, stage: undefined })),
  ].sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <Hero
        tag={ROLE_LABEL.expert}
        color={tone.color}
        on={tone.on}
        hello={`أهلًا ${firstName(me.name)}`}
        line={
          <>
            <span className="tabular">{upcoming.length}</span> ورش قادمة · <span className="tabular">{booked.length}</span> استشارات مؤكدة
          </>
        }
      >
        <NextStep
          icon={Stethoscope}
          title={requests.length ? <><span className="tabular">{requests.length}</span> طلبات استشارة بانتظار ردّك</> : 'لا شيء بانتظارك الآن'}
          hint={requests.length ? 'اقبل الطلب أو اعتذر عنه.' : 'تظهر هنا طلبات الاستشارة الجديدة.'}
          action={
            requests.length > 0 && (
              <Button size="lg" onClick={() => document.getElementById('queue')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                ردّ على الطلبات
              </Button>
            )
          }
        />
      </Hero>

      <SectionTitle>
        <span id="queue" className="scroll-mt-24">
          بانتظارك <Count n={requests.length} />
        </span>
      </SectionTitle>
      <Card>
        {requests.length ? (
          <ul className="divide-y divide-line">
            {requests.map((s) => (
              <ClinicRow key={s.id} s={s} />
            ))}
          </ul>
        ) : (
          <EmptyState title="لا شيء بانتظارك الآن">تظهر هنا طلبات الاستشارة عند وصولها.</EmptyState>
        )}
      </Card>

      <SectionTitle
        action={
          <Link to="/app/expert/clinics" className="text-sm font-semibold text-blue-ink hover:underline">
            كل الاستشارات
          </Link>
        }
      >
        مواعيدك القادمة <Count n={dates.length} />
      </SectionTitle>
      <Card>
        {dates.length ? (
          <ul className="divide-y divide-line">
            {dates.map((d) => (
              <ListRow key={d.id}>
                <DateChip iso={d.date} time={d.time} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-navy">{d.title}</p>
                  <p className="text-sm text-slate">{d.sub}</p>
                </div>
                {d.stage && <StageBadge stage={d.stage} full />}
                <Rel iso={d.date} />
              </ListRow>
            ))}
          </ul>
        ) : (
          <EmptyState title="لا مواعيد قادمة" />
        )}
      </Card>

      <SectionTitle>
        ورشك المنعقدة <Count n={past.length} />
      </SectionTitle>
      <Card>
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
