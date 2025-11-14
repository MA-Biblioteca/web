/* eslint-disable react/react-in-jsx-scope */
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './styles/global.css'

//Páginas
import Home from './pages/Home'
import Explore from './pages/Explore'
// import Upload from './pages/Upload'
import Login from './pages/Login'
import RegisterPage from './pages/Register'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ContributionForm from './pages/contribution/ContributionFrom'
import ContributionDetail from './pages/ContributionDetail'
import Invite from './pages/Invite'

import { ResourceProvider } from './contexts/ResourceContext'
import { ContributionProvider } from './pages/contribution/ContributionContext'
import { SnackbarProvider } from './contexts/SnackbarContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'

import Layout from './components/Layout'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

const AppRoutes = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="contributions/:id" element={<ContributionDetail />} />
            <Route
              path="upload"
              element={
                <ContributionProvider>
                  <ContributionForm />
                </ContributionProvider>
              }
            />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/invite/:verifyToken" element={<Invite />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SnackbarProvider>
    <AuthProvider>
      <ResourceProvider>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppRoutes />
          </ThemeProvider>
        </BrowserRouter>
      </ResourceProvider>
    </AuthProvider>
  </SnackbarProvider>
)
