import React from 'react'
import { Box } from '@mui/material'
import ResourceListWrapper from '@/components/ResourceListWrapper'

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f8f9fa',
      }}
    >
      <ResourceListWrapper />
    </Box>
  )
}

export default Home
