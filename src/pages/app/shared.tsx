import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
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
  clinic: 'عيادة',
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
