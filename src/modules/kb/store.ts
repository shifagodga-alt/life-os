import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addDays, format } from 'date-fns'
import { appStorage } from '../../shared/storage'

export interface Note { id: string; title: string; body: string; tags: string[]; updatedAt: number }
export interface PlanTask { id: string; date: string; text: string; done: boolean }
export interface Plan { id: string; goal: string; tasks: PlanTask[] }

interface KbState {
  notes: Note[]; plans: Plan[]
  saveNote: (n: Omit<Note, 'updatedAt'>) => void
  removeNote: (id: string) => void
  createPlan: (goal: string, days: number, steps: string[]) => void
  toggleTask: (planId: string, taskId: string) => void
  removePlan: (id: string) => void
}

// Без ИИ: если шаги не заданы, берём универсальные фазы
const PHASES = ['Разобраться: собрать информацию и определить критерий результата', 'Сделать основу: первая рабочая версия', 'Довести: практика и исправление слабых мест', 'Итоги: проверить результат и записать выводы']

/** Равномерно раскладывает шаги по дням: каждый шаг получает свой интервал. */
export function buildTasks(days: number, steps: string[], start = new Date()): PlanTask[] {
  const list = steps.length ? steps : PHASES
  return list.map((text, i) => ({
    id: crypto.randomUUID(), text, done: false,
    date: format(addDays(start, Math.floor((i * days) / list.length)), 'yyyy-MM-dd'),
  }))
}

export const useKbStore = create<KbState>()(persist((set) => ({
  notes: [], plans: [],
  saveNote: n => set(s => {
    const note = { ...n, updatedAt: Date.now() }
    return { notes: s.notes.some(x => x.id === n.id) ? s.notes.map(x => x.id === n.id ? note : x) : [note, ...s.notes] }
  }),
  removeNote: id => set(s => ({ notes: s.notes.filter(n => n.id !== id) })),
  createPlan: (goal, days, steps) => set(s => ({ plans: [{ id: crypto.randomUUID(), goal, tasks: buildTasks(days, steps) }, ...s.plans] })),
  toggleTask: (planId, taskId) => set(s => ({ plans: s.plans.map(p => p.id !== planId ? p : { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) }) })),
  removePlan: id => set(s => ({ plans: s.plans.filter(p => p.id !== id) })),
}), { name: 'life-os:kb', version: 1, storage: appStorage }))
