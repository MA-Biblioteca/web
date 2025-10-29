import React from 'react'
import { Box } from '@mui/material'
import Login from '@/components/auth/Login'

const LoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        height: '100vh', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa', 
      }}
    >
      <Login />
    </Box>
  )
}

export default LoginPage

