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

export const getContributionById = async (
  id: number
): Promise<Contribution> => {
  try {
    const response = await api.get(`/contributions/${id}`)
    return response.data.data
  } catch (error) {
    console.error('Error fetching contribution:', error)
    throw error
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

export interface UpdateContributionData {
  careerId?: number
  subjectId?: number
  year?: number
  resourceType?: string
  title?: string
  description?: string
  files?: File[] // nuevos archivos a agregar
}

export const updateContribution = async (
  id: number,
  data: UpdateContributionData
) => {
  try {
    const formData = new FormData()

    if (data.careerId !== undefined) formData.append('careerId', data.careerId.toString())
    if (data.subjectId !== undefined) formData.append('subjectId', data.subjectId.toString())
    if (data.year !== undefined) formData.append('year', data.year.toString())
    if (data.resourceType !== undefined) formData.append('resourceType', data.resourceType)
    if (data.title !== undefined) formData.append('title', data.title)
    if (data.description !== undefined) formData.append('description', data.description)

    if (data.files?.length) {
      data.files.forEach((file) => formData.append('files', file))
    }

    const response = await api.patch(`/contributions/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.error('Error updating contribution:', error)
    throw error
  }
}
