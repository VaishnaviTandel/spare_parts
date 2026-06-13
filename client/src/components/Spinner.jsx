export default function Spinner({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-8 h-8 border-2 border-white/10 border-t-brand-green rounded-full animate-spin" />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  )
}
