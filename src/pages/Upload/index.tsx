import React from 'react'
import UploadResourceFirstStep from '@/components/UploadResourceSteps/FirstStep'
import UploadResourceSecondStep from '@/components/UploadResourceSteps/SecondStep'
import { useResource } from '@/contexts/ResourceContext'
import { pageBoxContainerStyle } from '@/styles/global'
import { Box } from '@mui/material'
import { useEffect } from 'react'

const Upload: React.FC = () => {
  const { resource } = useResource()

  useEffect(() => {
    console.log('Recurso actual cambiando en vivo:', resource)
  }, [resource])

  return (
    <Box sx={pageBoxContainerStyle}>
      <UploadResourceFirstStep />

      <UploadResourceSecondStep />
    </Box>
  )
}

export default Upload
