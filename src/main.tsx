import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './styles/global.css'


//Páginas
import Home from './pages/Home'
import Explore from './pages/Explore'
// import Upload from './pages/Upload'
import Login from './pages/Login'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ContributionForm from './pages/contribution/ContributionFrom'
import ContributionDetail from './pages/ContributionDetail'

//Contexts
import { ResourceProvider } from './contexts/ResourceContext'
import { ContributionProvider } from './pages/contribution/ContributionContext'

//Layout general de la app
import Layout from './components/Layout'

//Iconos (renombrados para evitar conflictos)
import { Login as LoginIcon } from '@mui/icons-material'

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ResourceProvider>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Página inicial: Login */}
          <Route index element={<Login />} />
          <Route path="/" element={<Layout />}> 
            {/* Otras páginas */}
            <Route path="home" element={<Home />} />
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
            <Route path="Login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </ResourceProvider>
)
