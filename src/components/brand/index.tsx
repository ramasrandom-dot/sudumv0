import { Check } from 'lucide-react'
import logoColor from '@/assets/brand/sudum-logo-color.svg'
import logoWhite from '@/assets/brand/sudum-logo-white.svg'
import pnuColor from '@/assets/brand/pnu-logo-color.png'
import pnuWhite from '@/assets/brand/pnu-logo-white.svg'
import { STAGE, STAGES } from '@/data/program'
import type { StageId } from '@/data/types'
import { cn } from '@/lib/cn'

const STAR_PATH =
  'M413.4 736C407.9 572.6 275.6 441.6 112.2 437.7 107.1 437.6 103.1 433.4 103.1 428.4L103.1 425C103.1 420 107.1 415.8 112.1 415.7 275.5 410.2 406.5 277.9 410.4 114.5 410.5 109.4 414.7 105.4 419.7 105.4L419.7 105.4C424.7 105.4 428.9 109.4 429 114.4 434.5 277.8 566.8 408.8 730.2 412.7 735.3 412.8 739.3 417 739.3 422L739.3 425.4C739.3 430.4 735.3 434.6 730.3 434.7 566.9 440.2 435.9 572.5 432 735.9 431.9 741 427.7 745 422.7 745L422.7 745C417.7 745 413.5 741 413.4 736Z'

/** The Sudum four-point star. Filled by default; `outline` draws it as a line. */
export function Star({
  className,
  color = 'currentColor',
  outline = false,
  strokeWidth = 10,
}: {
  className?: string
  color?: string
  outline?: boolean
  strokeWidth?: number
}) {
  return (
    <svg viewBox="95 95 655 655" className={className} aria-hidden focusable="false">
      <path
        d={STAR_PATH}
        fill={outline ? 'none' : color}
        stroke={outline ? color : 'none'}
        strokeWidth={outline ? strokeWidth : 0}
        vectorEffect={outline ? 'non-scaling-stroke' : undefined}
      />
    </svg>
  )
}

export function Logo({ variant = 'color', className }: { variant?: 'color' | 'white'; className?: string }) {
  return (
    <img
      src={variant === 'white' ? logoWhite : logoColor}
      alt="سُدُم SUDUM"
      className={cn('h-10 w-auto', className)}
      width={850}
      height={369}
    />
  )
}

/** The university lockup: colour on light surfaces, white on dark ones. */
export function PnuLogo({ variant = 'white', className }: { variant?: 'color' | 'white'; className?: string }) {
  return (
    <img
      src={variant === 'white' ? pnuWhite : pnuColor}
      alt="جامعة الأميرة نورة بنت عبدالرحمن · وكالة الجامعة للدراسات العليا والبحث العلمي · مركز الابتكار وريادة الأعمال"
      className={cn('h-10 w-auto', className)}
      width={726}
      height={200}
    />
  )
}

export function StageBadge({ stage, solid = false, full = false }: { stage: StageId; solid?: boolean; full?: boolean }) {
  const s = STAGE[stage]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={solid ? { background: s.color, color: s.on } : { background: s.tint, color: s.ink }}
    >
      <Star className="size-2.5" color={solid ? s.on : s.color} />
      {full ? s.fullName : s.name}
    </span>
  )
}

/** The four stations as a compact progress line: done, current and upcoming. */
export function StageTrack({ current, exited = false }: { current: StageId; exited?: boolean }) {
  const idx = STAGE[current].index
  return (
    <ol className="flex items-start gap-1" aria-label="مراحل الرحلة">
      {STAGES.map((s) => {
        const done = s.index < idx
        const now = s.index === idx
        return (
          <li key={s.id} className="flex min-w-0 flex-1 flex-col gap-2">
            <span
              className="h-1.5 rounded-full"
              style={{ background: done || now ? s.color : '#E0E5E8', opacity: now && exited ? 0.4 : 1 }}
            />
            <span className={cn('flex items-center gap-1 text-xs', now ? 'font-bold text-navy' : 'text-slate')}>
              {done && <Check className="size-3" style={{ color: s.ink }} aria-hidden />}
              {now && <Star className="size-3" color={s.color} />}
              <span className="truncate">{s.fullName}</span>
              <span className="sr-only">{done ? ' (مكتملة)' : now ? ' (الحالية)' : ''}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
