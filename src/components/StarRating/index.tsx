import React, { useState } from 'react'
import { Box, Rating, Typography, Stack } from '@mui/material'
import { Star as StarIcon } from '@mui/icons-material'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  totalRatings?: number
  size?: 'small' | 'medium' | 'large'
}

const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  totalRatings,
  size = 'medium',
}) => {
  const [hover, setHover] = useState(-1)

  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center">
        <Rating
          value={value}
          onChange={(_, newValue) => {
            if (onChange && newValue !== null) {
              onChange(newValue)
            }
          }}
          onChangeActive={(_, newHover) => {
            setHover(newHover)
          }}
          readOnly={readOnly}
          precision={0.5}
          size={size}
          icon={<StarIcon fontSize="inherit" />}
          emptyIcon={<StarIcon fontSize="inherit" />}
          sx={{
            '& .MuiRating-iconFilled': {
              color: '#ffc107',
            },
            '& .MuiRating-iconHover': {
              color: '#ffb300',
            },
          }}
        />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500, minWidth: '60px' }}
        >
          {hover !== -1 ? hover.toFixed(1) : value.toFixed(1)}
          {totalRatings !== undefined && (
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              sx={{ ml: 0.5 }}
            >
              ({totalRatings})
            </Typography>
          )}
        </Typography>
      </Stack>
    </Box>
  )
}

export default StarRating

