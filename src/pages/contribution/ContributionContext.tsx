import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react'

type ContributionData = {
  careerId: string
  year: string
  subjectId: string
  resourceType: string
  title: string
  description: string
}

type ContributionContextType = {
  data: ContributionData
  setData: (field: keyof ContributionData, value: string) => void
}

const ContributionContext = createContext<ContributionContextType | undefined>(
  undefined
)

export const ContributionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setDataState] = useState<ContributionData>({
    careerId: '',
    year: '',
    subjectId: '',
    resourceType: '',
    title: '',
    description: '',
  })

  const setData = useCallback(
    (field: keyof ContributionData, value: string) => {
      setDataState((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const contextValue = useMemo(() => ({ data, setData }), [data, setData])

  return (
    <ContributionContext.Provider value={contextValue}>
      {children}
    </ContributionContext.Provider>
  )
}

export const useContribution = () => {
  const ctx = useContext(ContributionContext)
  if (!ctx)
    throw new Error(
      'useContribution debe usarse dentro de ContributionProvider'
    )
  return ctx
}
