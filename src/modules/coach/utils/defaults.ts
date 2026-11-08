import type { Question, Settings } from '../types'
export const DEFAULT_QUESTIONS: Question[] = [
  { id: 'win', text: 'Что сегодня реально сдвинуло меня вперёд?', kind: 'text', tag: 'win' },
  { id: 'avoid', text: 'Где я сегодня врал себе или избегал?', kind: 'text', tag: 'avoid' },
  { id: 'lesson', text: 'Какой самый важный урок дня?', kind: 'text', tag: 'lesson' },
  { id: 'score', text: 'Оценка дня (1–10) и почему', kind: 'score', tag: 'score' },
]
export const DEFAULT_SETTINGS: Settings = { harshMirror: true, reminderTime: '21:30' }
