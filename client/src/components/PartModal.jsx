import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../data/categories'

export default function PartModal({ mode, initialData = {}, hp, onSave, onClose, saving }) {
  const [form, setForm] = useState({
    category: CATEGORIES[0],
    name: '',
    price: '',
    qty: '',
    ...initialData,
  })

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.name.trim())                              return alert('Part name is required')
    if (isNaN(parseFloat(form.price)) || form.price < 0) return alert('Enter a valid price')
    if (isNaN(parseInt(form.qty))    || form.qty < 0)    return alert('Enter a valid quantity')
    onSave({ ...form, price: parseFloat(form.price), qty: parseInt(form.qty), hp })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-strong rounded-2xl p-6 w-[340px] animate-slide-up shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-white">
            {mode === 'add' ? `Add Part — ${hp} HP` : 'Edit Part'}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#1a2035]">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Part Name</label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Motor Bearing 6202"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-green transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Price (₹)</label>
              <input
                type="number" min="0"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Quantity</label>
              <input
                type="number" min="0"
                value={form.qty}
                onChange={(e) => set('qty', e.target.value)}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-green transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2 text-sm font-medium bg-brand-green hover:bg-brand-dark text-white rounded-xl transition-all shadow-lg shadow-brand-green/20 disabled:opacity-60"
          >
            {saving ? 'Saving…' : mode === 'add' ? 'Add Part' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
