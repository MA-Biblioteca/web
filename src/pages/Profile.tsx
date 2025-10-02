import React from 'react'
import { pageBoxContainerStyle } from '@/styles/global'
import { Box, Typography } from '@mui/material'

const Profile: React.FC = () => {
  return (
    <Box sx={pageBoxContainerStyle}>
      <Typography variant="h1" component="h1">
        Perfil
      </Typography>
    </Box>
  )
}

export default Profile
