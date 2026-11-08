import { useState } from 'react'
import { useCoachStore } from '../store'

export default function Principles() {
  const { principles, addPrinciple, removePrinciple } = useCoachStore()
  const [text, setText] = useState('')
  const add = () => { if (text.trim()) { addPrinciple(text.trim()); setText('') } }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Мои принципы</h1>
      <div className="flex gap-2">
        <input className="input" value={text} placeholder="Новый принцип" onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
        <button className="btn bg-accent text-bg" onClick={add}>+</button>
      </div>
      <ul className="space-y-2">
        {principles.map(p => (
          <li key={p.id} className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-card p-4">
            <span>{p.text}</span>
            <button className="text-mute" aria-label="Удалить" onClick={() => removePrinciple(p.id)}>✕</button>
          </li>
        ))}
        {!principles.length && <li className="py-6 text-center text-mute">Добавь правила, по которым хочешь жить</li>}
      </ul>
    </div>
  )
}
