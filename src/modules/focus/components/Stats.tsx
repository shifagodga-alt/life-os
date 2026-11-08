import { useMemo, useState } from 'react'
import { format, subDays } from 'date-fns'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useFocusStore } from '../store'

export default function Stats() {
  const { sessions, rules, addRule, removeRule } = useFocusStore()
  const [text, setText] = useState('')
  const today = format(new Date(), 'yyyy-MM-dd')
  const min = (d: string) => Math.round(sessions.filter(s => s.date === d).reduce((a, s) => a + s.actualSec, 0) / 60)
  const data = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = subDays(new Date(), 6 - i)
    return { d: format(d, 'd.MM'), Минут: min(format(d, 'yyyy-MM-dd')) }
  }), [sessions]) // eslint-disable-line react-hooks/exhaustive-deps
  const add = () => { if (text.trim()) { addRule(text.trim()); setText('') } }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Статистика</h1>
      <p className="rounded-2xl border border-line bg-card p-4">Сегодня в фокусе: <span className="text-accent">{min(today)} мин</span></p>
      <div className="h-48 rounded-2xl border border-line bg-card p-2">
        <ResponsiveContainer><BarChart data={data}>
          <XAxis dataKey="d" stroke="#8a8a94" fontSize={11} /><YAxis stroke="#8a8a94" fontSize={11} width={28} />
          <Tooltip contentStyle={{ background: '#141417', border: '1px solid #26262b', borderRadius: 12 }} />
          <Bar dataKey="Минут" fill="#8b9cf7" radius={4} />
        </BarChart></ResponsiveContainer>
      </div>
      <ul className="space-y-2">
        {sessions.slice(0, 15).map(s => (
          <li key={s.id} className="rounded-2xl border border-line bg-card p-4 text-sm">
            <p>{s.goal}</p>
            <p className="text-mute">{format(s.startedAt, 'd.MM HH:mm')} · {Math.round(s.actualSec / 60)}/{s.plannedMin} мин · отвлечений: {s.distractions} · {s.completed ? 'завершена' : 'прервана'}</p>
          </li>
        ))}
      </ul>
      <h2 className="font-medium">Правила защиты внимания</h2>
      {rules.map(r => (
        <div key={r.id} className="flex items-center justify-between rounded-2xl border border-line bg-card p-4">
          <span>{r.text}</span><button className="text-mute" aria-label="Удалить" onClick={() => removeRule(r.id)}>✕</button>
        </div>
      ))}
      <div className="flex gap-2">
        <input className="input" placeholder="Новое правило" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="btn bg-accent text-bg" onClick={add}>+</button>
      </div>
    </div>
  )
}
