import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { boxContainerStyle, boxLinksContainerStyle, clearLinkClass, clearPathLinkClass } from './styles'

const Topbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={boxContainerStyle}>

          <Typography variant="h4" component={Link} to="/" sx={clearLinkClass}>
            Biblioteca de recursos
          </Typography>

          <Box sx={boxLinksContainerStyle}>
            <Typography variant="h6" component={Link} to="/explore" sx={clearPathLinkClass}>
              Explorar
            </Typography>

            <Typography variant="h6" component={Link} to="/upload" sx={clearPathLinkClass}>
              Subir
            </Typography>

            <Typography variant="h6" component={Link} to="/moderation" sx={clearPathLinkClass}>
              Moderar
            </Typography>

            <Typography variant="h6" component={Link} to="/profile" sx={clearPathLinkClass}>
              Perfil
            </Typography>
          </Box>

        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar