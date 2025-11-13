import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Login from '@/components/auth/Login'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/', { replace: true })
    }
  }, [navigate])

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
