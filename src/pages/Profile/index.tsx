import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  CircularProgress,
  Alert,
  Container,
} from '@mui/material'
import {
  Person,
  Email,
  CalendarToday,
  School,
} from '@mui/icons-material'
import { mockUserProfile } from '@/__mocks__/profileMock'
import { UserProfile } from '@/services/user'
import { Contribution } from '@/types'
import ResourceCard from '@/components/ResourceList/ResourceCard'
import { getCareers } from '@/services/career'
import { getContributions } from '@/services/contribution'
import {
  profileHeaderPaperSx,
  profileAvatarSx,
  profileNameSx,
  profileCareerBoxSx,
  profileCareerTextSx,
  profileInfoContainerSx,
  profileInfoItemSx,
  profileInfoIconSx,
  profileInfoTextSx,
  contributionsTitleSx,
  emptyStatePaperSx,
} from './styles'

interface Career {
  id: number
  name: string
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [careers, setCareers] = useState<Career[]>([])

  useEffect(() => {
    loadProfileData()
    loadCareers()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      setProfile(mockUserProfile)

      const userId = mockUserProfile.id
      if (userId && typeof userId === 'number') {
        const userContributions = await getContributions(userId)
        setContributions(userContributions)
      } else {
        const allContributions = await getContributions()
        setContributions(allContributions)
      }
    } catch (err) {
      setError('Error al cargar el perfil')
      setContributions([])
    } finally {
      setLoading(false)
    }
  }

  const loadCareers = async () => {
    try {
      const response = await getCareers()
      setCareers(response || [])
    } catch (err) {
      setCareers([
        { id: 1, name: 'Ingeniería en Sistemas de información' },
        { id: 2, name: 'Ingeniería Industrial' },
        { id: 3, name: 'Ingeniería Civil' },
      ])
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

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Usuario'
  const initials = fullName.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
  const careerName = profile.careerId && careers.length > 0
    ? careers.find((c) => c.id === profile.careerId)?.name
    : null

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
                  {fullName}
                </Typography>

                {careerName && (
                  <Box sx={profileCareerBoxSx}>
                    <School sx={{ fontSize: 20 }} />
                    <Typography variant="h6" sx={profileCareerTextSx}>
                      {careerName}
                    </Typography>
                  </Box>
                )}

                <Box sx={profileInfoContainerSx}>
                  {profile.email && (
                    <Box sx={profileInfoItemSx}>
                      <Email sx={profileInfoIconSx} />
                      <Typography variant="body2" sx={profileInfoTextSx}>
                        {profile.email}
                      </Typography>
                    </Box>
                  )}

                  {profile.identificationNumber && (
                    <Box sx={profileInfoItemSx}>
                      <Person sx={profileInfoIconSx} />
                      <Typography variant="body2" sx={profileInfoTextSx}>
                        DNI: {profile.identificationNumber}
                      </Typography>
                    </Box>
                  )}

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
          Mis Aportes
        </Typography>

        {contributions.length === 0 ? (
          <Paper sx={emptyStatePaperSx}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Todavía no subiste ningún aporte
            </Typography>
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

