import { AppBar, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

function Topbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1
          }}
        >
          Mi App React
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar