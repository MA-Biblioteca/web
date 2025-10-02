import React from 'react'
import { pageBoxContainerStyle } from '@/styles/global'
import { Box, Typography } from '@mui/material'

const Moderation: React.FC = () => {
  return (
    <Box sx={pageBoxContainerStyle}>
      <Typography variant="h1" component="h1">
        Moderar
      </Typography>
    </Box>
  )
}

export default Moderation
