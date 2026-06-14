import { useEffect, useState } from 'react'
import { ArrowRight, Cpu } from 'lucide-react'
import { getParts } from '../data/api'
import Spinner from '../components/Spinner'

function StatBox({ label, value, danger }) {
  return (
    <div className="bg-white/5 rounded-xl p-3">
      <p className="text-[11px] text-slate-500 mb-0.5">{label}</p>
      <p className={`text-xl font-semibold ${danger ? 'text-red-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function HPCard({ hp, parts, onClick }) {
  const cats  = [...new Set(parts.map((p) => p.category))]
  const low   = parts.filter((p) => p.qty <= 1).length
  const val   = parts.reduce((s, p) => s + p.price * p.qty, 0)

  const isBlue    = hp === '2.5'
  const badgeCls  = isBlue ? 'bg-blue-500/15 text-blue-300'   : 'bg-amber-500/15 text-amber-300'
  const borderCls = isBlue ? 'border-t-blue-500/50'            : 'border-t-amber-500/50'
  const arrowCls  = isBlue ? 'text-blue-400'                   : 'text-amber-400'

  return (
    <button
      onClick={() => onClick(hp)}
      className={`glass rounded-3xl p-6 text-left w-full card-hover cursor-pointer group border-t-2 ${borderCls} shadow-xl animate-fade-in`}
    >
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4 ${badgeCls}`}>
        <Cpu size={11} />
        {hp} HP Machine
      </span>

      <h2 className="text-3xl font-bold text-white mb-1">{hp} HP</h2>
      <p className="text-sm text-slate-400 mb-5">
        {cats.length ? cats.join(' · ') : 'No parts added yet'}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatBox label="Total parts"   value={parts.length} />
        <StatBox label="Low stock"     value={low}  danger={low > 0} />
        <StatBox label="Categories"    value={cats.length} />
        <StatBox label="Stock value"   value={`₹${val.toLocaleString('en-IN')}`} />
      </div>

      <div className={`flex items-center gap-1 text-sm font-medium ${arrowCls} group-hover:gap-2 transition-all`}>
        View parts <ArrowRight size={15} />
      </div>
    </button>
  )
}

export default function HomePage({ onSelect }) {
  const [parts, setParts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getParts()
      .then((r) => setParts(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner text="Loading inventory…" />

  return (
    <div className="animate-slide-up">
      <p className="text-sm text-slate-500 mb-5">Select a machine to manage its spare parts</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <HPCard hp="2.5" parts={parts.filter((p) => p.hp === '2.5')} onClick={onSelect} />
        <HPCard hp="6"   parts={parts.filter((p) => p.hp === '6')}   onClick={onSelect} />
        <HPCard hp="3.5" parts={parts.filter((p) => p.hp === '3.5')} onClick={onSelect} />
      </div>
    </div>
  )
}
