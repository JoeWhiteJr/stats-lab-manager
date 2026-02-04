import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

export default function ActionItem({ action, onToggle, onDelete, users = [] }) {
  const [isHovered, setIsHovered] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: action.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const assignedUser = users.find(u => u.id === action.assigned_to)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-start gap-3 p-3 rounded-lg border transition-colors ${
        action.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-200 hover:border-primary-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </button>

      <button
        onClick={() => onToggle(action.id, !action.completed)}
        className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-md border-2 transition-colors ${
          action.completed
            ? 'bg-secondary-500 border-secondary-500'
            : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        {action.completed && (
          <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm ${action.completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
          {action.title}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          {action.due_date && (
            <span className={`flex items-center gap-1 text-xs ${
              new Date(action.due_date) < new Date() && !action.completed
                ? 'text-red-600'
                : 'text-text-secondary'
            }`}>
              <Calendar size={12} />
              {format(new Date(action.due_date), 'MMM d')}
            </span>
          )}
          {assignedUser && (
            <span className="flex items-center gap-1 text-xs text-text-secondary">
              <User size={12} />
              {assignedUser.name}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(action.id)}
        className={`p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
