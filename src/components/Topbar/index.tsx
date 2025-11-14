import React, { useState } from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Explore,
  CloudUpload,
  // VerifiedUser,
  AccountCircle,
  Home,
  Logout,
} from '@mui/icons-material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const Topbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const navigate = useNavigate()
  const { setToken } = useAuth()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    setToken(null)
    setTimeout(() => {
      navigate('/login', { replace: true })
    }, 500)
  }

  const menuItems = [
    { label: 'Explorar', path: '/', icon: <Explore /> },
    { label: 'Subir', path: '/upload', icon: <CloudUpload /> },
    // { label: 'Moderar', path: '/moderation', icon: <VerifiedUser /> },
    { label: 'Perfil', path: '/profile', icon: <AccountCircle /> },
  ]

  const isActivePath = (path: string) => location.pathname === path

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        width: 280,
        height: '100%',
        bgcolor: 'primary.main',
        color: 'white',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Biblioteca de recursos
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ mt: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isActivePath(item.path)}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
                '&.Mui-selected': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem
          disablePadding
          sx={{ mt: 1, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}
        >
          <ListItemButton
            onClick={handleLogout}
            sx={{
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Cerrar sesión" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
            {/* Logo */}
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
                mr: isMobile ? 0 : 6,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': {
                  opacity: 0.9,
                },
              }}
            >
              <Home sx={{ display: { xs: 'none', sm: 'block' } }} />
              Biblioteca de recursos
            </Typography>

            {/* Mobile Menu Icon */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Desktop Menu */}
            {!isMobile && (
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  gap: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
              >
                {menuItems.map((item) => (
                  <Box
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textDecoration: 'none',
                      color: 'white',
                      backgroundColor: isActivePath(item.path)
                        ? 'rgba(255, 255, 255, 0.2)'
                        : 'transparent',
                      transition: 'all 0.3s',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {item.icon}
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {item.label}
                    </Typography>
                  </Box>
                ))}
                <Box
                  component="button"
                  onClick={handleLogout}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'white',
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Logout />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Cerrar sesión
                  </Typography>
                </Box>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Topbar
