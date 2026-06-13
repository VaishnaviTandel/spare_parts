import { useEffect, useState } from 'react'
import { History } from 'lucide-react'
import { getLogs } from '../data/api'
import Spinner from '../components/Spinner'
import { useToast } from '../context/ToastContext'

export default function LogPage() {
  const toast = useToast()
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLogs()
      .then((r) => setLogs(r.data))
      .catch(() => toast('Failed to load logs', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const fmtDate = (iso) =>
    new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
    })

  return (
    <div className="glass rounded-2xl p-5 animate-slide-up">
      <h2 className="text-[15px] font-semibold text-white flex items-center gap-2 mb-5">
        <History size={16} className="text-brand-green" /> Activity Log
      </h2>

      {loading ? <Spinner /> : logs.length === 0 ? (
        <div className="text-center py-14 text-slate-500 text-sm">
          No activity yet. Buy a part or make edits to see logs here.
        </div>
      ) : (
        <div className="space-y-px">
          {logs.map((entry) => (
            <div
              key={entry._id}
              className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-b-0 animate-fade-in"
            >
              <p className="text-sm text-slate-300">{entry.msg}</p>
              <span className="text-[11px] text-slate-600 whitespace-nowrap flex-shrink-0">
                {fmtDate(entry.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
