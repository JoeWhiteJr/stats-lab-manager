import { useState } from 'react'
import { SmilePlus } from 'lucide-react'
import { QUICK_REACTIONS } from './EmojiPicker'

export default function MessageReactions({ reactions = [], currentUserId, onToggleReaction }) {
  const [showPicker, setShowPicker] = useState(false)

  const grouped = reactions.reduce((acc, r) => {
    if (!acc[r.emoji]) {
      acc[r.emoji] = { emoji: r.emoji, users: [], hasOwn: false }
    }
    acc[r.emoji].users.push(r.user_name || r.user_id)
    if (r.user_id === currentUserId) {
      acc[r.emoji].hasOwn = true
    }
    return acc
  }, {})

  const groups = Object.values(grouped)

  return (
    <div className="flex items-center gap-1 flex-wrap mt-1">
      {groups.map(({ emoji, users, hasOwn }) => (
        <button
          key={emoji}
          onClick={() => onToggleReaction(emoji)}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs border transition-colors ${
            hasOwn
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'bg-gray-50 border-gray-200 text-text-secondary hover:bg-gray-100'
          }`}
          title={users.join(', ')}
        >
          <span>{emoji}</span>
          <span className="font-medium">{users.length}</span>
        </button>
      ))}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-1 rounded-full text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
          title="Add reaction"
        >
          <SmilePlus size={14} />
        </button>
        {showPicker && (
          <div className="absolute bottom-full mb-1 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-1.5 flex gap-1 z-50">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onToggleReaction(emoji)
                  setShowPicker(false)
                }}
                className="w-7 h-7 flex items-center justify-center text-base hover:bg-gray-100 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
