import { useState } from 'react'
import { useCoachStore } from '../store'
import { DEFAULT_QUESTIONS } from '../utils/defaults'

export default function SettingsView() {
  const { questions, setQuestions, settings, updateSettings } = useCoachStore()
  const [text, setText] = useState('')
  const edit = (id: string, t: string) => setQuestions(questions.map(q => (q.id === id ? { ...q, text: t } : q)))
  const add = () => {
    if (!text.trim()) return
    setQuestions([...questions, { id: crypto.randomUUID(), text: text.trim(), kind: 'text' }])
    setText('')
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Настройки</h1>
      <label className="flex min-h-[56px] items-center justify-between rounded-2xl border border-line bg-card px-4">
        <span>Жёсткое зеркало</span>
        <input type="checkbox" className="h-6 w-6 accent-[#8b9cf7]" checked={settings.harshMirror} onChange={e => updateSettings({ harshMirror: e.target.checked })} />
      </label>
      <label className="flex min-h-[56px] items-center justify-between rounded-2xl border border-line bg-card px-4">
        <span>Напоминание</span>
        <input type="time" className="bg-transparent text-accent" value={settings.reminderTime} onChange={e => updateSettings({ reminderTime: e.target.value })} />
      </label>
      <section className="space-y-2">
        <h2 className="font-medium">Вопросы ритуала</h2>
        {questions.map(q => (
          <div key={q.id} className="flex gap-2">
            <input className="input" value={q.text} onChange={e => edit(q.id, e.target.value)} />
            <button className="btn text-mute" aria-label="Удалить" onClick={() => setQuestions(questions.filter(x => x.id !== q.id))}>✕</button>
          </div>
        ))}
        <div className="flex gap-2">
          <input className="input" placeholder="Новый вопрос" value={text} onChange={e => setText(e.target.value)} />
          <button className="btn bg-accent text-bg" onClick={add}>+</button>
        </div>
        <button className="text-sm text-mute underline" onClick={() => setQuestions(DEFAULT_QUESTIONS)}>Сбросить к стандартным</button>
      </section>
    </div>
  )
}
