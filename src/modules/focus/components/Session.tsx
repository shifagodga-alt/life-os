import { useEffect, useState } from 'react'
import { useFocusStore } from '../store'

const PRESETS = [25, 50, 90]

export default function SessionView() {
  const { active, rules, defaultMin, start, distract, finish, setDefaultMin } = useFocusStore()
  const [goal, setGoal] = useState('')
  const [checked, setChecked] = useState<string[]>([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [active])

  const leftSec = active ? Math.max(0, active.plannedMin * 60 - Math.floor((now - active.startedAt) / 1000)) : 0
  useEffect(() => { if (active && leftSec === 0) finish(true) }, [active, leftSec, finish])

  if (active) {
    const total = active.plannedMin * 60
    const mm = String(Math.floor(leftSec / 60)).padStart(2, '0'), ss = String(leftSec % 60).padStart(2, '0')
    return (
      <div className="space-y-8 pt-6 text-center">
        <p className="text-mute">Цель сессии</p>
        <h1 className="text-xl font-semibold leading-snug">{active.goal}</h1>
        <div className="text-7xl font-light tabular-nums">{mm}:{ss}</div>
        <div className="h-1.5 overflow-hidden rounded-full bg-line"><div className="h-full bg-accent transition-all" style={{ width: `${((total - leftSec) / total) * 100}%` }} /></div>
        <button className="btn w-full border border-line" onClick={distract}>Отвлёкся · {active.distractions}</button>
        <button className="btn w-full text-mute" onClick={() => confirm('Прервать сессию?') && finish(false)}>Прервать</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Глубокая работа</h1>
      <textarea className="input min-h-[88px]" placeholder="Что конкретно будет сделано к концу сессии?" value={goal} onChange={e => setGoal(e.target.value)} />
      <div className="flex gap-2">
        {PRESETS.map(m => (
          <button key={m} onClick={() => setDefaultMin(m)} className={`btn flex-1 border ${defaultMin === m ? 'border-accent text-accent' : 'border-line text-mute'}`}>{m} мин</button>
        ))}
      </div>
      <section className="space-y-2 rounded-2xl border border-line bg-card p-4">
        <h2 className="text-sm text-mute">Защита внимания</h2>
        {rules.map(r => (
          <label key={r.id} className="flex min-h-[44px] items-center gap-3">
            <input type="checkbox" className="h-5 w-5 accent-[#8b9cf7]" checked={checked.includes(r.id)}
              onChange={e => setChecked(c => e.target.checked ? [...c, r.id] : c.filter(x => x !== r.id))} />{r.text}
          </label>
        ))}
      </section>
      <button disabled={!goal.trim()} className="btn w-full bg-accent text-bg disabled:opacity-40"
        onClick={() => { start(goal.trim(), defaultMin); setGoal(''); setChecked([]) }}>Начать сессию</button>
    </div>
  )
}
