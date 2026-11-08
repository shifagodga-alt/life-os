import { useMemo, useState } from 'react'
import { format, parseISO, subDays } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useCoachStore } from '../store'
import type { Entry, Question } from '../types'

const LINES: [string, string][] = [['Оценка', '#8b9cf7'], ['Энергия', '#f7c26b'], ['Настроение', '#6bd6a4'], ['Дисциплина', '#f77b7b']]

export default function History() {
  const { entries, questions } = useCoachStore()
  const [range, setRange] = useState<7 | 30>(7)
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)

  const all = useMemo(() => Object.values(entries).sort((a, b) => b.date.localeCompare(a.date)), [entries])
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? all.filter(e => (Object.values(e.answers).join(' ') + ' ' + e.scoreNote).toLowerCase().includes(s)) : all
  }, [all, q])

  // Каждый день диапазона; пропуски = null (линия соединяется через connectNulls)
  const data = useMemo(() => Array.from({ length: range }, (_, i) => {
    const d = subDays(new Date(), range - 1 - i)
    const e = entries[format(d, 'yyyy-MM-dd')]
    return { d: format(d, 'd.MM'), Оценка: e?.dayScore ?? null, Энергия: e?.energy ?? null, Настроение: e?.mood ?? null, Дисциплина: e?.discipline ?? null }
  }), [entries, range])

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">История</h1>
      <div className="flex gap-2">
        {([7, 30] as const).map(r => (
          <button key={r} onClick={() => setRange(r)}
            className={`btn flex-1 border ${range === r ? 'border-accent text-accent' : 'border-line text-mute'}`}>{r} дней</button>
        ))}
      </div>
      <div className="h-56 rounded-2xl border border-line bg-card p-2">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="#26262b" vertical={false} />
            <XAxis dataKey="d" stroke="#8a8a94" fontSize={11} interval="preserveStartEnd" />
            <YAxis domain={[1, 10]} stroke="#8a8a94" fontSize={11} width={24} />
            <Tooltip contentStyle={{ background: '#141417', border: '1px solid #26262b', borderRadius: 12 }} />
            {LINES.map(([k, c]) => <Line key={k} dataKey={k} stroke={c} strokeWidth={2} dot={range === 7} connectNulls />)}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <input className="input" placeholder="Поиск по записям…" value={q} onChange={e => setQ(e.target.value)} />
      <ul className="space-y-2">
        {list.length === 0 && <li className="py-6 text-center text-mute">Записей пока нет</li>}
        {list.map(e => (
          <li key={e.date} className="rounded-2xl border border-line bg-card">
            <button className="flex min-h-[56px] w-full items-center justify-between px-4 text-left"
              onClick={() => setOpen(open === e.date ? null : e.date)}>
              <span>{format(parseISO(e.date), 'd MMMM, EEE', { locale: ru })}</span>
              <span className="text-accent">{e.dayScore}/10</span>
            </button>
            {open === e.date && <Details e={e} questions={questions} />}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Details({ e, questions }: { e: Entry; questions: Question[] }) {
  return (
    <div className="space-y-3 border-t border-line p-4 text-sm">
      {questions.map(q => {
        const a = q.kind === 'score' ? e.scoreNote : e.answers[q.id]
        return a ? <div key={q.id}><p className="text-mute">{q.text}</p><p className="whitespace-pre-wrap">{a}</p></div> : null
      })}
      <p className="text-mute">Энергия {e.energy} · Настроение {e.mood} · Дисциплина {e.discipline}</p>
    </div>
  )
}
