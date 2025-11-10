import React, { useState } from 'react'
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    let valid = true

    if (!username.trim()) {
      setUsernameError('El usuario es obligatorio')
      valid = false
    } else {
      setUsernameError('')
    }

    if (!password.trim()) {
      setPasswordError('La contraseña es obligatoria')
      valid = false
    } else {
      setPasswordError('')
    }

    if (!valid) return

    console.log('Usuario:', username)
    console.log('Contraseña:', password)

    navigate('/home')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
        background: 'linear-gradient(135deg, #f0f4ff, #d9e4ff)',
      }}
    >
      <LoginIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          MA Biblioteca
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Ingresa para continuar
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ padding: 4, minWidth: 300, borderRadius: 3 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Iniciar Sesión
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameError}
            helperText={usernameError}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />

          <Button variant="contained" color="primary" type="submit">
            Ingresar
          </Button>

          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            <a href="/register">Registrarse</a> |{' '}
            <a href="/forgot-password">Olvidé mi contraseña</a>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default Login
