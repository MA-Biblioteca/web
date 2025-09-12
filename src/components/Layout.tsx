import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'

function Layout() {
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