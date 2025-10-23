import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, CircularProgress, Container } from '@mui/material'
import { getContributions } from '@/services/contribution'
import { Contribution } from '@/types'
import ResourceCard from './ResourceCard'

const ResourceList: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true)
        const data = await getContributions()
        setContributions(data)
        setError(null)
      } catch (err) {
        console.error('Error loading contributions:', err)
        setError('Error al cargar los recursos. Por favor, intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    )
  }

  if (contributions?.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No hay recursos disponibles
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#1a1a1a',
            mb: 1,
          }}
        >
          Recursos Académicos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explora y descarga materiales de estudio compartidos por la comunidad
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {contributions?.map((contribution) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={contribution.id}>
            <ResourceCard contribution={contribution} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default ResourceList
