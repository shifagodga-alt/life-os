export default function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-sm"><span className="text-mute">{label}</span><span className="text-accent">{value}</span></div>
      <input type="range" min={1} max={10} value={value} onChange={e => onChange(+e.target.value)} />
    </label>
  )
}
