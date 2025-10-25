import React, { useState, useEffect } from 'react'
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material'
import { Contribution } from '@/types'

interface SortDropdownProps {
  contributions: Contribution[]
  setContributions: React.Dispatch<React.SetStateAction<Contribution[]>>
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  contributions,
  setContributions,
}) => {
  const [sortOption, setSortOption] = useState<string>('fecha-desc')

  // Reorder whenever the sort option changes
  useEffect(() => {
    sortContributions(sortOption)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortOption])

  const sortContributions = (option: string) => {
    const [field, order] = option.split('-')
    const sorted = [...contributions].sort((a, b) => {
      if (field === 'fecha') {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return order === 'asc' ? dateA - dateB : dateB - dateA
      } else {
        const ratingA = a.averageRating ?? 0
        const ratingB = b.averageRating ?? 0
        return order === 'asc' ? ratingA - ratingB : ratingB - ratingA
      }
    })
    setContributions(sorted)
  }

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortOption(event.target.value)
  }

  return (
    <Box>
      <FormControl size="small" sx={{ minWidth: 220 }}>
        <InputLabel id="sort-label">Ordenar por</InputLabel>
        <Select
          labelId="sort-label"
          value={sortOption}
          label="Ordenar por"
          onChange={handleSortChange}
        >
          <MenuItem value="fecha-desc">Más recientes</MenuItem>
          <MenuItem value="fecha-asc">Más antiguos</MenuItem>
          <MenuItem value="valoracion-desc">Mayor valoración</MenuItem>
          <MenuItem value="valoracion-asc">Menor valoración</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default SortDropdown
