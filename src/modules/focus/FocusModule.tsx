import { useState } from 'react'
import SessionView from './components/Session'
import Stats from './components/Stats'
import { useFocusStore } from './store'

export default function FocusModule() {
  const active = useFocusStore(s => s.active)
  const [view, setView] = useState<'session' | 'stats'>('session')
  return (
    <div className="space-y-5">
      {!active && (
        <div className="flex gap-1 rounded-2xl bg-card p-1">
          {([['session', 'Сессия'], ['stats', 'Статистика']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setView(id)} className={`min-h-[44px] flex-1 rounded-xl text-sm ${view === id ? 'bg-line text-white' : 'text-mute'}`}>{label}</button>
          ))}
        </div>
      )}
      {active || view === 'session' ? <SessionView /> : <Stats />}
    </div>
  )
}
