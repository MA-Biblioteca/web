import React from 'react'
import { pageBoxContainerStyle } from '@/styles/global'
import { Box, Typography } from '@mui/material'

const Explore: React.FC = () => {
  return (
    <Box sx={pageBoxContainerStyle}>
      <Typography variant="h1" component="h1">
        Explorar
      </Typography>
    </Box>
  )
}

export default Explore
