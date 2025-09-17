import { pageBoxContainerStyle } from '@/styles/global'
import { Box, Typography } from '@mui/material'

const Profile = () => {
  return (
    <Box sx={pageBoxContainerStyle}>
      <Typography variant="h1" component="h1">
        Perfil
      </Typography>
    </Box >
  )
}

export default Profile