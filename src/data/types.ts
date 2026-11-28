export type StageId = 'ilham' | 'takween' | 'tamkeen' | 'intilaq'
export type Role = 'participant' | 'mentor' | 'expert' | 'judge' | 'admin'
export type EntryPoint = 'research' | 'student' | 'founder'

export interface Person {
  id: string
  name: string
  role: Role
  title: string
  org?: string
  areas?: string[]
  teamId?: string
  bio?: string
}

export interface TeamMember {
  name: string
  role: string
}

export type TeamStatus = 'active' | 'exited' | 'graduated'

export interface Team {
  id: string
  name: string
  idea: string
  sector: string
  entry: EntryPoint
  stage: StageId
  status: TeamStatus
  members: TeamMember[]
  mentorId?: string
  charter?: string
  /** how the team joined its current stage */
  joinedVia: 'advanced' | 'open-seat'
  metrics?: { users: number; interviews: number; revenue?: number }
}

export type MilestoneStatus = 'todo' | 'submitted' | 'approved' | 'changes'

export interface Milestone {
  id: string
  teamId: string
  stage: StageId
  week: number
  title: string
  due: string
  status: MilestoneStatus
  submission?: { link: string; note: string; at: string }
  feedback?: string
}

export interface Workshop {
  id: string
  stage: StageId
  week: number
  title: string
  date: string
  expertId?: string
  attended?: string[]
}

export type SessionKind = 'mentoring' | 'office-hours' | 'clinic'
export type SessionStatus = 'requested' | 'scheduled' | 'done' | 'declined'

export interface Session {
  id: string
  teamId: string
  hostId: string
  kind: SessionKind
  date: string
  time: string
  topic: string
  status: SessionStatus
  notes?: string
}

export interface Slot {
  id: string
  hostId: string
  date: string
  time: string
  bookedBy?: string
}

export interface Criterion {
  id: string
  label: string
  hint: string
  weight: number
}

export interface JudgingEvent {
  id: string
  title: string
  date: string
  stage: StageId
  /** how many teams pass this gate */
  capacity: number
  judgeIds: string[]
  teamIds: string[]
  published: boolean
  advancedIds?: string[]
}

export interface Score {
  id: string
  eventId: string
  teamId: string
  judgeId: string
  values: Record<string, number>
  comment: string
  at: string
}

export type Track = 'ilham' | 'tamkeen-seat' | 'intilaq-seat'
export type ApplicationStatus = 'new' | 'interview' | 'accepted' | 'declined'

export interface Application {
  id: string
  at: string
  track: Track
  entry: EntryPoint
  leadName: string
  email: string
  phone: string
  college: string
  teamName: string
  teamSize: number
  problem: string
  idea: string
  status: ApplicationStatus
  note?: string
  /** answers that only this stage's form asks for */
  details?: { label: string; value: string }[]
}

export type NominationKind = 'mentor' | 'expert' | 'judge'

export interface Nomination {
  id: string
  at: string
  name: string
  email: string
  /** job title, shown on the profile card with the organisation */
  title?: string
  org: string
  years: number
  kind: NominationKind
  areas: string[]
  note: string
  status: 'new' | 'approved' | 'declined'
}

export interface Escalation {
  id: string
  at: string
  level: 1 | 2 | 3
  title: string
  detail: string
  teamId?: string
  raisedBy: string
  status: 'open' | 'resolved'
  resolution?: string
}
