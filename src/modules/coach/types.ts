export type QuestionKind = 'text' | 'score'
/** tag нужен для шаблонного «жёсткого зеркала» */
export type QuestionTag = 'win' | 'avoid' | 'lesson' | 'score'
export interface Question { id: string; text: string; kind: QuestionKind; tag?: QuestionTag }
export interface Entry {
  date: string // yyyy-MM-dd
  answers: Record<string, string>
  dayScore: number; scoreNote: string
  energy: number; mood: number; discipline: number
  avoided: boolean
  closedAt: number
}
export interface Principle { id: string; text: string }
export interface Settings { harshMirror: boolean; reminderTime: string }
