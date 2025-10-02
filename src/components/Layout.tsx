import React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'

const Layout: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Topbar />
      <main>
        <Outlet />
      </main>
    </Box>
  )
}

export default Layout
