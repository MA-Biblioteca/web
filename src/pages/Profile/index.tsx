import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Container,
  Button,
} from '@mui/material'
import {
  Email,
  CalendarToday,
  CloudUpload,
} from '@mui/icons-material'
import { getUserProfile, UserProfile } from '@/services/user'
import { Contribution } from '@/types'
import ResourceCard from '@/components/ResourceList/ResourceCard'
import { getContributions } from '@/services/contribution'
import { useAuth } from '@/contexts/AuthContext'
import {
  profileHeaderPaperSx,
  profileAvatarSx,
  profileNameSx,
  profileInfoContainerSx,
  profileInfoItemSx,
  profileInfoIconSx,
  profileInfoTextSx,
  contributionsTitleSx,
  emptyStatePaperSx,
} from './styles'

interface DecodedToken {
  id: number
  email: string
  firstName?: string | null
  lastName?: string | null
  verified?: string
  role: string
  sub: string
}

const Profile: React.FC = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProfileData()
  }, [token])

  const decodeToken = (token: string): DecodedToken | null => {
    try {
      const payload = token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!token) {
        setError('Se te venció la sesión, por favor iniciá sesión de nuevo')
        setLoading(false)
        return
      }

      const decodedToken = decodeToken(token)

      if (!decodedToken) {
        setError('Hubo un error cargando el perfil del usuario')
        setLoading(false)
        return
      }

      const userId = decodedToken.id

      const userProfile = await getUserProfile(userId)

      if (!userProfile) {
        setError('Hubo un error cargando el perfil del usuario')
        setLoading(false)
        return
      }

      setProfile(userProfile)

      try {
        const userContributions = await getContributions(userId)
        setContributions(userContributions || [])
      } catch (contributionError) {
        console.warn('Error loading contributions:', contributionError)
        setContributions([])
      }
    } catch (err) {
      console.error('Error loading profile:', err)
      setError('Error al cargar el perfil')
      setProfile(null)
      setContributions([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'No se pudo cargar el perfil'}</Alert>
      </Container>
    )
  }

  const hasName = profile.firstName || profile.lastName

  const displayName = hasName
    ? [profile.firstName, profile.lastName].filter(Boolean).join(' ')
    : profile.email.split('@')[0]

  const initials = hasName
    ? displayName.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
    : displayName.substring(0, 2).toUpperCase()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Paper elevation={0} sx={profileHeaderPaperSx}>
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', py: 6 }}>
            <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
              <Avatar sx={profileAvatarSx}>
                {initials}
              </Avatar>

              <Box sx={{ flex: 1, pt: 1 }}>
                <Typography variant="h3" sx={profileNameSx}>
                  {displayName}
                </Typography>

                <Box sx={profileInfoContainerSx}>
                  <Box sx={profileInfoItemSx}>
                    <Email sx={profileInfoIconSx} />
                    <Typography variant="body2" sx={profileInfoTextSx}>
                      {profile.email}
                    </Typography>
                  </Box>

                  <Box sx={profileInfoItemSx}>
                    <CalendarToday sx={profileInfoIconSx} />
                    <Typography variant="body2" sx={profileInfoTextSx}>
                      Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" sx={contributionsTitleSx}>
          {`Mis Aportes (${contributions.length})`}
        </Typography>

        {contributions.length === 0 ? (
          <Paper sx={emptyStatePaperSx}>
            <CloudUpload sx={{ fontSize: 64, color: 'text.secondary', mb: 1.5, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Todavía no subiste ningún aporte
            </Typography>
            <Button variant="contained" onClick={() => navigate('/upload')} sx={{ mt: '1rem' }}>
              Quiero contribuir
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {contributions.map((contribution) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={contribution.id}>
                <ResourceCard contribution={contribution} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}

export default Profile
