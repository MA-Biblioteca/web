import React, { useState, useEffect } from 'react'
import { Box, Select, MenuItem, Button, FormControl, InputLabel } from '@mui/material'
import { Contribution } from '@/types'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

interface SortDropdownProps {
  contributions: Contribution[]
  setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  contributions,
  setContributions,
}) => {
  const [sortField, setSortField] = useState<'fecha' | 'valoracion'>('fecha')
  const [isAsc, setIsAsc] = useState(false)

  // 🔁 Reordena cada vez que cambia el campo o el orden
  useEffect(() => {
    sortContributions(sortField, isAsc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, isAsc])

  const sortContributions = (field: 'fecha' | 'valoracion', asc: boolean) => {
    const sorted = [...contributions].sort((a, b) => {
      if (field === 'fecha') {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return asc ? dateA - dateB : dateB - dateA
      } else {
        const ratingA = a.averageRating ?? 0
        const ratingB = b.averageRating ?? 0
        return asc ? ratingA - ratingB : ratingB - ratingA
      }
    })
    setContributions(sorted)
  }

  const toggleOrder = () => setIsAsc((prev) => !prev)

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel id="sort-by-label">Ordenar por</InputLabel>
        <Select
          labelId="sort-by-label"
          value={sortField}
          label="Ordenar por"
          onChange={(e) =>
            setSortField(e.target.value as 'fecha' | 'valoracion')
          }
        >
          <MenuItem value="fecha">Fecha</MenuItem>
          <MenuItem value="valoracion">Valoración</MenuItem>
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={toggleOrder}
        startIcon={isAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        sx={{ borderRadius: 2, textTransform: 'none' }}
      >
        {isAsc ? 'Ascendente' : 'Descendente'}
      </Button>
    </Box>
  )
}

export default SortDropdown
