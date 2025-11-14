import React, { useEffect, useState, useCallback } from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  Container,
  Grid,
  Paper,
} from '@mui/material'
import { getContributions, ContributionFilters } from '@/services/contribution'
import { getRatingsByContribution } from '@/services/ratings'
import { Contribution } from '@/types'
import SortDropdown from '../ShortDropdown/index'
import ResourceCard from '../ResourceList/ResourceCard'
import ResourceFilters from '../ResourceFilters' // <-- 1. IMPORTA EL NUEVO COMPONENTE

const ResourceListWrapper: React.FC = () => {
  const [allContributions, setAllContributions] = useState<Contribution[]>([])
  // Estado para la lista que se muestra (ya filtrada y ordenada)
  const [displayedContributions, setDisplayedContributions] = useState<
    Contribution[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // --- 2. AÑADE ESTADO PARA LOS FILTROS ---
  const [filters, setFilters] = useState<ContributionFilters>({})

  // 3. CREA UNA FUNCIÓN PARA CARGAR LOS DATOS
  const fetchContributions = useCallback(async (activeFilters: ContributionFilters) => {
    try {
      setLoading(true)
      // Pasa los filtros al servicio
      const data = await getContributions(activeFilters)

      // El fetch de ratings se mantiene
      const contributionsWithRatings = await Promise.all(
        data.map(async (contribution) => {
          try {
            const { avgRating, ratingsCount } = await getRatingsByContribution(
              contribution.id
            )
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
            return { ...contribution, averageRating: 0, totalRatings: 0 }
          }
        })
      )

      // Guarda la lista original sin ordenar
      setAllContributions(contributionsWithRatings)
      // Guarda la lista que se va a mostrar (y que el SortDropdown modificará)
      setDisplayedContributions(contributionsWithRatings)
      setError(null)
    } catch (err) {
      console.error('Error loading contributions:', err)
      setError('Error al cargar los recursos. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }, []) // El useCallback asegura que la función no cambie

  // 4. LLAMA AL FETCH INICIAL Y CUANDO CAMBIEN LOS FILTROS
  useEffect(() => {
    fetchContributions(filters)
  }, [filters, fetchContributions]) // Se re-ejecuta cuando cambian los filtros

  // 5. MANEJADOR PARA CUANDO LOS FILTROS SE ACTUALICEN
  const handleFilterChange = (newFilters: ContributionFilters) => {
    setFilters(newFilters)
  }

  // El componente de SortDropdown ya funciona bien,
  // porque modifica el estado 'displayedContributions'
  // que ahora es un estado separado.

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 6. RENDERIZA EL COMPONENTE DE FILTROS */}
      <ResourceFilters onFilterChange={handleFilterChange} />

      {/* --- EL RESTO DEL COMPONENTE --- */}
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="#1a1a1a">
              Recursos Académicos
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explora los materiales de estudio de la comunidad
            </Typography>
          </Box>

          <SortDropdown
            contributions={allContributions} // Pasa la lista original
            setContributions={setDisplayedContributions} // Deja que actualice la lista a mostrar
          />
        </Box>

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
            }}
          >
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Box>
        ) : displayedContributions.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '300px',
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No se encontraron recursos con esos filtros.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {displayedContributions.map((contribution) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={contribution.id}>
                <ResourceCard contribution={contribution} />
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  )
}

export default ResourceListWrapper