import React from 'react'
import { Box } from '@mui/material'
import Register from '@/components/auth/Register'

const RegisterPage: React.FC = () => {
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
      <Register />
    </Box>
  )
}

export default RegisterPage
