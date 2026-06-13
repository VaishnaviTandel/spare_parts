import { ShoppingCart, Pencil, Trash2 } from 'lucide-react'

export default function PartCard({ part, onBuy, onEdit, onDelete, loading }) {
  const isLow = part.qty > 0 && part.qty <= 2
  const isOut = part.qty === 0

  return (
    <div
      className={`glass rounded-2xl p-4 flex flex-col gap-2.5 card-hover animate-fade-in ${
        isLow ? 'border-l-2 border-l-red-500' : isOut ? 'opacity-60' : ''
      }`}
    >
      <p className="text-[14px] font-medium text-white leading-snug">{part.name}</p>
      <p className="text-[17px] font-semibold text-brand-green">
        ₹{part.price.toLocaleString('en-IN')}
      </p>
      <p className={`text-[12px] flex items-center gap-1.5 ${
        isOut ? 'text-slate-500' : isLow ? 'text-red-400 font-medium' : 'text-slate-400'
      }`}>
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${
          isOut ? 'bg-slate-500' : isLow ? 'bg-red-400' : 'bg-brand-green'
        }`} />
        {isOut ? 'Out of stock' : `Stock: ${part.qty}${isLow ? ' — Low' : ''}`}
      </p>

      <div className="flex gap-1.5 mt-1">
        <button
          onClick={() => onBuy(part._id)}
          disabled={isOut || loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium rounded-xl bg-brand-green hover:bg-brand-dark text-white transition-all disabled:bg-white/5 disabled:text-slate-600 disabled:cursor-not-allowed shadow-md shadow-brand-green/10"
        >
          <ShoppingCart size={12} />
          {isOut ? 'Out of stock' : 'Buy'}
        </button>
        <button
          onClick={() => onEdit(part)}
          disabled={loading}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-all"
          aria-label={`Edit ${part.name}`}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(part._id)}
          disabled={loading}
          className="p-1.5 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-all"
          aria-label={`Delete ${part.name}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
