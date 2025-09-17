import { createContext, useContext, useState, ReactNode } from 'react'

interface Resource {
  carreraId: string
  year: string // o "electiva"
  materiaId: string
  tipoRecurso: string
  titulo: string
  descripcion: string
  archivos: File[]
}

interface ResourceContextType {
  resource: Resource
  setResource: (data: Partial<Resource>) => void
  resetResource: () => void
  isValid: () => boolean
}

const initialResource: Resource = {
  carreraId: '',
  year: '',
  materiaId: '',
  tipoRecurso: '',
  titulo: '',
  descripcion: '',
  archivos: []
}

const ResourceContext = createContext<ResourceContextType | undefined>(undefined)

export const ResourceProvider = ({ children }: { children: ReactNode }) => {
  const [resource, setResourceState] = useState<Resource>(initialResource)

  const setResource = (data: Partial<Resource>) => {
    console.log('Seteando recurso con:', data)
    setResourceState(prev => ({ ...prev, ...data }))
  }

  const resetResource = () => {
    console.log('Reiniciando valores del recurso')
    setResourceState(initialResource)
  }

  const isValid = () => {
    return !!(
      resource.carreraId &&
      resource.year &&
      resource.materiaId &&
      resource.tipoRecurso &&
      resource.titulo &&
      resource.descripcion &&
      resource.archivos.length > 0
    )
  }

  return (
    <ResourceContext.Provider value={{
      resource,
      setResource,
      resetResource,
      isValid
    }}>
      {children}
    </ResourceContext.Provider>
  )
}

export const useResource = () => {
  const context = useContext(ResourceContext)
  if (!context) {
    throw new Error('useResource es un hook que debe estar dentro de un Provider en main.tsx')
  }
  return context
}