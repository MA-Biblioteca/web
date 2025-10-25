import React, { useState } from 'react'
// Componentes de Material-UI
import { Box, TextField, Button, Typography, Paper } from '@mui/material'
// Estilos globales compartidos
import { pageBoxContainerStyle } from '@/styles/global'

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
  }

  return (
    // Contenedor principal centrado
    <Box sx={pageBoxContainerStyle}>
      
      {/* Tarjeta de login */}
      <Paper
        elevation={3} // sombra
        sx={{ padding: 4, minWidth: 300 }}
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
        </Box>
      </Paper>
    </Box>
  )
}

// Exportamos el componente
export default Login
