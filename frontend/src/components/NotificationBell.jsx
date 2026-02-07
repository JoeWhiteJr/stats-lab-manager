import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { useNotificationStore } from '../store/notificationStore'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { unreadCount, notifications, markAllRead, fetchNotifications, fetchUnreadCount } = useNotificationStore()
  const bellRef = useRef(null)

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleClick = () => {
    if (!isOpen) fetchNotifications({ limit: 10 })
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative" ref={bellRef}>
      <button onClick={handleClick} className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <Bell size={20} />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <span className="font-semibold text-text-primary dark:text-gray-100">Notifications</span>
            <button onClick={markAllRead} className="text-xs text-primary-600 dark:text-primary-400">Mark all read</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-text-secondary dark:text-gray-400">No notifications</div>
            ) : notifications.map((n) => (
              <div key={n.id} className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${!n.read_at ? 'bg-primary-50 dark:bg-primary-900/30' : ''}`}>
                <div className="font-medium text-sm text-text-primary dark:text-gray-100">{n.title}</div>
                {n.body && <div className="text-xs text-text-secondary dark:text-gray-400">{n.body}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
