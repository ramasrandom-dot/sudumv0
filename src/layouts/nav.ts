import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Flag,
  Gavel,
  GraduationCap,
  Inbox,
  MessagesSquare,
  Presentation,
  Rocket,
  Stethoscope,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '@/data/types'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

/** Few, plainly named places per role. The first is always that role's home. */
export const NAV: Record<Role, NavItem[]> = {
  participant: [
    { to: '/app/participant', label: 'رحلتي', icon: Rocket, end: true },
    { to: '/app/participant/dates', label: 'مواعيدي', icon: CalendarDays },
    { to: '/app/participant/team', label: 'فريقي', icon: UsersRound },
  ],
  mentor: [
    { to: '/app/mentor', label: 'فرقي', icon: UsersRound, end: true },
    { to: '/app/mentor/dates', label: 'مواعيدي', icon: CalendarDays },
  ],
  expert: [
    { to: '/app/expert', label: 'ورشي', icon: Presentation, end: true },
    { to: '/app/expert/clinics', label: 'الاستشارات', icon: Stethoscope },
  ],
  judge: [
    { to: '/app/judge', label: 'التحكيم', icon: Gavel, end: true },
    { to: '/app/judge/scores', label: 'تقييماتي', icon: ClipboardList },
  ],
  admin: [
    { to: '/app/admin', label: 'الرئيسية', icon: BarChart3, end: true },
    { to: '/app/admin/applications', label: 'الطلبات', icon: Inbox },
    { to: '/app/admin/teams', label: 'الفرق', icon: UsersRound },
    { to: '/app/admin/workshops', label: 'الورش', icon: Presentation },
    { to: '/app/admin/people', label: 'الأشخاص', icon: Users },
    { to: '/app/admin/judging', label: 'التحكيم', icon: Flag },
    { to: '/app/admin/escalations', label: 'التصعيد', icon: AlertTriangle },
  ],
}

export const ROLE_ICON: Record<Role, LucideIcon> = {
  participant: GraduationCap,
  mentor: MessagesSquare,
  expert: Presentation,
  judge: Gavel,
  admin: BarChart3,
}
