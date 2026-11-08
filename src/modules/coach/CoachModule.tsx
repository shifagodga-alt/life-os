import { useState } from 'react'
import Ritual from './components/Ritual'
import History from './components/History'
import Principles from './components/Principles'
import SettingsView from './components/SettingsView'

const VIEWS = [
  { id: 'ritual', label: 'Ритуал', C: Ritual },
  { id: 'history', label: 'История', C: History },
  { id: 'principles', label: 'Принципы', C: Principles },
  { id: 'settings', label: 'Настройки', C: SettingsView },
] as const

export default function CoachModule() {
  const [view, setView] = useState<(typeof VIEWS)[number]['id']>('ritual')
  const { C } = VIEWS.find(v => v.id === view)!
  return (
    <div className="space-y-5">
      <div className="flex gap-1 overflow-x-auto rounded-2xl bg-card p-1">
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            className={`min-h-[44px] flex-1 whitespace-nowrap rounded-xl px-3 text-sm ${view === v.id ? 'bg-line text-white' : 'text-mute'}`}>{v.label}</button>
        ))}
      </div>
      <C />
    </div>
  )
}
