import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './styles/global.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Explore from './pages/Explore'
// import Upload from './pages/Upload'
import Moderation from './pages/Moderation'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ContributionForm from './pages/contribution/ContributionFrom'
import ContributionDetail from './pages/ContributionDetail'
import { ResourceProvider } from './contexts/ResourceContext'
import { ContributionProvider } from './pages/contribution/ContributionContext'

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
            <Route path="moderation" element={<Moderation />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  </ResourceProvider>
)
