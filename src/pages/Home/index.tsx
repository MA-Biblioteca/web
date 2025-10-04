import React from 'react'
import { Box } from '@mui/material'
import ResourceList from '@/components/ResourceList'

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#f8f9fa',
      }}
    >
      <ResourceList />
    </Box>
  )
}

export default Home
