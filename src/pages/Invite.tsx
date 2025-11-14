import React, { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography, Paper } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { verifyUser } from '@/services/user'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

const Invite: React.FC = () => {
  const { verifyToken } = useParams<{ verifyToken: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const verify = async () => {
      if (!verifyToken) {
        setStatus('error')
        setMessage('Token de verificación no válido')
        return
      }

      try {
        await verifyUser(verifyToken)
        setStatus('success')
        setMessage('¡Cuenta verificada exitosamente!')
        setTimeout(() => {
          navigate('/login', { replace: true })
        }, 2000)
      } catch (error) {
        setStatus('error')
        const axiosError = error as AxiosError<{
          message?: string
          error?: string
        }>
        const errorMessage =
          axiosError?.response?.data?.message ||
          axiosError?.response?.data?.error ||
          'Error al verificar la cuenta. El token puede ser inválido o haber expirado.'
        setMessage(errorMessage)
      }
    }

    verify()
  }, [verifyToken, navigate])

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 3,
          minWidth: 350,
          maxWidth: 420,
          backgroundColor: 'white',
          textAlign: 'center',
        }}
      >
        {status === 'loading' && (
          <>
            <CircularProgress size={60} sx={{ mb: 3, color: '#1976d2' }} />
            <Typography variant="h6" fontWeight={600}>
              Verificando cuenta...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Por favor espera mientras verificamos tu cuenta
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} color="success.main">
              Verificación exitosa
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {message}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Redirigiendo al inicio de sesión...
            </Typography>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
            <Typography variant="h6" fontWeight={600} color="error.main">
              Error en la verificación
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              {message}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  )
}

export default Invite
