import api from './api'

export const getSubjects = async (carrera: string, anio: string) => {
  try {
    const { data } = await api.get(`/subjects?carrera=${encodeURIComponent(carrera)}&anio=${encodeURIComponent(anio)}`)
    return data
  } catch (error) {
    console.error('Error al obtener materias:', error)
    return []
  }
}