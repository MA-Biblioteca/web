import { notFoundPageBoxStyle } from '@/styles/global'
import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <Box sx={notFoundPageBoxStyle}>

      <Typography variant="h1" component="h1" color="error">
        404
      </Typography>

      <Typography variant="h4" component="h2" gutterBottom>
        Página no encontrada
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        size="large"
      >
        Volver al inicio
      </Button>

    </Box>
  )
}

export default NotFound