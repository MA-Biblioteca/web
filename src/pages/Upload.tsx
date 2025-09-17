import { Box, Typography } from '@mui/material'

const Upload = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 64px)"
    >
      <Typography variant="h1" component="h1">
        Subir aporte
      </Typography>
    </Box >
  )
}

export default Upload