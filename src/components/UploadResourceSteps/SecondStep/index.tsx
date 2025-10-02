import React from 'react'
import { Box } from '@mui/material'
import { SecondStepContainerStyle } from './styles'
import { useResource } from '@/contexts/ResourceContext'

const UploadResourceSecondStep: React.FC = () => {
  const { setResource, resetResource } = useResource()
  console.log(
    'Usar "setResource({...})" para actualizar el recurso desde este componente',
    setResource
  )
  console.log(
    'Usar "resetResource()" para limpiar el recurso desde este componente',
    resetResource
  )

  return <Box sx={SecondStepContainerStyle}>UploadResourceSecondStep</Box>
}

export default UploadResourceSecondStep
