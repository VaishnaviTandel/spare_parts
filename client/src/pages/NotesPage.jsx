import { useEffect, useState } from 'react'
import { Plus, X, StickyNote } from 'lucide-react'
import { getNotes, createNote, deleteNote } from '../data/api'
import Spinner from '../components/Spinner'
import { useToast } from '../context/ToastContext'

export default function NotesPage() {
  const toast   = useToast()
  const [notes,   setNotes]   = useState([])
  const [loading, setLoading] = useState(true)
  const [input,   setInput]   = useState('')
  const [adding,  setAdding]  = useState(false)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    getNotes()
      .then((r) => setNotes(r.data))
      .catch(() => toast('Failed to load notes', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    if (!input.trim()) return
    setSaving(true)
    try {
      const { data } = await createNote(input.trim())
      setNotes((n) => [data, ...n])
      setInput('')
      setAdding(false)
      toast('Note saved')
    } catch {
      toast('Failed to save note', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNote(id)
      setNotes((n) => n.filter((x) => x._id !== id))
      toast('Note deleted')
    } catch {
      toast('Delete failed', 'error')
    }
  }

  const fmtDate = (iso) =>
    new Date(iso).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
    })

  return (
    <div className="glass rounded-2xl p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-semibold text-white flex items-center gap-2">
          <StickyNote size={16} className="text-brand-green" /> Notes
        </h2>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-xl bg-brand-green hover:bg-brand-dark text-white transition-all"
          >
            <Plus size={14} /> Add note
          </button>
        )}
      </div>

      {adding && (
        <div className="flex gap-2 mb-4 animate-slide-up">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="Type a note — maintenance reminder, supplier contact…"
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-brand-green"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium bg-brand-green hover:bg-brand-dark text-white rounded-xl transition-all disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={() => { setAdding(false); setInput('') }}
            className="px-3 py-2 text-sm text-slate-400 hover:text-white border border-white/10 rounded-xl hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      )}

      {loading ? <Spinner /> : notes.length === 0 && !adding ? (
        <div className="text-center py-14 text-slate-500 text-sm">
          No notes yet. Add reminders, supplier info, or anything useful.
        </div>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note._id}
              className="flex items-start justify-between gap-3 p-3 bg-white/5 rounded-xl border border-white/5 animate-fade-in"
            >
              <div>
                <p className="text-sm text-white">{note.text}</p>
                <p className="text-[11px] text-slate-500 mt-1">{fmtDate(note.createdAt)}</p>
              </div>
              <button
                onClick={() => handleDelete(note._id)}
                className="text-slate-600 hover:text-red-400 transition-colors mt-0.5 flex-shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
