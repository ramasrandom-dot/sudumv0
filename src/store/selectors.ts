import { PAUSES, STAGE, TODAY } from '@/data/program'
import type { Milestone, MilestoneStatus, Person, StageId, Team } from '@/data/types'
import { daysBetween } from '@/lib/dates'
import type { AppState } from './AppStore'

export const byId = <T extends { id: string }>(xs: T[], id?: string) => (id ? xs.find((x) => x.id === id) : undefined)

/** Current programme week of a stage on TODAY, skipping pauses. */
export const stageWeek = (stage: StageId) => {
  const s = STAGE[stage]
  if (TODAY < s.start) return 0
  if (TODAY > s.end) return s.weeks
  let days = daysBetween(s.start, TODAY)
  for (const p of PAUSES) {
    if (p.start >= s.start && p.end <= TODAY) days -= daysBetween(p.start, p.end)
  }
  return Math.min(s.weeks, Math.floor(days / 7) + 1)
}

/** The stage that is running on TODAY, if any. */
export const activeStage = (): StageId | undefined =>
  (['ilham', 'takween', 'tamkeen', 'sanam'] as StageId[]).find((id) => TODAY >= STAGE[id].start && TODAY <= STAGE[id].end)

export const teamMilestones = (state: AppState, teamId: string) =>
  state.milestones.filter((m) => m.teamId === teamId).sort((a, b) => a.due.localeCompare(b.due))

export const milestoneProgress = (ms: Milestone[]) => {
  const approved = ms.filter((m) => m.status === 'approved').length
  return { approved, total: ms.length, pct: ms.length ? (approved / ms.length) * 100 : 0 }
}

export const isOverdue = (m: Milestone) => (m.status === 'todo' || m.status === 'changes') && m.due < TODAY

export const MILESTONE_STATUS: Record<MilestoneStatus, { label: string; tone: 'neutral' | 'blue' | 'green' | 'warn' }> = {
  todo: { label: 'لم يُسلَّم', tone: 'neutral' },
  submitted: { label: 'بانتظار المرشد', tone: 'blue' },
  approved: { label: 'معتمد', tone: 'green' },
  changes: { label: 'مطلوب تعديل', tone: 'warn' },
}

export const teamsOf = (state: AppState, mentor: Person): Team[] =>
  state.teams.filter((t) => t.mentorId === mentor.id && t.status === 'active')

export const peopleByRole = (state: AppState, role: Person['role']) => state.people.filter((p) => p.role === role)
