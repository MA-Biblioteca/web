import React, { useState, useEffect } from 'react'
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Typography,
  Box,
  Paper,
} from '@mui/material'
import { getCareers, getSubjects, getResourceTypes } from '@/services'
import { ContributionFilters } from '@/services/contribution'
import { FilterAlt, FilterAltOff } from '@mui/icons-material'

type Career = { id: number; name: string }
type Subject = { id: number; name: string }
type ResourceType = { id: number; name: string }

interface ResourceFiltersProps {
  onFilterChange: (filters: ContributionFilters) => void
}

const years = [
  { name: '1° Año', value: 1 },
  { name: '2° Año', value: 2 },
  { name: '3° Año', value: 3 },
  { name: '4° Año', value: 4 },
  { name: '5° Año', value: 5 },
  { name: 'Electiva', value: 0 },
]

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<ContributionFilters>({})
  const [careers, setCareers] = useState<Career[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([])

  useEffect(() => {
    getCareers().then(setCareers)
    getResourceTypes().then(setResourceTypes)
  }, [])

  useEffect(() => {
    if (filters.careerId && filters.year) {
      getSubjects(filters.careerId, filters.year)
        .then(setSubjects)
        .catch(() => setSubjects([]))
    } else {
      setSubjects([])
    }
  }, [filters.careerId, filters.year])

  const handleChange = (event: SelectChangeEvent<number>) => {
    const { name, value } = event.target
    const newFilters = { ...filters, [name]: value }

    if (name === 'careerId' || name === 'year') {
      newFilters.subjectId = undefined
    }

    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFilterChange(filters)
  }

  const handleClearFilters = () => {
    setFilters({})
    onFilterChange({})
    setSubjects([])
  }

  const hasFilters = Object.values(filters).some((v) => v)

  return (
    <Paper
      elevation={2}
      sx={{ p: 3, mb: 4, borderRadius: 2, bgcolor: 'background.paper' }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Filtrar Recursos
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="career-filter-label">Carrera</InputLabel>
            <Select
              labelId="career-filter-label"
              label="Carrera"
              name="careerId"
              value={filters.careerId || ''}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Todas las carreras</em>
              </MenuItem>
              {careers.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="year-filter-label">Año</InputLabel>
            <Select
              labelId="year-filter-label"
              label="Año"
              name="year"
              value={filters.year || ''}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Todos los años</em>
              </MenuItem>
              {years.map((y) => (
                <MenuItem key={y.value} value={y.value}>
                  {y.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small" disabled={subjects.length === 0}>
            <InputLabel id="subject-filter-label">Materia</InputLabel>
            <Select
              labelId="subject-filter-label"
              label="Materia"
              name="subjectId"
              value={filters.subjectId || ''}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Todas las materias</em>
              </MenuItem>
              {subjects.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="type-filter-label">Tipo de Recurso</InputLabel>
            <Select
              labelId="type-filter-label"
              label="Tipo de Recurso"
              name="resourceTypeId"
              value={filters.resourceTypeId || ''}
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>Todos los tipos</em>
              </MenuItem>
              {resourceTypes.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleClearFilters}
          disabled={!hasFilters}
          startIcon={<FilterAltOff />}
        >
          Limpiar
        </Button>
        <Button
          variant="contained"
          onClick={handleApplyFilters}
          startIcon={<FilterAlt />}
        >
          Aplicar Filtros
        </Button>
      </Box>
    </Paper>
  )
}

export default ResourceFilters