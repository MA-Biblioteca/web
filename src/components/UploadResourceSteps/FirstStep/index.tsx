import { Box } from "@mui/material"
import { FirstStepContainerStyle } from "./styles"
import { useResource } from "@/contexts/ResourceContext"

const UploadResourceFirstStep = () => {
  const { setResource, resetResource } = useResource()
  console.log('Usar "setResource({...})" para actualizar el recurso desde este componente', setResource)
  console.log('Usar "resetResource()" para limpiar el recurso desde este componente', resetResource)

  return (
    <Box sx={FirstStepContainerStyle}>
      UploadResourceFirstStep
    </Box>
  )
}

export default UploadResourceFirstStep