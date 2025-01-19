interface NotifyOptions {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export const notify = (options: NotifyOptions): void => {
  const { type, message, duration = 3000 } = options
  
  // You can replace this with your preferred notification library
  // For now, we'll use a simple alert
  if (type === 'error') {
    console.error(message)
  } else {
    console.log(message)
  }
  alert(message)
}

// Convenience methods
notify.success = (message: string, duration?: number) => notify({ type: 'success', message, duration })
notify.error = (message: string, duration?: number) => notify({ type: 'error', message, duration })
notify.info = (message: string, duration?: number) => notify({ type: 'info', message, duration })
notify.warning = (message: string, duration?: number) => notify({ type: 'warning', message, duration }) 