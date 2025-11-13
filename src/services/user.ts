import api from './api'
import { CreateUser } from '@/types'
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
    console.error(error)
    throw error
  }
}

export const getUser = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error(error)
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
    console.error(error)
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

export const createUser = async (user: CreateUser) => {
  try {
    const response = await api.post('/users', user)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
