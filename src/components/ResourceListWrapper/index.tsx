import React, { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Grid,
} from '@mui/material'
import { getContributions } from '@/services/contribution'
import { getRatingsByContribution } from '@/services/ratings'
import { Contribution } from '@/types'
import SortDropdown from '../ShortDropdown/index'
import ResourceCard from '../ResourceList/ResourceCard'

const ResourceListWrapper: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true)
        const data = await getContributions()

        // Fetch ratings for all contributions
        const contributionsWithRatings = await Promise.all(
          data.map(async (contribution) => {
            try {
              const { avgRating, ratingsCount } =
                await getRatingsByContribution(contribution.id)
              return {
                ...contribution,
                averageRating: avgRating ?? 0,
                totalRatings: ratingsCount ?? 0,
              }
            } catch (error) {
              console.error(
                `Error fetching ratings for contribution ${contribution.id}:`,
                error
              )
              return {
                ...contribution,
                averageRating: 0,
                totalRatings: 0,
              }
            }
          })
        )

        setContributions(contributionsWithRatings)
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="#1a1a1a">
            Recursos Académicos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explora y descarga materiales de estudio compartidos por la
            comunidad
          </Typography>
        </Box>

        {/* 🔽 Agregamos el desplegable con botón */}
        <SortDropdown
          contributions={contributions}
          setContributions={setContributions}
        />
      </Box>

      <Grid container spacing={3}>
        {contributions.map((contribution) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={contribution.id}>
            <ResourceCard contribution={contribution} />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default ResourceListWrapper
