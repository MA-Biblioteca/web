import api from './api'

export const addComment = async (contributionId: number, content: string) => {
  try {
    const response = await api.post('/comments', {
      contributionId,
      text: content,
      author: 'Test User',
    })

    return response.data
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}
