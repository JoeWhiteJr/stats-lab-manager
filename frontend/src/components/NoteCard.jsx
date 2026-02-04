import { Edit3, Trash2, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function NoteCard({ note, onEdit, onDelete }) {
  // Strip HTML tags for preview
  const previewText = note.content
    ? note.content.replace(/<[^>]*>/g, '').slice(0, 150)
    : 'No content'

  return (
    <div className="group bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-text-primary line-clamp-1">{note.title}</h4>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded text-text-secondary hover:text-primary-600 hover:bg-primary-50"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1.5 rounded text-text-secondary hover:text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <p className="mt-2 text-sm text-text-secondary line-clamp-3">
        {previewText}
      </p>

      <div className="mt-3 flex items-center gap-4 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <User size={12} />
          {note.creator_name}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {format(new Date(note.updated_at), 'MMM d, yyyy')}
        </span>
      </div>
    </div>
  )
}
