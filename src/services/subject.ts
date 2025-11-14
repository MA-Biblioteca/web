import api from './api'

export const getSubjects = async (carrera: number, year: number) => {
  try {
    const { data } = await api.get(
      `/subjects?careerId=${encodeURIComponent(carrera)}&year=${encodeURIComponent(year)}`
    )
    return data
  } catch (error) {
    console.error('Error al obtener materias:', error)
    return []
  }
}

export const getResourceTypes = async () => {
  try {
    const { data } = await api.get('/resourcetypes')
    return data.data.map(({ id, name }: { id: number; name: string }) => ({
      id,
      name,
    }))
  } catch (error) {
    console.error('Error al obtener tipos de recursos:', error)
    return []
  }
}
