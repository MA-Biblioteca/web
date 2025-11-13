import { CreateUser, UpdateUser } from '@/types'
import api from './api'

export const getUser = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const updateUser = async (userId: string, user: UpdateUser) => {
  try {
    const response = await api.put(`/users/${userId}`, user)
    return response.data
  } catch (error) {
    console.error(error)
    throw error
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
