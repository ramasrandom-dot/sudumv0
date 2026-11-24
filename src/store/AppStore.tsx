import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import * as seed from '@/data/seed'
import { TODAY, nextStage } from '@/data/program'
import { uid } from '@/lib/cn'
import type {
  Application,
  ApplicationStatus,
  Escalation,
  JudgingEvent,
  Milestone,
  Nomination,
  Person,
  Role,
  Score,
  Session,
  Slot,
  Team,
  Workshop,
} from '@/data/types'

export interface AppState {
  version: number
  currentUserId: string | null
  people: Person[]
  teams: Team[]
  milestones: Milestone[]
  workshops: Workshop[]
  sessions: Session[]
  slots: Slot[]
  events: JudgingEvent[]
  scores: Score[]
  applications: Application[]
  nominations: Nomination[]
  escalations: Escalation[]
}

const VERSION = 1
const KEY = 'sudum-demo-state'

const fresh = (): AppState => ({
  version: VERSION,
  currentUserId: null,
  people: seed.people,
  teams: seed.teams,
  milestones: seed.milestones,
  workshops: seed.workshops,
  sessions: seed.sessions,
  slots: seed.slots,
  events: seed.events,
  scores: seed.scores,
  applications: seed.applications,
  nominations: seed.nominations,
  escalations: seed.escalations,
})

const load = (): AppState => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed.version === VERSION) return parsed
    }
  } catch {
    /* storage unavailable: fall back to seed */
  }
  return fresh()
}

