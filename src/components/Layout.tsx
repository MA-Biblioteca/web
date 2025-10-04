import React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'

const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Topbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}

export default Layout
