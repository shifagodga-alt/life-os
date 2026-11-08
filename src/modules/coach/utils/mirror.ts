import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { Entry } from '../types'

/** Ответ считается «избеганием», если там есть содержательный текст, а не «нет»/«-». */
export const isAvoidance = (text: string) => {
  const t = text.trim().toLowerCase()
  return t.length > 3 && !/^(нет|ничего|не было|-+|—)\.?$/.test(t)
}

/** Шаблонный комментарий (без ИИ). `all` — уже включает текущий день. */
export function mirrorComment(entry: Entry, all: Entry[]): string {
  const recent = all.filter(e => e.avoided && e.date <= entry.date &&
    differenceInCalendarDays(parseISO(entry.date), parseISO(e.date)) < 10).length
  if (entry.avoided && recent >= 2) return `Ты снова избежал главного. Это уже ${recent}-й раз за 10 дней.`
  if (entry.avoided) return 'Ты назвал, где избегал. Завтра сделай именно это первым делом.'
  if (entry.discipline <= 4) return 'Дисциплина ниже 5. Слова не заменяют действия — завтра без торга.'
  if (entry.dayScore >= 8 && entry.discipline >= 7) return 'Хороший день. Сохраняй этот стандарт.'
  if (entry.dayScore <= 4) return 'Слабый день. Не оправдывай — найди одну причину и убери её.'
  return 'Нормальный день — но «нормально» не меняет жизнь. Что завтра будет на 10% жёстче?'
}
