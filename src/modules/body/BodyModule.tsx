import { useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { emptyEntry, useBodyStore } from './store'

const num = (v: string) => (v === '' ? null : Number(v.replace(',', '.')))

export default function BodyModule() {
  const { entries, update } = useBodyStore()
  const today = format(new Date(), 'yyyy-MM-dd')
  const e = entries[today] ?? emptyEntry(today)
  const data = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i), x = entries[format(d, 'yyyy-MM-dd')]
    return { d: format(d, 'd.MM'), Сон: x?.sleep ?? null, Вес: x?.weight ?? null, Самочувствие: x?.wellbeing ?? null }
  }), [entries])

  const chart = (key: 'Сон' | 'Вес' | 'Самочувствие', color: string) => (
    <div className="h-36 rounded-2xl border border-line bg-card p-2">
      <p className="px-2 text-xs text-mute">{key}, 14 дней</p>
      <ResponsiveContainer><LineChart data={data}>
        <CartesianGrid stroke="#26262b" vertical={false} />
        <XAxis dataKey="d" stroke="#8a8a94" fontSize={10} interval="preserveStartEnd" />
        <YAxis stroke="#8a8a94" fontSize={10} width={28} domain={['auto', 'auto']} />
        <Tooltip contentStyle={{ background: '#141417', border: '1px solid #26262b', borderRadius: 12 }} />
        <Line dataKey={key} stroke={color} strokeWidth={2} connectNulls />
      </LineChart></ResponsiveContainer>
    </div>
  )
  const field = 'flex items-center justify-between rounded-2xl border border-line bg-card px-4 min-h-[56px]'

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Тело · сегодня</h1>
      <label className={field}><span>Сон, часов</span>
        <input inputMode="decimal" className="w-20 bg-transparent text-right text-accent outline-none" value={e.sleep ?? ''} onChange={ev => update(today, { sleep: num(ev.target.value) })} /></label>
      <label className={field}><span>Вес, кг</span>
        <input inputMode="decimal" className="w-20 bg-transparent text-right text-accent outline-none" value={e.weight ?? ''} onChange={ev => update(today, { weight: num(ev.target.value) })} /></label>
      <div className={field}><span>Вода, стаканов</span>
        <div className="flex items-center gap-4">
          <button className="h-10 w-10 rounded-full border border-line" onClick={() => update(today, { water: Math.max(0, e.water - 1) })}>−</button>
          <span className="w-4 text-center text-accent">{e.water}</span>
          <button className="h-10 w-10 rounded-full border border-line" onClick={() => update(today, { water: e.water + 1 })}>+</button>
        </div></div>
      <section className="space-y-2 rounded-2xl border border-line bg-card p-4">
        <input className="input" placeholder="Тренировка (что делал)" value={e.workout} onChange={ev => update(today, { workout: ev.target.value })} />
        <input inputMode="numeric" className="input" placeholder="Минут" value={e.workoutMin ?? ''} onChange={ev => update(today, { workoutMin: num(ev.target.value) })} />
      </section>
      <label className="block rounded-2xl border border-line bg-card p-4">
        <div className="flex justify-between text-sm"><span className="text-mute">Самочувствие</span><span className="text-accent">{e.wellbeing}</span></div>
        <input type="range" min={1} max={10} value={e.wellbeing} onChange={ev => update(today, { wellbeing: +ev.target.value })} />
      </label>
      {chart('Сон', '#8b9cf7')}{chart('Вес', '#f7c26b')}{chart('Самочувствие', '#6bd6a4')}
    </div>
  )
}
