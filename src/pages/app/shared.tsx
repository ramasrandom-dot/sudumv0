import type { ComponentType, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Star as BigStar } from '@/components/brand'
import { Badge } from '@/components/ui'
import { STAGE } from '@/data/program'
import type { Milestone, Session, Team } from '@/data/types'
import { fmtDay, fmtWeekday, relativeDays } from '@/lib/dates'
import { cn } from '@/lib/cn'
import { MILESTONE_STATUS, isOverdue } from '@/store/selectors'

export function MilestoneBadge({ m }: { m: Milestone }) {
  if (isOverdue(m)) return <Badge tone="danger"><AlertCircle className="size-3" aria-hidden />متأخر</Badge>
  const s = MILESTONE_STATUS[m.status]
  return <Badge tone={s.tone}>{s.label}</Badge>
}

const SESSION_KIND: Record<Session['kind'], string> = {
  mentoring: 'جلسة إرشاد',
  'office-hours': 'ساعة مكتبية',
  clinic: 'استشارة',
}

const SESSION_STATUS: Record<Session['status'], { label: string; tone: 'neutral' | 'blue' | 'green' | 'warn' | 'danger' }> = {
  requested: { label: 'طلب جديد', tone: 'warn' },
  scheduled: { label: 'مجدولة', tone: 'blue' },
  done: { label: 'منعقدة', tone: 'green' },
  declined: { label: 'معتذر عنها', tone: 'danger' },
}

// eslint-disable-next-line react-refresh/only-export-components
export const sessionKind = (k: Session['kind']) => SESSION_KIND[k]

export function SessionBadge({ s }: { s: Session }) {
  const x = SESSION_STATUS[s.status]
  return <Badge tone={x.tone}>{x.label}</Badge>
}

/** A date block: weekday, day and month, and an optional time. */
export function DateChip({ iso, time }: { iso: string; time?: string }) {
  return (
    <div className="flex w-[4.5rem] shrink-0 flex-col items-center rounded-lg bg-canvas px-2 py-1.5 text-center">
      <span className="text-xs text-slate">{fmtWeekday(iso)}</span>
      <span className="tabular text-sm font-bold text-navy">{fmtDay(iso)}</span>
      {time && <span className="tabular text-xs text-slate">{time}</span>}
    </div>
  )
}

export function Rel({ iso }: { iso: string }) {
  return <span className="text-xs text-slate">{relativeDays(iso)}</span>
}

export function TeamLink({ team, to }: { team: Team; to: string }) {
  return (
    <Link to={to} className="font-bold text-navy hover:text-blue-ink hover:underline">
      {team.name}
    </Link>
  )
}

/** A labelled figure used in dashboard summaries. */
export function Stat({ label, value, note, accent }: { label: string; value: ReactNode; note?: ReactNode; accent?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-line bg-white p-5 shadow-card">
      <span className="text-sm text-slate">{label}</span>
      <span className="tabular text-3xl font-bold" style={{ color: accent ?? '#0A0F3C' }}>
        {value}
      </span>
      {note && <span className="text-sm text-slate">{note}</span>}
    </div>
  )
}

export function ListRow({ children, className }: { children: ReactNode; className?: string }) {
  return <li className={cn('flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4', className)}>{children}</li>
}

export function StageDot({ stage }: { stage: Team['stage'] }) {
  return <span className="inline-block size-2 shrink-0 rounded-full" style={{ background: STAGE[stage].color }} aria-hidden />
}

/* ───────────── Home-screen pieces shared by all roles ───────────── */

/** The greeting band that opens every role's home: who you are, where things stand. */
export function Hero({
  hello,
  line,
  color = '#0A0F3C',
  on = '#FFFFFF',
  children,
}: {
  hello: ReactNode
  line?: ReactNode
  color?: string
  on?: string
  children?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl px-6 py-8 shadow-raised md:px-10 md:py-10" style={{ background: color, color: on }}>
      <BigStar className="spin-slow pointer-events-none absolute -top-16 -left-14 -z-10 size-64 opacity-15 md:size-80" />
      <h1 className="text-3xl font-bold md:text-5xl">{hello}</h1>
      {line && <p className="mt-2 text-lg opacity-85 md:text-xl">{line}</p>}
      {children && <div className="mt-6 flex flex-col gap-4">{children}</div>}
    </section>
  )
}

/** A small rounded fact inside the hero. */
export function Chip({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-black/15 px-3.5 py-1.5 text-sm font-semibold">{children}</span>
}

/** The one thing to do next, with its button. Sits inside the hero. */
type IconType = ComponentType<{ className?: string }>

export function NextStep({ icon: Icon, title, hint, action }: { icon: IconType; title: ReactNode; hint?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl bg-white p-4 text-navy shadow-card md:p-5">
      <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-tint-blue text-blue-ink">
        <Icon className="size-6" />
      </span>
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-lg font-bold">{title}</p>
        {hint && <p className="text-sm text-slate">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

/** A big, plain shortcut to one place. */
export function Tile({ to, icon: Icon, label, value, count, alert }: { to: string; icon: IconType; label: string; value?: ReactNode; count?: number; alert?: boolean }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-raised"
    >
      <span aria-hidden className={cn('grid size-12 shrink-0 place-items-center rounded-full', alert ? 'bg-warn-tint text-warn' : 'bg-tint-blue text-blue-ink')}>
        <Icon className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold text-navy">{label}</span>
        {value !== undefined && <span className="tabular block text-sm text-slate">{value}</span>}
      </span>
      {count !== undefined && <span className={cn('tabular text-3xl font-bold', alert ? 'text-warn' : 'text-navy')}>{count}</span>}
      <ArrowLeft className="size-5 shrink-0 text-slate transition-transform duration-200 group-hover:-translate-x-1" aria-hidden />
    </Link>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mt-10 mb-4 flex items-center justify-between gap-4">
      <h2 className="text-xl font-bold text-navy">{children}</h2>
      {action}
    </div>
  )
}
