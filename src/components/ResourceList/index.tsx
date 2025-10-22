import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, CircularProgress, Container, Button } from '@mui/material'
import { getContributions } from '@/services/contribution'
import { Contribution } from '@/types'
import ResourceCard from './ResourceCard'

const ITEMS_PER_PAGE = 8 // cantidad de recursos por página

const ResourceList: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

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

  const totalPages = Math.ceil(contributions.length / ITEMS_PER_PAGE)
  const paginated = contributions.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    )
  }

  if (contributions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
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
          sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}
        >
          Recursos Académicos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explora y descarga materiales de estudio compartidos por la comunidad
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {paginated.map((contribution) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={contribution.id}>
            <ResourceCard contribution={contribution} />
          </Grid>
        ))}
      </Grid>

      {/* Controles de paginación */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mt={4}
      >
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          ◀ Anterior
        </Button>

        <Typography variant="body1">
          Página {page} de {totalPages}
        </Typography>

        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Siguiente ▶
        </Button>
      </Box>
    </Container>
  )
}

export default ResourceList
