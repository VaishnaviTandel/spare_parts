import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { getParts, createPart, updatePart, buyPart, deletePart } from '../data/api'
import PartCard   from '../components/PartCard'
import PartModal  from '../components/PartModal'
import Spinner    from '../components/Spinner'
import { useToast } from '../context/ToastContext'

function StatPill({ label, value, danger }) {
  return (
    <div className="glass rounded-xl px-4 py-3 text-center">
      <p className="text-[11px] text-slate-500 mb-0.5">{label}</p>
      <p className={`text-xl font-semibold ${danger ? 'text-red-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

export default function DetailPage({ hp }) {
  const toast = useToast()
  const [parts,   setParts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [modal,   setModal]   = useState(null)   // { mode: 'add'|'edit', data }
  const [queries, setQueries] = useState({})

  const load = () => {
    setLoading(true)
    getParts(hp)
      .then((r) => setParts(r.data))
      .catch(() => toast('Failed to load parts', 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [hp])

  const cats = [...new Set(parts.map((p) => p.category))]
  const low  = parts.filter((p) => p.qty <= 1).length
  const val  = parts.reduce((s, p) => s + p.price * p.qty, 0)

  const handleBuy = async (id) => {
    const part = parts.find((p) => p._id === id)
    try {
      const { data } = await buyPart(id)
      setParts((prev) => prev.map((p) => (p._id === id ? data : p)))
      toast(`Bought 1× ${part.name}. Stock: ${data.qty}`)
    } catch (err) {
      toast(err.response?.data?.error || 'Buy failed', 'error')
    }
  }

  const handleDelete = async (id) => {
    const part = parts.find((p) => p._id === id)
    if (!window.confirm(`Delete "${part.name}"?`)) return
    try {
      await deletePart(id)
      setParts((prev) => prev.filter((p) => p._id !== id))
      toast(`Deleted ${part.name}`)
    } catch {
      toast('Delete failed', 'error')
    }
  }

  const handleSave = async (form) => {
    setSaving(true)
    try {
      if (modal.mode === 'add') {
        const { data } = await createPart(form)
        setParts((prev) => [data, ...prev])
        toast(`Added ${form.name}`)
      } else {
        const { data } = await updatePart(modal.data._id, form)
        setParts((prev) => prev.map((p) => (p._id === data._id ? data : p)))
        toast(`Updated ${form.name}`)
      }
      setModal(null)
    } catch (err) {
      toast(err.response?.data?.error || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const isBlue  = hp === '2.5'
  const badgeCls = isBlue ? 'bg-blue-500/15 text-blue-300' : 'bg-amber-500/15 text-amber-300'

  return (
    <div className="animate-slide-up">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatPill label="Total parts"  value={parts.length} />
        <StatPill label="Low stock"    value={low}   danger={low > 0} />
        <StatPill label="Categories"   value={cats.length} />
        <StatPill label="Stock value"  value={`₹${val.toLocaleString('en-IN')}`} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeCls}`}>
          {hp} HP Parts
        </span>
        <button
          onClick={() => setModal({ mode: 'add', data: {} })}
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-brand-green hover:bg-brand-dark text-white transition-all shadow-lg shadow-brand-green/20"
        >
          <Plus size={15} /> Add part
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <Spinner />
      ) : parts.length === 0 ? (
        <div className="text-center py-20 text-slate-500 glass rounded-2xl">
          No parts yet.{' '}
          <button
            className="text-brand-green hover:underline"
            onClick={() => setModal({ mode: 'add', data: {} })}
          >
            Add your first part →
          </button>
        </div>
      ) : (
        cats.map((cat) => {
          const q = (queries[cat] || '').trim().toLowerCase()
          let catParts = parts.filter((p) => p.category === cat)
          if (q) catParts = catParts.filter((p) => p.name.toLowerCase().includes(q))
          return (
            <div key={cat} className="mb-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {cat}
                </span>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[11px] text-slate-600">{catParts.length}</span>
              </div>

              <div className="mb-3">
                <input
                  value={queries[cat] || ''}
                  onChange={(e) => setQueries((prev) => ({ ...prev, [cat]: e.target.value }))}
                  placeholder={`Search ${cat}…`}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-green transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {catParts.map((part) => (
                  <PartCard
                    key={part._id}
                    part={part}
                    onBuy={handleBuy}
                    onEdit={(p) => setModal({ mode: 'edit', data: p })}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )
        })
      )}

      {/* Modal */}
      {modal && (
        <PartModal
          mode={modal.mode}
          initialData={modal.data}
          hp={hp}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
