export interface ActiveSession { goal: string; plannedMin: number; startedAt: number; distractions: number }
export interface Session {
  id: string; date: string // yyyy-MM-dd
  goal: string; plannedMin: number; actualSec: number
  distractions: number; completed: boolean; startedAt: number
}
