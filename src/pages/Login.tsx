import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Login from '@/components/auth/Login'
import { useAuth } from '@/contexts/AuthContext'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

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
