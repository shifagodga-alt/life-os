import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appStorage } from '../../shared/storage'

export interface BodyEntry {
  date: string // yyyy-MM-dd
  sleep: number | null; weight: number | null
  workout: string; workoutMin: number | null
  water: number; wellbeing: number
}
interface BodyState {
  entries: Record<string, BodyEntry>
  update: (date: string, patch: Partial<BodyEntry>) => void
}
export const emptyEntry = (date: string): BodyEntry =>
  ({ date, sleep: null, weight: null, workout: '', workoutMin: null, water: 0, wellbeing: 5 })

export const useBodyStore = create<BodyState>()(persist((set) => ({
  entries: {},
  update: (date, patch) => set(s => ({ entries: { ...s.entries, [date]: { ...(s.entries[date] ?? emptyEntry(date)), ...patch } } })),
}), { name: 'life-os:body', version: 1, storage: appStorage }))
