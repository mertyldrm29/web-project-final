interface NotificationOptions {
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  context?: string
  error?: unknown
}

export const useNotification = () => {
  const showNotification = (options: NotificationOptions) => {
    const { message, type = 'info', duration = 3000, context, error } = options
    
    // Log the message with context if available
    if (type === 'error' && context) {
      console.error(`[${context}]:`, error || message)
    } else if (type === 'error') {
      console.error(message)
    } else {
      console.log(message)
    }
    
    // For now, use alert. This can be replaced with a proper notification system
    alert(message)
  }

  const success = (message: string) => showNotification({ type: 'success', message })
  const error = (message: string, options?: { context?: string; error?: unknown }) => 
    showNotification({ type: 'error', message, ...options })
  const warning = (message: string) => showNotification({ type: 'warning', message })
  const info = (message: string) => showNotification({ type: 'info', message })
  
  return {
    showNotification,
    success,
    error,
    warning,
    info
  }
} 