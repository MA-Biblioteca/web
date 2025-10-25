import React, { useState } from 'react'
// Componentes de Material-UI
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
// Estilos globales compartidos
import { pageBoxContainerStyle } from '@/styles/global'
// Hook para navegación programática
import { useNavigate } from 'react-router-dom'
// Icono opcional para login
import LoginIcon from '@mui/icons-material/Login'

// Componente funcional de login
const Login: React.FC = () => {
  // ---------------------------
  // Estados para inputs y errores
  // ---------------------------
  const [username, setUsername] = useState('')  // estado para el usuario
  const [password, setPassword] = useState('')  // estado para la contraseña

  const [usernameError, setUsernameError] = useState('') // mensaje de error para usuario
  const [passwordError, setPasswordError] = useState('') // mensaje de error para contraseña

  // ---------------------------
  // Hook de navegación
  // ---------------------------
  const navigate = useNavigate() // nos permite redirigir a otra ruta

  // ---------------------------
  // Función que se ejecuta al enviar el formulario
  // ---------------------------
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // evita que la página se recargue

    let valid = true // bandera para saber si el formulario es válido

    // Validación usuario
    if (!username.trim()) {
      setUsernameError('El usuario es obligatorio')
      valid = false
    } else {
      setUsernameError('') // limpiar error si está correcto
    }

    // Validación contraseña
    if (!password.trim()) {
      setPasswordError('La contraseña es obligatoria')
      valid = false
    } else {
      setPasswordError('') // limpiar error si está correcto
    }

    if (!valid) return // si hay errores, no se envía

    // Si es válido, podemos hacer la llamada a la API
    console.log('Usuario:', username)
    console.log('Contraseña:', password)

    // Aquí iría la lógica para enviar los datos al backend

    // ---------------------------
    // Redirigir a Home después del login
    // ---------------------------
    navigate('/home')
  }

  return (
    // Contenedor principal centrado con fondo
    <Box
      sx={{
        minHeight: '100vh', // altura total de la pantalla
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
        background: 'linear-gradient(135deg, #f0f4ff, #d9e4ff)', // degradado
      }}
    >
      {/* Icono grande de login */}
      <LoginIcon sx={{ fontSize: 50, color: '#1976d2', mb: 2 }} />

      {/* Título y subtítulo */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          MA Biblioteca
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Ingresa para continuar
        </Typography>
      </Box>

      {/* Tarjeta de login */}
      <Paper
        elevation={3} // sombra
        sx={{ padding: 4, minWidth: 300, borderRadius: 3 }}
      >
        {/* Título */}
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
          Iniciar Sesión
        </Typography>

        {/* Formulario */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          {/* Input de usuario */}
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!usernameError}  // si hay error, marca input en rojo
            helperText={usernameError}  // muestra mensaje de error debajo
          />

          {/* Input de contraseña */}
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}  // si hay error, marca input en rojo
            helperText={passwordError}  // mensaje de error
          />

          {/* Botón enviar */}
          <Button variant="contained" color="primary" type="submit">
            Ingresar
          </Button>

          {/* Links opcionales */}
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            <a href="/register">Registrarse</a> | <a href="/forgot-password">Olvidé mi contraseña</a>
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}

// Exportamos el componente
export default Login
