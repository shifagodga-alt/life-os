import { useState } from 'react'
import CoachModule from './modules/coach/CoachModule'
import FocusModule from './modules/focus/FocusModule'
import BodyModule from './modules/body/BodyModule'
import KbModule from './modules/kb/KbModule'

const TABS = [
  { id: 'coach', label: 'Зеркало', icon: '◐' },
  { id: 'focus', label: 'Фокус', icon: '◎' },
  { id: 'body', label: 'Тело', icon: '♡' },
  { id: 'kb', label: 'Знания', icon: '▤' },
] as const
type TabId = (typeof TABS)[number]['id']

export default function App() {
  const [tab, setTab] = useState<TabId>('coach')
  return (
    <div className="mx-auto flex h-full max-w-[480px] flex-col">
      <main className="flex-1 overflow-y-auto px-4 pt-[max(env(safe-area-inset-top),16px)] pb-6">
        {tab === 'coach' ? <CoachModule /> : tab === 'focus' ? <FocusModule /> : tab === 'body' ? <BodyModule /> : tab === 'kb' ? <KbModule /> : (
          <div className="grid h-full place-items-center text-mute">Модуль скоро появится</div>
        )}
      </main>
      <nav className="grid grid-cols-4 border-t border-line bg-bg pb-[env(safe-area-inset-bottom)]">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex min-h-[60px] flex-col items-center justify-center gap-0.5 text-xs ${tab === t.id ? 'text-accent' : 'text-mute'}`}>
            <span className="text-xl">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
