import { CRITERIA } from '@/data/program'
import type { JudgingEvent, Score } from '@/data/types'

/** Weighted total out of 100 for one score sheet (each criterion is scored 1–5). */
export const weightedTotal = (values: Record<string, number>) =>
  Math.round(CRITERIA.reduce((sum, c) => sum + ((values[c.id] ?? 0) / 5) * c.weight, 0))

export interface TeamResult {
  teamId: string
  average: number
  sheets: number
  rank: number
}

/** Average weighted totals per team for one event, ranked high to low. */
export const eventResults = (event: JudgingEvent, scores: Score[]): TeamResult[] => {
  const rows = event.teamIds.map((teamId) => {
    const mine = scores.filter((s) => s.eventId === event.id && s.teamId === teamId)
    const average = mine.length ? Math.round(mine.reduce((a, s) => a + weightedTotal(s.values), 0) / mine.length) : 0
    return { teamId, average, sheets: mine.length, rank: 0 }
  })
  rows.sort((a, b) => b.average - a.average)
  rows.forEach((r, i) => (r.rank = i + 1))
  return rows
}
