import api from './api'

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/token', { email, password })
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
