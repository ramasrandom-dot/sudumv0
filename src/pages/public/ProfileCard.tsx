import { Star } from '@/components/brand'
import { ROLE_COLOR, ROLE_LABEL } from '@/data/program'
import type { NominationKind } from '@/data/types'
import { cn } from '@/lib/cn'

export interface Profile {
  name: string
  title: string
  org: string
  areas: string[]
  bio: string
  photo?: string
}

/**
 * The one profile card for mentors, experts and judges. Every card has the same parts in the
 * same order, and takes its colour from the role alone.
 */
export default function ProfileCard({ kind, profile, muted, className }: { kind: NominationKind; profile: Profile; muted?: boolean; className?: string }) {
  const tone = ROLE_COLOR[kind]
  const shown = profile.areas.slice(0, 3)
  const more = profile.areas.length - shown.length
  return (
    <article className={cn('group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card', className)}>
      <div className="relative h-24 overflow-hidden px-5 pt-4" style={{ background: tone.color, color: tone.on }}>
        <Star outline strokeWidth={1.5} className="pointer-events-none absolute -top-8 -left-6 size-36 opacity-35 transition-transform duration-700 ease-out group-hover:rotate-45" />
        <p className="relative flex items-center gap-1.5 text-sm font-medium">
          <Star className="size-3" />
          {ROLE_LABEL[kind]}
        </p>
      </div>
      <div className="-mt-10 flex flex-1 flex-col items-center px-5 pb-6 text-center">
        <span aria-hidden className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white" style={{ background: tone.tint, color: tone.ink }}>
          {profile.photo ? <img src={profile.photo} alt="" className="size-full object-cover" /> : <Star className="size-8 transition-transform duration-700 ease-out group-hover:rotate-90" />}
        </span>
        <p className={cn('mt-3 text-lg font-bold', muted ? 'text-slate' : 'text-navy')}>{profile.name}</p>
        <p className="text-sm font-medium" style={{ color: tone.ink }}>
          {profile.title} · {profile.org}
        </p>
        <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
          {shown.map((a) => (
            <li key={a} className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: tone.tint, color: tone.ink }}>
              {a}
            </li>
          ))}
          {more > 0 && (
            <li className="tabular rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: tone.tint, color: tone.ink }}>
              +{more}
            </li>
          )}
        </ul>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate">{profile.bio}</p>
      </div>
    </article>
  )
}
