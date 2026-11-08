import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useKbStore, type Note } from './store'

export default function KbModule() {
  const [view, setView] = useState<'notes' | 'plans'>('notes')
  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-2xl bg-card p-1">
        {([['notes', 'Заметки'], ['plans', 'Планы']] as const).map(([id, l]) => (
          <button key={id} onClick={() => setView(id)} className={`min-h-[44px] flex-1 rounded-xl text-sm ${view === id ? 'bg-line text-white' : 'text-mute'}`}>{l}</button>
        ))}
      </div>
      {view === 'notes' ? <Notes /> : <Plans />}
    </div>
  )
}

function Notes() {
  const { notes, saveNote, removeNote } = useKbStore()
  const [q, setQ] = useState(''), [tag, setTag] = useState<string | null>(null)
  const [edit, setEdit] = useState<Omit<Note, 'updatedAt'> | null>(null)
  const tags = useMemo(() => [...new Set(notes.flatMap(n => n.tags))], [notes])
  const list = notes.filter(n => (!tag || n.tags.includes(tag)) && (n.title + n.body + n.tags.join(' ')).toLowerCase().includes(q.toLowerCase()))

  if (edit) return (
    <div className="space-y-3">
      <input className="input" placeholder="Заголовок" value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} />
      <textarea className="input min-h-[200px]" placeholder="Текст" value={edit.body} onChange={e => setEdit({ ...edit, body: e.target.value })} />
      <input className="input" placeholder="Теги через запятую" value={edit.tags.join(', ')} onChange={e => setEdit({ ...edit, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
      <button className="btn w-full bg-accent text-bg" onClick={() => { if (edit.title.trim()) { saveNote(edit); setEdit(null) } }}>Сохранить</button>
      <button className="btn w-full text-mute" onClick={() => setEdit(null)}>Отмена</button>
    </div>
  )
  return (
    <div className="space-y-3">
      <button className="btn w-full bg-accent text-bg" onClick={() => setEdit({ id: crypto.randomUUID(), title: '', body: '', tags: [] })}>+ Новая заметка</button>
      <input className="input" placeholder="Поиск…" value={q} onChange={e => setQ(e.target.value)} />
      <div className="flex gap-2 overflow-x-auto">
        {tags.map(t => <button key={t} onClick={() => setTag(tag === t ? null : t)} className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm ${tag === t ? 'border-accent text-accent' : 'border-line text-mute'}`}>#{t}</button>)}
      </div>
      {list.length === 0 && <p className="py-6 text-center text-mute">Заметок нет</p>}
      {list.map(n => (
        <div key={n.id} className="rounded-2xl border border-line bg-card p-4">
          <button className="w-full text-left" onClick={() => setEdit(n)}>
            <p className="font-medium">{n.title}</p>
            <p className="line-clamp-2 text-sm text-mute">{n.body}</p>
          </button>
          <button className="mt-2 text-xs text-mute" onClick={() => confirm('Удалить заметку?') && removeNote(n.id)}>Удалить</button>
        </div>
      ))}
    </div>
  )
}

function Plans() {
  const { plans, createPlan, toggleTask, removePlan } = useKbStore()
  const [goal, setGoal] = useState(''), [days, setDays] = useState('14'), [steps, setSteps] = useState('')
  const create = () => {
    if (!goal.trim()) return
    createPlan(goal.trim(), Math.max(1, +days || 14), steps.split('\n').map(s => s.trim()).filter(Boolean))
    setGoal(''); setSteps('')
  }
  return (
    <div className="space-y-4">
      <section className="space-y-2 rounded-2xl border border-line bg-card p-4">
        <h2 className="font-medium">Генератор плана</h2>
        <input className="input" placeholder="Цель" value={goal} onChange={e => setGoal(e.target.value)} />
        <input className="input" inputMode="numeric" placeholder="За сколько дней" value={days} onChange={e => setDays(e.target.value)} />
        <textarea className="input min-h-[96px]" placeholder="Шаги, по одному в строке (пусто — стандартные фазы)" value={steps} onChange={e => setSteps(e.target.value)} />
        <button className="btn w-full bg-accent text-bg" onClick={create}>Составить план</button>
      </section>
      {plans.map(p => (
        <section key={p.id} className="space-y-1 rounded-2xl border border-line bg-card p-4">
          <div className="flex justify-between"><h3 className="font-medium">{p.goal}</h3>
            <button className="text-mute" aria-label="Удалить" onClick={() => confirm('Удалить план?') && removePlan(p.id)}>✕</button></div>
          {p.tasks.map(t => (
            <label key={t.id} className="flex min-h-[48px] items-start gap-3 py-2">
              <input type="checkbox" className="mt-1 h-5 w-5 accent-[#8b9cf7]" checked={t.done} onChange={() => toggleTask(p.id, t.id)} />
              <span className={t.done ? 'text-mute line-through' : ''}>{t.text}<br /><span className="text-xs text-mute">{format(parseISO(t.date), 'd MMMM', { locale: ru })}</span></span>
            </label>
          ))}
        </section>
      ))}
    </div>
  )
}
