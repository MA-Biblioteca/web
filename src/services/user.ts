import api from './api'

export interface UserProfile {
  id: number
  firstName?: string
  lastName?: string
  email: string
  identificationNumber?: number
  phone?: string
  careerId?: number
  careerName?: string
  createdAt: string
  contributionsCount?: number
}

export interface UpdateUserProfileData {
  firstName?: string
  lastName?: string
  phone?: string
  careerId?: number
}

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  try {
    const response = await api.get(`/users/${userId}`)
    return response.data.data
  } catch (error) {
    throw error
  }
}

export const updateUserProfile = async (
  userId: number,
  data: UpdateUserProfileData
): Promise<UserProfile> => {
  try {
    const response = await api.patch(`/users/${userId}`, data)
    return response.data.data
  } catch (error) {
    throw error
  }
}

export const getUserContributions = async (userId: number) => {
  try {
    const response = await api.get('/contributions')
    const allContributions = response.data?.data || []
    return allContributions.filter((c: any) => c.userId === userId)
  } catch (error) {
    return []
  }
}
