import api from './api'

export const getRatingsByContribution = async (contributionId: number) => {
  try {
    const response = await api.get(`/ratings/${contributionId}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching rating stats:', error)
    throw error
  }
}

export const createRating = async (contributionId: number, value: number) => {
  try {
    const response = await api.post(`/ratings`, {
      contributionId,
      value,
    })
    return response.data
  } catch (error) {
    console.error('Error rating contribution:', error)
    throw error
  }
}
