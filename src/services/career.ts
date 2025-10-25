import api from './api'

export const getCareers = async () => {
  try {
    const response = await api.get('/careers')
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