const makeActions = (set: (fn: (s: AppState) => AppState) => void) => ({
  signIn: (personId: string) => set((s) => ({ ...s, currentUserId: personId })),
  signOut: () => set((s) => ({ ...s, currentUserId: null })),

  submitApplication: (a: Omit<Application, 'id' | 'at' | 'status'>) => {
    const id = uid('ap')
    set((s) => ({ ...s, applications: [{ ...a, id, at: TODAY, status: 'new' }, ...s.applications] }))
    return id
  },
  reviewApplication: (id: string, status: ApplicationStatus, note?: string) =>
    set((s) => ({
      ...s,
      applications: s.applications.map((a) => (a.id === id ? { ...a, status, note: note ?? a.note } : a)),
    })),

  submitNomination: (n: Omit<Nomination, 'id' | 'at' | 'status'>) =>
    set((s) => ({ ...s, nominations: [{ ...n, id: uid('n'), at: TODAY, status: 'new' }, ...s.nominations] })),
  reviewNomination: (id: string, status: 'approved' | 'declined') =>
    set((s) => {
      const n = s.nominations.find((x) => x.id === id)
      const people =
        n && status === 'approved'
          ? [
              ...s.people,
              {
                id: uid(n.kind[0]),
                name: n.name,
                role: n.kind as Role,
                title: n.org,
                org: n.org,
                areas: n.areas,
              },
            ]
          : s.people
      return { ...s, people, nominations: s.nominations.map((x) => (x.id === id ? { ...x, status } : x)) }
    }),

  submitMilestone: (id: string, link: string, note: string) =>
    set((s) => ({
      ...s,
      milestones: s.milestones.map((m) =>
        m.id === id ? { ...m, status: 'submitted', submission: { link, note, at: TODAY } } : m,
      ),
    })),
  reviewMilestone: (id: string, status: 'approved' | 'changes', feedback: string) =>
    set((s) => ({
      ...s,
      milestones: s.milestones.map((m) => (m.id === id ? { ...m, status, feedback } : m)),
    })),

  requestSession: (sess: Omit<Session, 'id' | 'status'>) =>
    set((s) => ({ ...s, sessions: [...s.sessions, { ...sess, id: uid('s'), status: 'requested' }] })),
  updateSession: (id: string, patch: Partial<Session>) =>
    set((s) => ({ ...s, sessions: s.sessions.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
  logSession: (sess: Omit<Session, 'id' | 'status'> & { notes: string }) =>
    set((s) => ({ ...s, sessions: [...s.sessions, { ...sess, id: uid('s'), status: 'done' }] })),

  addSlot: (hostId: string, date: string, time: string) =>
    set((s) => ({ ...s, slots: [...s.slots, { id: uid('h'), hostId, date, time }] })),
  removeSlot: (id: string) => set((s) => ({ ...s, slots: s.slots.filter((x) => x.id !== id) })),
  bookSlot: (slotId: string, teamId: string, topic: string) =>
    set((s) => {
      const slot = s.slots.find((x) => x.id === slotId)
      if (!slot || slot.bookedBy) return s
      return {
        ...s,
        slots: s.slots.map((x) => (x.id === slotId ? { ...x, bookedBy: teamId } : x)),
        sessions: [
          ...s.sessions,
          { id: uid('s'), teamId, hostId: slot.hostId, kind: 'office-hours', date: slot.date, time: slot.time, topic, status: 'scheduled' },
        ],
      }
    }),

  assignMentor: (teamId: string, mentorId: string) =>
    set((s) => ({ ...s, teams: s.teams.map((t) => (t.id === teamId ? { ...t, mentorId } : t)) })),
  assignExpert: (workshopId: string, expertId: string) =>
    set((s) => ({
      ...s,
      workshops: s.workshops.map((w) => (w.id === workshopId ? { ...w, expertId: expertId || undefined } : w)),
    })),

  submitScore: (eventId: string, teamId: string, judgeId: string, values: Record<string, number>, comment: string) =>
    set((s) => {
      const id = `sc-${eventId}-${teamId}-${judgeId}`
      const score: Score = { id, eventId, teamId, judgeId, values, comment, at: TODAY }
      const exists = s.scores.some((x) => x.id === id)
      return { ...s, scores: exists ? s.scores.map((x) => (x.id === id ? score : x)) : [...s.scores, score] }
    }),

  /** Publish a gate's results: selected teams move to the next stage, the rest exit. */
  publishResults: (eventId: string, advancedIds: string[]) =>
    set((s) => {
      const ev = s.events.find((e) => e.id === eventId)
      if (!ev) return s
      const next = nextStage(ev.stage)
      return {
        ...s,
        events: s.events.map((e) => (e.id === eventId ? { ...e, published: true, advancedIds } : e)),
        teams: s.teams.map((t) => {
          if (!ev.teamIds.includes(t.id)) return t
          if (!advancedIds.includes(t.id)) return { ...t, status: 'exited' }
          return next
            ? { ...t, stage: next, status: 'active', joinedVia: 'advanced' }
            : { ...t, status: 'graduated' }
        }),
      }
    }),

  addEscalation: (e: Omit<Escalation, 'id' | 'at' | 'status'>) =>
    set((s) => ({ ...s, escalations: [{ ...e, id: uid('x'), at: TODAY, status: 'open' }, ...s.escalations] })),
  resolveEscalation: (id: string, resolution: string) =>
    set((s) => ({
      ...s,
      escalations: s.escalations.map((e) => (e.id === id ? { ...e, status: 'resolved', resolution } : e)),
    })),
  raiseEscalationLevel: (id: string) =>
    set((s) => ({
      ...s,
      escalations: s.escalations.map((e) =>
        e.id === id && e.level < 3 ? { ...e, level: (e.level + 1) as 2 | 3, at: TODAY } : e,
      ),
    })),

  resetDemo: () =>
    set((s) => ({ ...fresh(), currentUserId: s.currentUserId })),
})

export type Actions = ReturnType<typeof makeActions>

interface Ctx {
  state: AppState
  actions: Actions
  me: Person | null
}

const StoreContext = createContext<Ctx | null>(null)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore */
    }
  }, [state])

  const set = useCallback((fn: (s: AppState) => AppState) => setState(fn), [])
  const actions = useMemo(() => makeActions(set), [set])
  const me = useMemo(() => state.people.find((p) => p.id === state.currentUserId) ?? null, [state])

  return <StoreContext.Provider value={{ state, actions, me }}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside AppStoreProvider')
  return ctx
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMe() {
  const { me } = useStore()
  if (!me) throw new Error('No signed-in user')
  return me
}
