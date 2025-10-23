import api from './api'
import { Contribution } from '@/types'

export interface CreateContributionData {
  careerId: number
  subjectId: number
  year: number
  resourceType: string
  title: string
  description: string
  files: File[]
}

export const createContribution = async (data: CreateContributionData) => {
  try {
    const formData = new FormData()

    // Append form fields
    formData.append('careerId', data.careerId.toString())
    formData.append('subjectId', data.subjectId.toString())
    formData.append('year', data.year.toString())
    formData.append('resourceType', data.resourceType)
    formData.append('title', data.title)
    formData.append('description', data.description)

    // Append files
    data.files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await api.post('/contributions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error creating contribution:', error)
    throw error
  }
}

export const getContributions = async (): Promise<Contribution[]> => {
  try {
    const response = await api.get('/contributions')
    const data = response.data?.data

    // ✅ Devuelve siempre un array, incluso si la API no responde bien
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching contributions:', error)
    return [] // evita romper el frontend
  }
}

export const downloadFile = async (fileId: number, fileName: string) => {
  try {
    const response = await api.get(`/contributions/files/${fileId}`, {
      responseType: 'blob',
    })

    // Create a blob URL and trigger download
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading file:', error)
    throw error
  }
}

export const downloadAllFiles = async (
  files: Array<{ id: number; originalName: string }>
) => {
  try {
    // Download all files sequentially
    for (const file of files) {
      await downloadFile(file.id, file.originalName)
      // Add a small delay between downloads to avoid overwhelming the browser
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  } catch (error) {
    console.error('Error downloading files:', error)
    throw error
  }
}

export const getContributionById = async (id: number): Promise<Contribution> => {
  try {
    const response = await api.get(`/contributions/${id}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching contribution:', error)
    throw error
  }
}

export const addComment = async () => {
  try {
    // TODO: Implement add comment
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

export const rateContribution = async () => {
  try {
    // TODO: Implement rate contribution
  } catch (error) {
    console.error('Error rating contribution:', error)
    throw error
  }
}
