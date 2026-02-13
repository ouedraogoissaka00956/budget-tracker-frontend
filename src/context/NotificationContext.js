import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef
} from 'react'
import notificationService from '../services/notificationService'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications doit être utilisé dans un NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // 🔒 empêche les appels si non connecté
  const isAuthenticated = !!localStorage.getItem('token')

  // 🔁 empêche double interval en StrictMode
  const intervalRef = useRef(null)

  const fetchNotifications = useCallback(async (read = null) => {
    if (!isAuthenticated) return

    setLoading(true)
    setError(null)
    try {
      const data = await notificationService.getAll(read)
      setNotifications(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const data = await notificationService.getUnreadCount()
      setUnreadCount(data.count)
    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error('Erreur lors du comptage:', err)
      }
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isAuthenticated) return

    fetchUnreadCount()

    if (!intervalRef.current) {
      intervalRef.current = setInterval(fetchUnreadCount, 30000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [fetchUnreadCount, isAuthenticated])

  // ---------- MUTATIONS ----------

  const createNotification = async (notificationData) => {
    setError(null)
    const newNotification = await notificationService.create(notificationData)
    setNotifications(prev => [newNotification, ...prev])
    setUnreadCount(prev => prev + 1)
    return newNotification
  }

  const markAsRead = async (id) => {
    setError(null)
    const updated = await notificationService.markAsRead(id)
    setNotifications(prev =>
      prev.map(n => (n._id === id ? updated : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
    return updated
  }

  const markAllAsRead = async () => {
    setError(null)
    await notificationService.markAllAsRead()
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true, readAt: new Date() }))
    )
    setUnreadCount(0)
  }

  const deleteNotification = async (id) => {
    setError(null)
    const notification = notifications.find(n => n._id === id)
    await notificationService.delete(id)
    setNotifications(prev => prev.filter(n => n._id !== id))
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const deleteAllRead = async () => {
    setError(null)
    await notificationService.deleteAllRead()
    setNotifications(prev => prev.filter(n => !n.read))
  }

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
