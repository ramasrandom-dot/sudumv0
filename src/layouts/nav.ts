import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  FileStack,
  Flag,
  Gavel,
  GraduationCap,
  Home,
  Inbox,
  ListChecks,
  MessagesSquare,
  Presentation,
  Stethoscope,
  Trophy,
  UserRound,
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

export const NAV: Record<Role, NavItem[]> = {
  participant: [
    { to: '/app/participant', label: 'نظرة عامة', icon: Home, end: true },
    { to: '/app/participant/milestones', label: 'المعالم والتسليمات', icon: ListChecks },
    { to: '/app/participant/workshops', label: 'الورش', icon: Presentation },
    { to: '/app/participant/mentoring', label: 'الإرشاد والعيادات', icon: MessagesSquare },
    { to: '/app/participant/results', label: 'نتائج التحكيم', icon: Trophy },
    { to: '/app/participant/team', label: 'فريقي', icon: UsersRound },
  ],
  mentor: [
    { to: '/app/mentor', label: 'فرقي', icon: UsersRound, end: true },
    { to: '/app/mentor/reviews', label: 'معالم بانتظار الاعتماد', icon: ClipboardCheck },
    { to: '/app/mentor/sessions', label: 'الجلسات', icon: MessagesSquare },
    { to: '/app/mentor/hours', label: 'الساعات المكتبية', icon: CalendarClock },
  ],
  expert: [
    { to: '/app/expert', label: 'ورشي', icon: Presentation, end: true },
    { to: '/app/expert/clinics', label: 'طلبات العيادات', icon: Stethoscope },
    { to: '/app/expert/profile', label: 'ملفي', icon: UserRound },
  ],
  judge: [
    { to: '/app/judge', label: 'أيام التحكيم', icon: Gavel, end: true },
    { to: '/app/judge/scores', label: 'تقييماتي', icon: ClipboardList },
  ],
  admin: [
    { to: '/app/admin', label: 'لوحة المؤشرات', icon: BarChart3, end: true },
    { to: '/app/admin/applications', label: 'طلبات التقديم', icon: Inbox },
    { to: '/app/admin/teams', label: 'الفرق', icon: UsersRound },
    { to: '/app/admin/workshops', label: 'الورش', icon: Presentation },
    { to: '/app/admin/people', label: 'المرشدون والخبراء', icon: Users },
    { to: '/app/admin/judging', label: 'التحكيم والعبور', icon: Flag },
    { to: '/app/admin/escalations', label: 'التصعيد', icon: AlertTriangle },
    { to: '/app/admin/timeline', label: 'الجدول الزمني', icon: CalendarDays },
  ],
}

export const ROLE_ICON: Record<Role, LucideIcon> = {
  participant: GraduationCap,
  mentor: MessagesSquare,
  expert: FileStack,
  judge: Gavel,
  admin: BarChart3,
}
