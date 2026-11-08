import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import { appStorage } from '../../shared/storage'
import type { ActiveSession, Session } from './types'

interface FocusState {
  active: ActiveSession | null
  sessions: Session[]
  rules: { id: string; text: string }[]
  defaultMin: number
  start: (goal: string, plannedMin: number) => void
  distract: () => void
  /** Завершает сессию; время считается от startedAt, поэтому переживает перезагрузку. */
  finish: (completed: boolean) => void
  addRule: (text: string) => void
  removeRule: (id: string) => void
  setDefaultMin: (m: number) => void
}

const RULES = ['Телефон в режиме полёта', 'Закрыть лишние вкладки и мессенджеры', 'Вода рядом, одна цель на сессию']

export const useFocusStore = create<FocusState>()(persist((set, get) => ({
  active: null, sessions: [], defaultMin: 50,
  rules: RULES.map(text => ({ id: crypto.randomUUID(), text })),
  start: (goal, plannedMin) => set({ active: { goal, plannedMin, startedAt: Date.now(), distractions: 0 } }),
  distract: () => set(s => s.active ? { active: { ...s.active, distractions: s.active.distractions + 1 } } : s),
  finish: completed => {
    const a = get().active
    if (!a) return
    const actualSec = completed ? a.plannedMin * 60 : Math.round((Date.now() - a.startedAt) / 1000)
    const session: Session = { id: crypto.randomUUID(), date: format(a.startedAt, 'yyyy-MM-dd'), goal: a.goal,
      plannedMin: a.plannedMin, actualSec, distractions: a.distractions, completed, startedAt: a.startedAt }
    set(s => ({ active: null, sessions: [session, ...s.sessions] }))
  },
  addRule: text => set(s => ({ rules: [...s.rules, { id: crypto.randomUUID(), text }] })),
  removeRule: id => set(s => ({ rules: s.rules.filter(r => r.id !== id) })),
  setDefaultMin: defaultMin => set({ defaultMin }),
}), { name: 'life-os:focus', version: 1, storage: appStorage }))
