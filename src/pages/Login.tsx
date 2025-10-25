import React from 'react'
import { pageBoxContainerStyle } from '@/styles/global'
import { Box } from '@mui/material'
import Login from '@/components/auth/Login'

const LoginPage: React.FC = () => {
  return (
    <Box sx={pageBoxContainerStyle}>
      <Login />
    </Box>
  )
}

export default LoginPage
