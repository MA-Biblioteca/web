import UploadResourceFirstStep from '@/components/UploadResourceSteps/FirstStep'
import UploadResourceSecondStep from '@/components/UploadResourceSteps/SecondStep'
import { pageBoxContainerStyle } from '@/styles/global'
import { Box } from '@mui/material'

const Upload = () => {
  return (
    <Box sx={pageBoxContainerStyle}>

      <UploadResourceFirstStep />

      <UploadResourceSecondStep />

    </Box >
  )
}

export default Upload