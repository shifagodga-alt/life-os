import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appStorage } from '../../shared/storage'
import type { Entry, Principle, Question, Settings } from './types'
import { DEFAULT_QUESTIONS, DEFAULT_SETTINGS } from './utils/defaults'

interface CoachState {
  entries: Record<string, Entry> // ключ — дата
  questions: Question[]
  principles: Principle[]
  settings: Settings
  saveEntry: (e: Entry) => void
  reopenDay: (date: string) => void
  setQuestions: (q: Question[]) => void
  addPrinciple: (text: string) => void
  removePrinciple: (id: string) => void
  updateSettings: (s: Partial<Settings>) => void
}

export const useCoachStore = create<CoachState>()(persist((set) => ({
  entries: {}, questions: DEFAULT_QUESTIONS, principles: [], settings: DEFAULT_SETTINGS,
  saveEntry: e => set(s => ({ entries: { ...s.entries, [e.date]: e } })),
  reopenDay: date => set(s => ({ entries: Object.fromEntries(Object.entries(s.entries).filter(([k]) => k !== date)) })),
  setQuestions: questions => set({ questions }),
  addPrinciple: text => set(s => ({ principles: [...s.principles, { id: crypto.randomUUID(), text }] })),
  removePrinciple: id => set(s => ({ principles: s.principles.filter(p => p.id !== id) })),
  updateSettings: p => set(s => ({ settings: { ...s.settings, ...p } })),
}), { name: 'life-os:coach', version: 1, storage: appStorage }))
