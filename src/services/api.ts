import axios, { AxiosError } from 'axios'
import { showGlobalError } from '@/contexts/SnackbarContext'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Extract error message from response
    let errorMessage = 'Ha ocurrido un error'

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as
        | { message?: string; error?: string }
        | undefined
      errorMessage =
        data?.message ||
        data?.error ||
        `Error ${error.response.status}: ${error.response.statusText}` ||
        errorMessage
    } else if (error.request) {
      // Request was made but no response received
      errorMessage =
        'No se pudo conectar con el servidor. Verifica tu conexión.'
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage
    }

    // Show error in snackbar
    showGlobalError(errorMessage)

    // Return the error so it can still be handled by the calling code if needed
    return Promise.reject(error)
  }
)

export default api
