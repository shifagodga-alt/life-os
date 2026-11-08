import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useCoachStore } from '../store'
import { isAvoidance, mirrorComment } from '../utils/mirror'
import Slider from './Slider'

const SCORE_NOTE = '__scoreNote'

export default function Ritual() {
  const { questions, entries, principles, settings, saveEntry, reopenDay } = useCoachStore()
  const today = format(new Date(), 'yyyy-MM-dd')
  const done = entries[today]
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState(7)
  const [energy, setEnergy] = useState(5)
  const [mood, setMood] = useState(5)
  const [disc, setDisc] = useState(5)

  // Случайный принцип; пересчитывается при закрытии/открытии дня
  const principle = useMemo(
    () => (principles.length ? principles[Math.floor(Math.random() * principles.length)] : null),
    [principles, !!done], // eslint-disable-line react-hooks/exhaustive-deps
  )

  if (done) {
    const comment = settings.harshMirror ? mirrorComment(done, Object.values(entries)) : null
    const weak = done.dayScore <= 5 || done.discipline <= 5
    return (
      <div className="animate-[fade_.5s_ease] space-y-5 pt-10 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-accent text-3xl text-accent">✓</div>
        <h1 className="text-2xl font-semibold">День закрыт</h1>
        {comment && <p className="rounded-2xl border border-line bg-card p-5 text-left text-lg leading-snug">{comment}</p>}
        {weak && principle && <p className="text-left text-sm italic text-mute">Твой принцип: «{principle.text}»</p>}
        <button className="btn w-full border border-line text-mute" onClick={() => reopenDay(today)}>Редактировать день</button>
      </div>
    )
  }

  const submit = () => {
    const avoidQ = questions.find(q => q.tag === 'avoid')
    saveEntry({
      date: today, answers, dayScore: score, scoreNote: answers[SCORE_NOTE] ?? '',
      energy, mood, discipline: disc,
      avoided: avoidQ ? isAvoidance(answers[avoidQ.id] ?? '') : false,
      closedAt: Date.now(),
    })
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm text-mute">{format(new Date(), 'EEEE, d MMMM', { locale: ru })}</p>
        <h1 className="text-2xl font-semibold">Вечерний ритуал</h1>
      </header>
      {principle && <p className="text-sm italic text-mute">«{principle.text}»</p>}
      {questions.map(q => {
        const key = q.kind === 'score' ? SCORE_NOTE : q.id
        return (
          <section key={q.id} className="space-y-2">
            <h2 className="font-medium">{q.text}</h2>
            {q.kind === 'score' && <Slider label="Оценка дня" value={score} onChange={setScore} />}
            <textarea className="input min-h-[88px]" value={answers[key] ?? ''}
              placeholder={q.kind === 'score' ? 'Коротко: почему?' : 'Честно, без украшений…'}
              onChange={e => setAnswers(a => ({ ...a, [key]: e.target.value }))} />
          </section>
        )
      })}
      <section className="space-y-3 rounded-2xl border border-line bg-card p-4">
        <Slider label="Энергия" value={energy} onChange={setEnergy} />
        <Slider label="Настроение" value={mood} onChange={setMood} />
        <Slider label="Дисциплина" value={disc} onChange={setDisc} />
      </section>
      <button className="btn w-full bg-accent text-bg" onClick={submit}>Завершить день</button>
    </div>
  )
}
