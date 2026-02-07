import { useEffect, useRef } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useAuthStore } from '../../store/authStore'

export function requestNotificationPermission() {
  if (!('Notification' in window)) return Promise.resolve('denied')
  if (Notification.permission === 'granted') return Promise.resolve('granted')
  if (Notification.permission === 'denied') return Promise.resolve('denied')
  return Notification.requestPermission()
}

export function showBrowserNotification(title, body, onClick) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return

  const notification = new Notification(title, {
    body,
    icon: '/favicon.ico',
    tag: 'chat-message',
    renotify: true
  })

  if (onClick) {
    notification.onclick = () => {
      window.focus()
      onClick()
      notification.close()
    }
  }

  setTimeout(() => notification.close(), 5000)
}

export function useChatNotifications() {
  const messages = useChatStore((s) => s.messages)
  const currentRoom = useChatStore((s) => s.currentRoom)
  const user = useAuthStore((s) => s.user)
  const prevMessagesLenRef = useRef(0)
  const hasRequestedRef = useRef(false)

  useEffect(() => {
    if (!hasRequestedRef.current) {
      hasRequestedRef.current = true
      requestNotificationPermission()
    }
  }, [])

  useEffect(() => {
    if (!currentRoom || !user) return

    const newCount = messages.length
    const prevCount = prevMessagesLenRef.current
    prevMessagesLenRef.current = newCount

    if (prevCount === 0 || newCount <= prevCount) return

    const newMessages = messages.slice(prevCount)
    for (const msg of newMessages) {
      if (msg.sender_id === user.id || msg.deleted_at) continue

      if (!document.hasFocus()) {
        showBrowserNotification(
          msg.sender_name || 'New message',
          msg.content?.substring(0, 100) || 'Sent a message',
          null
        )
      }
    }
  }, [messages, currentRoom, user])
}
