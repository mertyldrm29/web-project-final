import { notify } from '~/utils/notify'

export const useError = () => {
  const handleError = (error: unknown, context: string) => {
    let message: string
    
    if (error instanceof Error) {
      message = error.message
      if (message === 'Bu ürünün stoğu tükenmiştir!') {
        notify.warning(message)
        return
      }
    } else {
      message = `${context}: Beklenmeyen bir hata oluştu`
    }
    
    console.error(`${context}:`, error)
    notify.error(message)
  }

  const handleSuccess = (message: string) => {
    notify.success(message)
  }

  return {
    handleError,
    handleSuccess
  }
} 