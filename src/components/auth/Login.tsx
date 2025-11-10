import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Correo inválido')
        .required('El correo es obligatorio'),
      password: Yup.string().required('La contraseña es obligatoria'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      console.log('Datos de login:', values)
      setTimeout(() => {
        setSubmitting(false)
        navigate('/home')
      }, 1200)
    },
  })

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 6,
          borderRadius: 3,
          minWidth: 350,
          maxWidth: 400,
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LoginIcon sx={{ fontSize: 60, color: '#1976d2', mb: 1 }} />
          <Typography variant="h4" fontWeight={600}>
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bienvenido a MA Biblioteca
          </Typography>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Correo electrónico"
            fullWidth
            margin="normal"
            {...formik.getFieldProps('email')}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            {...formik.getFieldProps('password')}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={formik.isSubmitting}
            sx={{ mt: 2 }}
            startIcon={
              formik.isSubmitting ? (
                <CircularProgress size={18} color="inherit" />
              ) : null
            }
          >
            {formik.isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            ¿No tenés cuenta?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </Button>
          </Typography>
        </form>
      </Paper>
    </Box>
  )
}

export default Login
