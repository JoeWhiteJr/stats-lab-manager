import { useState, useEffect, useRef } from 'react'

const EMOJI_CATEGORIES = {
  'Smileys': [
    '\u{1F600}', '\u{1F603}', '\u{1F604}', '\u{1F601}', '\u{1F605}', '\u{1F602}', '\u{1F923}', '\u{1F60A}',
    '\u{1F607}', '\u{1F970}', '\u{1F60D}', '\u{1F929}', '\u{1F618}', '\u{1F617}', '\u{1F61A}', '\u{1F619}',
    '\u{1F60B}', '\u{1F61B}', '\u{1F61C}', '\u{1F92A}', '\u{1F61D}', '\u{1F911}', '\u{1F917}', '\u{1F914}',
    '\u{1F910}', '\u{1F928}', '\u{1F610}', '\u{1F611}', '\u{1F636}', '\u{1F60F}', '\u{1F612}', '\u{1F644}',
    '\u{1F62C}', '\u{1F925}', '\u{1F60C}', '\u{1F614}', '\u{1F62A}', '\u{1F924}', '\u{1F634}', '\u{1F637}',
    '\u{1F912}', '\u{1F915}', '\u{1F922}', '\u{1F92E}', '\u{1F927}', '\u{1F975}', '\u{1F976}', '\u{1F974}'
  ],
  'Gestures': [
    '\u{1F44D}', '\u{1F44E}', '\u{1F44A}', '\u{270A}', '\u{1F91B}', '\u{1F91C}', '\u{1F44F}', '\u{1F64C}',
    '\u{1F450}', '\u{1F932}', '\u{1F91D}', '\u{1F64F}', '\u{270D}', '\u{1F485}', '\u{1F933}', '\u{1F4AA}',
    '\u{1F9BE}', '\u{1F9BF}', '\u{1F448}', '\u{1F449}', '\u{261D}', '\u{1F446}', '\u{1F595}', '\u{1F447}',
    '\u{270C}', '\u{1F91E}', '\u{1F91F}', '\u{1F918}', '\u{1F919}', '\u{1F44B}', '\u{1F44C}', '\u{1F90F}'
  ],
  'Hearts': [
    '\u{2764}', '\u{1F9E1}', '\u{1F49B}', '\u{1F49A}', '\u{1F499}', '\u{1F49C}', '\u{1F5A4}', '\u{1F90D}',
    '\u{1F90E}', '\u{1F498}', '\u{1F49D}', '\u{1F496}', '\u{1F497}', '\u{1F493}', '\u{1F49E}', '\u{1F495}',
    '\u{1F48C}', '\u{1F49F}'
  ],
  'Objects': [
    '\u{1F525}', '\u{2B50}', '\u{1F31F}', '\u{1F389}', '\u{1F38A}', '\u{1F388}', '\u{1F381}', '\u{1F3C6}',
    '\u{1F947}', '\u{1F948}', '\u{1F949}', '\u{26BD}', '\u{1F3C0}', '\u{1F3C8}', '\u{1F3B5}', '\u{1F3B6}',
    '\u{1F3A4}', '\u{1F3B8}', '\u{1F4A1}', '\u{1F4DA}', '\u{1F4BB}', '\u{1F4F1}', '\u{1F680}', '\u{2708}'
  ]
}

export const QUICK_REACTIONS = ['\u{1F44D}', '\u{2764}', '\u{1F602}', '\u{1F62E}', '\u{1F622}', '\u{1F525}']

export default function EmojiPicker({ onSelect, onClose }) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Smileys')
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const allEmojis = Object.values(EMOJI_CATEGORIES).flat()
  const filtered = search ? allEmojis : (EMOJI_CATEGORIES[activeCategory] || [])

  return (
    <div ref={ref} className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-lg border border-gray-200 w-72 z-50">
      <div className="p-2 border-b">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji..."
          className="w-full px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          autoFocus
        />
      </div>
      {!search && (
        <div className="flex gap-1 px-2 pt-2">
          {Object.keys(EMOJI_CATEGORIES).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-2 py-1 rounded-md ${
                activeCategory === cat ? 'bg-primary-100 text-primary-700 font-medium' : 'text-text-secondary hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-8 gap-0.5 p-2 max-h-48 overflow-y-auto">
        {filtered.map((emoji, i) => (
          <button
            key={i}
            onClick={() => { onSelect(emoji); onClose() }}
            className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded-md transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
