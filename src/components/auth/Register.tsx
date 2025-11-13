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
  Snackbar,
  Alert,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { createUser } from '@/services/user'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Correo inválido')
        .required('El correo es obligatorio'),
      password: Yup.string()
        .min(6, 'Debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
        .required('Confirma tu contraseña'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        await createUser(values)
        setSuccess(true)
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } catch (error) {
        console.error('Error de registro:', error)
      }
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
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <PersonAddIcon sx={{ fontSize: 60, color: '#1976d2', mb: 1 }} />
          <Typography variant="h4" fontWeight={600}>
            Crear Cuenta
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Registrate en MA Biblioteca
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
          <TextField
            label="Confirmar contraseña"
            type={showConfirmPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            {...formik.getFieldProps('confirmPassword')}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
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
            {formik.isSubmitting ? 'Registrando...' : 'Registrarse'}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, textAlign: 'center' }}
          >
            ¿Ya tenés cuenta?{' '}
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </Button>
          </Typography>
        </form>
      </Paper>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          ¡Registro exitoso! Redirigiendo al inicio de sesión...
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Register
